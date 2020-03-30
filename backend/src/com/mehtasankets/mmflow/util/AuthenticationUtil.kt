package com.mehtasankets.mmflow.util

import com.mehtasankets.mmflow.domain.UserSession
import io.ktor.application.ApplicationCall
import io.ktor.sessions.sessions

object AuthenticationUtil {
    fun authenticate(call: ApplicationCall): Pair<Boolean, String> {
        val userSession = call.sessions.get(Constants.USER_SESSION_HEADER)
        if (userSession == null || (userSession as UserSession).sessionId == "unknown") {
            return false to "unknown"
        }
        return true to userSession.sessionId
    }
}