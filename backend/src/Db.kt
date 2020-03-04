package com.mehtasankets.mmflow

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.sql.DriverManager
import java.sql.Timestamp
import java.time.Instant


class Db() {
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

    fun fetchExpenses(startDateIncluding: Instant, endDateExcluding: Instant): List<Expense> {
        val query = """
            SELECT ${getColumnNames().joinToString()} FROM expenses 
            ;
        """.trimIndent()
        val expenses = mutableListOf<Expense>()
        createConnection().let { conn ->
            conn.prepareStatement(query).let { stmt ->
                /*stmt.setTimestamp(1, Timestamp.from(startDateIncluding))
                stmt.setTimestamp(2, Timestamp.from(endDateExcluding))*/
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

    private fun getColumnNames() = listOf("id", "date", "description", "category", "paid_by", "amount")
}