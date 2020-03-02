package com.mehtasankets.mmflow

import io.ktor.application.*
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
    routing {
        get("/get-expenses-for-month/{month?}") {
            var month: Int = Integer.valueOf(call.parameters["month"] ?: ZonedDateTime.now().month.value.toString())
            var str = "$month"
            call.response.header("Access-Control-Allow-Origin", "*")
            call.respondText(str, ContentType.Application.Json)
        }
    }
}