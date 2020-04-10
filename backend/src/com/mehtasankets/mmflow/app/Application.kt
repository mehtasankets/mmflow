package com.mehtasankets.mmflow.app

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.module.kotlin.readValue
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import com.mehtasankets.mmflow.dao.Db
import com.mehtasankets.mmflow.domain.*
import com.mehtasankets.mmflow.util.AuthenticationUtil
import com.mehtasankets.mmflow.util.Constants
import io.ktor.application.*
import io.ktor.features.CORS
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.request.receiveText
import io.ktor.request.uri
import io.ktor.response.respondText
import io.ktor.routing.*
import io.ktor.sessions.Sessions
import io.ktor.sessions.header
import io.ktor.sessions.sessions
import java.time.Instant
import java.time.ZoneId
import java.time.temporal.TemporalAdjusters
import java.util.*
import kotlin.math.exp


val objectMapper: ObjectMapper = ObjectMapper().findAndRegisterModules()
    .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
val db = Db()
val loggedInUsersCache = mutableMapOf<String, User>()
var verifier: GoogleIdTokenVerifier =
    GoogleIdTokenVerifier.Builder(NetHttpTransport(), JacksonFactory.getDefaultInstance())
        .setAudience(listOf("1034128931991-b5lgu67qod6vbsgilml6ir7iuaffqevk.apps.googleusercontent.com"))
        .build()


fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {

    install(CORS) {
        method(HttpMethod.Head)
        method(HttpMethod.Delete)
        method(HttpMethod.Get)
        method(HttpMethod.Options)
        method(HttpMethod.Patch)
        method(HttpMethod.Put)
        method(HttpMethod.Post)
        header(HttpHeaders.ContentType)
        header(Constants.USER_SESSION_HEADER)
        exposeHeader(Constants.USER_SESSION_HEADER)
        anyHost()
        allowCredentials = true
    }

    install(Sessions) {
        header<UserSession>(Constants.USER_SESSION_HEADER)
    }

    intercept(ApplicationCallPipeline.Call) {
        if (!call.request.uri.contains("/login")) {
            val authenticationResult = AuthenticationUtil.authenticate(call)
            if (!authenticationResult.first) {
                call.respondText("Unauthenticated call", status = HttpStatusCode.Unauthorized)
            }
        }
    }

    routing {
        route("/expense") {

            post("/login") {
                val sessionId = "${UUID.randomUUID()}-${System.currentTimeMillis()}"
                val user = objectMapper.readValue<User>(call.receiveText())
                val idToken: GoogleIdToken = verifier.verify(user.idToken)
                if (idToken == null) {
                    call.respondText("User is not authenticated", status = HttpStatusCode.Unauthorized)
                }
                user.identity = idToken.payload.subject
                user.sessionId = sessionId
                loggedInUsersCache[sessionId] = user
                call.sessions.set(Constants.USER_SESSION_HEADER, UserSession(sessionId))
                call.respondText { "${user.displayName} Logged in successfully." }
            }

            get("/logout") {
                // Validate the token
                val userSession = call.sessions.get(Constants.USER_SESSION_HEADER) as UserSession
                val user = loggedInUsersCache.remove(userSession.sessionId)
                call.sessions.clear(Constants.USER_SESSION_HEADER)
                call.respondText { "${user?.displayName} Logged out successfully." }
            }

            get("/expenseSheet") {
                val user = getUser(call)
                val expenseSheets = db.fetchExpenseSheets(user)
                val filteredSheets =
                    expenseSheets.filter { it.name != user.identity && !it.sharedWith.contains(user.identity) }
                val serializedExpenseSheets = objectMapper.writeValueAsString(filteredSheets)
                call.respondText(serializedExpenseSheets, ContentType.Application.Json)
            }

            get {
                val expenseSheetName = call.parameters["expenseSheetName"] ?: ""
                val monthStart = Instant.now().atZone(ZoneId.systemDefault()).withDayOfMonth(1).toInstant()
                val startDate = Instant.parse(call.parameters["startDate"] ?: monthStart.toString())
                val endDate = Instant.parse(call.parameters["endDate"] ?: Instant.now().toString())
                val expenses = db.fetchExpenses(expenseSheetName, startDate, endDate)
                val serializedExpenses = objectMapper.writeValueAsString(expenses)
                call.respondText(serializedExpenses, ContentType.Application.Json)
            }

            get("/summary") {
                val expenseSheetName = call.parameters["expenseSheetName"] ?: ""
                val monthStart = Instant.now().atZone(ZoneId.systemDefault()).withDayOfMonth(1).toInstant()
                val monthEnd =
                    Instant.now().atZone(ZoneId.systemDefault()).with(TemporalAdjusters.lastDayOfMonth()).toInstant()
                val prevMonthStart =
                    Instant.now().atZone(ZoneId.systemDefault()).minusMonths(1).withDayOfMonth(1).toInstant()
                val prevMonthEnd =
                    Instant.now().atZone(ZoneId.systemDefault()).minusMonths(1).with(TemporalAdjusters.lastDayOfMonth())
                        .toInstant()

                val yearStart = Instant.now().atZone(ZoneId.systemDefault()).withMonth(1).withDayOfMonth(1).toInstant()
                val yearEnd =
                    Instant.now().atZone(ZoneId.systemDefault()).withMonth(12).with(TemporalAdjusters.lastDayOfMonth())
                        .toInstant()
                val prevYearStart =
                    yearStart.atZone(ZoneId.systemDefault()).minusYears(1).withDayOfMonth(1).toInstant()
                val prevYearEnd =
                    yearEnd.atZone(ZoneId.systemDefault()).minusYears(1).with(TemporalAdjusters.lastDayOfMonth())
                        .toInstant()

                val monthlySummaryData =
                    db.fetchSummary(expenseSheetName, monthStart, monthEnd, prevMonthStart, prevMonthEnd)
                val yearlySummaryData =
                    db.fetchSummary(expenseSheetName, yearStart, yearEnd, prevYearStart, prevYearEnd)
                val summary =
                    Summary(monthlySummaryData, yearlySummaryData)

                val serializedSummary = objectMapper.writeValueAsString(summary)
                call.respondText(serializedSummary, ContentType.Application.Json)
            }

            post("/expenseSheet") {
                val user = getUser(call)
                val expenseSheets = objectMapper.readValue<List<ExpenseSheet>>(call.receiveText())
                expenseSheets.map { it.userIdentity = user.identity }
                val count = db.insertExpenseSheets(expenseSheets)
                call.respondText(count.toString(), ContentType.Application.Json)
            }

            post {
                val expenses = objectMapper.readValue<List<Expense>>(call.receiveText())
                val count = db.insertExpenses(expenses)
                call.respondText(count.toString(), ContentType.Application.Json)
            }

            put {
                val expenses = objectMapper.readValue<List<Expense>>(call.receiveText())
                val count = db.updateExpenses(expenses)
                call.respondText(count.toString(), ContentType.Application.Json)
            }

            put("/expenseSheet/share") {
                val data = objectMapper.readValue<List<Pair<String, String>>>(call.receiveText())
                val count = db.shareExpenseSheets(data)
                call.respondText(count.toString(), ContentType.Application.Json)
            }

            delete("/expenseSheet") {
                val user = getUser(call)
                val data = objectMapper.readValue<List<String>>(call.receiveText())
                val count = db.deleteExpenseSheets(user, data)
                call.respondText(count.toString(), ContentType.Application.Json)
            }

            delete {
                val data = objectMapper.readValue<Map<String, Any>>(call.receiveText())
                val expenseSheetName = data["expenseSheetName"] as String
                val expenseIds = data["expenseIds"] as List<Long>
                val count = db.deleteExpenses(expenseSheetName, expenseIds)
                call.respondText(count.toString(), ContentType.Application.Json)
            }
        }
    }
}

fun getUser(call: ApplicationCall): User {
    val userSession = call.sessions.get(Constants.USER_SESSION_HEADER) as UserSession
    return loggedInUsersCache[userSession.sessionId]!!
}
