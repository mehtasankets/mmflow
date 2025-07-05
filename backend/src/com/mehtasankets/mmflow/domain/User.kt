package com.mehtasankets.mmflow.domain

data class User(
    var sessionId: String? = null,
    var idToken: String = "",
    var identity: String? = null,
    var displayName: String = "",
    var profilePicUrl: String = ""
)