package com.mehtasankets.mmflow

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.sql.DriverManager
import java.sql.Timestamp
import java.time.Instant


class Db() {
    private lateinit var dbUrl: String
    private lateinit var objectMapper: ObjectMapper

    init {
        val dbPath = System.getenv("MMFLOW_DB_NAME")
        dbUrl = "jdbc:sqlite:$dbPath"
        objectMapper = jacksonObjectMapper()
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
            statement.setTimestamp(1, Timestamp.from(expense.date))
            statement.setString(2, expense.description)
            statement.setString(3, expense.category)
            statement.setString(4, expense.paidBy)
            statement.setDouble(5, expense.amount)
            statement.addBatch()
        }
        return statement.executeUpdate()
    }

    fun fetchExpenses(startDateIncluding: Instant, endDateExcluding: Instant): List<Expense> {
        val query = """
            SELECT ${getColumnNames().joinToString()} FROM expenses 
            WHERE date >= ? AND date < ?;
        """.trimIndent()
        val expenses = mutableListOf<Expense>()
        createConnection().let { conn ->
            conn.createStatement().let { stmt ->
                stmt.executeQuery(query).let { rs ->
                    while (rs.next()) {
                        expenses.add(
                            Expense(
                                rs.getLong("id"),
                                rs.getTimestamp("date").toInstant(),
                                rs.getString("description"),
                                rs.getString("category"),
                                rs.getString("paidBy"),
                                rs.getDouble("amount")
                            )
                        )
                    }
                }
            }
        }
        return expenses
    }

    private fun getColumnNames() = listOf("id", "date", "description", "category", "paidBy", "amount")
}