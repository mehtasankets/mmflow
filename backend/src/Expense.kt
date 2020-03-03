package com.mehtasankets.mmflow

import java.time.Instant

data class Expense (
    val id: Long,
    val date: Instant,
    val description: String,
    val category: String,
    val paidBy: String,
    val amount: Double
)