package com.mehtasankets.mmflow.domain

data class Summary (
    var monthToDateSummary: SummaryData? = null,
    var yearToDateSummary: SummaryData? = null
)

data class SummaryData (
    var total: Double = 0.0,
    var previousTotal: Double = 0.0,
    var totalByCategory: Map<String, Double?> = mapOf(),
    var totalByUser: Map<String, Double?>? = mapOf()
)