package com.mehtasankets.mmflow.domain

import java.time.Instant

data class Expense (
    var expenseSheetName: String = "",
    var id: Long = 0,
    var date: Instant = Instant.now(),
    var description: String = "",
    var category: String = "",
    var paidBy: String = "",
    var amount: Double = 0.0
)