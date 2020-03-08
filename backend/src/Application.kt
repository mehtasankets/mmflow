package com.mehtasankets.mmflow

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.module.kotlin.readValue
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.features.CORS
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.request.receiveText
import io.ktor.response.respondText
import io.ktor.routing.*
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
        anyHost()
    }

    val objectMapper = ObjectMapper().findAndRegisterModules()
        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
    val db = Db()

    routing {
        route("/expense") {
            get {
                val monthStart = Instant.now().atZone(ZoneId.systemDefault()).withDayOfMonth(1).toInstant()
                val startDate = Instant.parse(call.parameters["startDate"] ?: monthStart.toString())
                val endDate = Instant.parse(call.parameters["startDate"] ?: Instant.now().toString())
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