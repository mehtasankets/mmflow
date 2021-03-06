package com.mehtasankets.mmflow.domain

import java.time.Instant

data class Expense (
    val expenseSheetName: String,
    val id: Long,
    val date: Instant,
    val description: String,
    val category: String,
    val paidBy: String,
    val amount: Double
)