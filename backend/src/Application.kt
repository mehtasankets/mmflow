package com.mehtasankets.mmflow

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.ktor.application.*
import io.ktor.features.CORS
import io.ktor.response.*
import io.ktor.request.*
import io.ktor.routing.*
import io.ktor.http.*
import io.ktor.html.*
import kotlinx.html.*
import kotlinx.css.*
import java.time.Instant
import java.time.Month
import java.time.ZonedDateTime

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {
    install(CORS) {
        header(HttpHeaders.ContentType)
        anyHost()
    }
    val objectMapper = ObjectMapper().findAndRegisterModules()
        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
    val db = Db()
    routing {
        get("/get-expenses-for-month/{month?}") {
            val month: Int = Integer.valueOf(call.parameters["month"] ?: ZonedDateTime.now().month.value.toString())
            val expenses = db.fetchExpenses(Instant.EPOCH, Instant.now())
            val serializedExpenses = objectMapper.writeValueAsString(expenses)
            call.respondText(serializedExpenses, ContentType.Application.Json)
        }

        post("/upsert/") {
            val expenses = objectMapper.readValue<List<Expense>>(call.receiveText() ?: "[]")
            val count = db.insertExpenses(expenses)
            call.respondText(count.toString(), ContentType.Application.Json)
        }
    }
}