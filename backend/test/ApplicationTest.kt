package com.mehtasankets.mmflow

import com.mehtasankets.mmflow.app.module
import io.ktor.http.*
import kotlin.test.*
import io.ktor.server.testing.*

class ApplicationTest {
    @Test
    fun testRoot() {
        withTestApplication({ module(testing = true) }) {
            handleRequest(HttpMethod.Get, "/").apply {
                assertEquals(HttpStatusCode.Unauthorized, response.status())
                assertEquals("Unauthenticated call", response.content)
            }
        }
    }
}
