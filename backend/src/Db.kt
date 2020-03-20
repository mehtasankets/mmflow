package com.mehtasankets.mmflow

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import java.sql.DriverManager
import java.sql.Timestamp
import java.time.Instant


class Db {
    private var dbUrl: String
    private var objectMapper: ObjectMapper

    init {
        val dbPath = System.getenv("MMFLOW_DB_NAME")
        dbUrl = "jdbc:sqlite:$dbPath"
        objectMapper = ObjectMapper().findAndRegisterModules()
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
    }

    private fun createConnection() = DriverManager.getConnection(dbUrl)

    fun insertExpenses(expenses: List<Expense>): Int {
        val query = """
            INSERT INTO expenses (${getColumnNames().filter { it != "id" }.joinToString()})
            VALUES(${getColumnNames().filter { it != "id" }.joinToString { "?" }});
        """.trimIndent()
        val connection = createConnection()
        val statement = connection.prepareStatement(query)
        for (expense in expenses) {
            statement.setString(1, expense.date.toString())
            statement.setString(2, expense.description)
            statement.setString(3, expense.category)
            statement.setString(4, expense.paidBy)
            statement.setDouble(5, expense.amount)
            statement.addBatch()
        }
        return statement.executeUpdate()
    }

    fun updateExpenses(expenses: List<Expense>): Int {
        val query = """
            UPDATE expenses 
            SET
                date = ?,
                description = ?,
                category = ?,
                paid_by = ?,
                amount = ?
            WHERE id = ?
        """.trimIndent()
        val connection = createConnection()
        val statement = connection.prepareStatement(query)
        for (expense in expenses) {
            statement.setString(1, expense.date.toString())
            statement.setString(2, expense.description)
            statement.setString(3, expense.category)
            statement.setString(4, expense.paidBy)
            statement.setDouble(5, expense.amount)
            statement.setLong(6, expense.id)
            statement.addBatch()
        }
        return statement.executeUpdate()
    }

    fun deleteExpenses(expenseIds: List<Long>): Int {
        if (expenseIds.isEmpty()) {
            return 0
        }
        val query = """
            DELETE FROM expenses 
            WHERE id in ${expenseIds.joinToString(",", "(", ")")}
        """.trimIndent()
        val connection = createConnection()
        val statement = connection.prepareStatement(query)
        return statement.executeUpdate()
    }

    fun fetchExpenses(startDateIncluding: Instant, endDateExcluding: Instant): List<Expense> {
        val query = """
            SELECT ${getColumnNames().joinToString()} FROM expenses
            WHERE date BETWEEN ? AND ?
            ;
        """.trimIndent()
        val expenses = mutableListOf<Expense>()
        createConnection().let { conn ->
            conn.prepareStatement(query).let { stmt ->
                stmt.setString(1, startDateIncluding.toString())
                stmt.setString(2, endDateExcluding.toString())
                stmt.executeQuery().let { rs ->
                    while (rs.next()) {
                        expenses.add(
                            Expense(
                                rs.getLong("id"),
                                Instant.parse(rs.getString("date")),
                                rs.getString("description"),
                                rs.getString("category"),
                                rs.getString("paid_by"),
                                rs.getDouble("amount")
                            )
                        )
                    }
                }
            }
        }
        return expenses
    }

    fun fetchSummary(
        startDateIncluding: Instant,
        endDateExcluding: Instant,
        prevStartDateIncluding: Instant,
        prevEndDateExcluding: Instant
    ): SummaryData {
        val expenses = fetchExpenses(startDateIncluding, endDateExcluding)
        val prevExpenses = fetchExpenses(prevStartDateIncluding, prevEndDateExcluding)
        val total = expenses.map { it.amount }.sum()
        val previousTotal = prevExpenses.map { it.amount }.sum()
        val totalByCategory = expenses.groupingBy { it.category }.aggregate { _, accumulator: Double?, element, _ ->
            when (accumulator) {
                null -> element.amount
                else -> accumulator + element.amount
            }
        }
        val totalByUser = expenses.groupingBy { it.paidBy }.aggregate { _, accumulator: Double?, element, first ->
            if (first) {
                element.amount
            } else {
                accumulator!! + element.amount
            }
        }
        return SummaryData(total, previousTotal, totalByCategory, totalByUser)
    }

    private fun getColumnNames() = listOf("id", "date", "description", "category", "paid_by", "amount")
}