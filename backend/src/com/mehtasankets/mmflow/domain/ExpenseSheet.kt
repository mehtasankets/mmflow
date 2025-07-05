package com.mehtasankets.mmflow.domain

data class ExpenseSheet (
    var userIdentity: String? = null,
    var name: String = "",
    var description: String = "",
    var sharedWith: MutableList<String> = mutableListOf()
)