package com.mehtasankets.mmflow.domain

data class ExpenseSheet (
    val userIdentity: String,
    val name: String,
    val description: String,
    val sharedWith: MutableList<String>
)