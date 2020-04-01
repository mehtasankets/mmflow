package com.mehtasankets.mmflow.domain

data class User(
    var sessionId: String?,
    val idToken: String,
    var identity: String?,
    val displayName: String,
    val profilePicUrl: String
)