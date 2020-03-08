package com.mehtasankets.mmflow

data class Summary (
    val monthToDateSummary: SummaryData,
    val yearToDateSummary: SummaryData
)

data class SummaryData (
    val total: Double,
    val previousTotal: Double,
    val totalByCategory: Map<String, Double>,
    val totalByUser: Map<String, Double>
)