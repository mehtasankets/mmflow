package com.mehtasankets.mmflow

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.module.kotlin.readValue
import io.ktor.application.Application
import io.ktor.application.ApplicationCallPipeline
import io.ktor.application.call
import io.ktor.application.install
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

    val objectMapper = ObjectMapper().findAndRegisterModules()
        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
    val db = Db()

    routing {
        route("/expense") {

            post("/login") {
                // Validate the token
                val user = objectMapper.readValue<Map<String, String>>(call.receiveText())
                val token = user["idToken"]
                call.sessions.set(Constants.USER_SESSION_HEADER, UserSession(token ?: "unknown"))
                call.respondText { "$token Logged in successfully." }
            }

            get("/logout") {
                // Validate the token
                val userSession = call.sessions.get(Constants.USER_SESSION_HEADER) as UserSession
                call.sessions.clear(Constants.USER_SESSION_HEADER)
                call.respondText { "${userSession.token} Logged out successfully." }
            }

            get {
                val monthStart = Instant.now().atZone(ZoneId.systemDefault()).withDayOfMonth(1).toInstant()
                val startDate = Instant.parse(call.parameters["startDate"] ?: monthStart.toString())
                val endDate = Instant.parse(call.parameters["endDate"] ?: Instant.now().toString())
                val expenses = db.fetchExpenses(startDate, endDate)
                val serializedExpenses = objectMapper.writeValueAsString(expenses)
                call.respondText(serializedExpenses, ContentType.Application.Json)
            }

            get("/summary") {
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

                val monthlySummaryData = db.fetchSummary(monthStart, monthEnd, prevMonthStart, prevMonthEnd)
                val yearlySummaryData = db.fetchSummary(yearStart, yearEnd, prevYearStart, prevYearEnd)
                val summary = Summary(monthlySummaryData, yearlySummaryData)

                val serializedSummary = objectMapper.writeValueAsString(summary)
                call.respondText(serializedSummary, ContentType.Application.Json)
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

            delete {
                val expenseIds = objectMapper.readValue<List<Long>>(call.receiveText())
                val count = db.deleteExpenses(expenseIds)
                call.respondText(count.toString(), ContentType.Application.Json)
            }
        }
    }


}