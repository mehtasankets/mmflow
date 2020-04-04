package com.mehtasankets.mmflow.dao

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.mehtasankets.mmflow.domain.Expense
import com.mehtasankets.mmflow.domain.ExpenseSheet
import com.mehtasankets.mmflow.domain.SummaryData
import com.mehtasankets.mmflow.domain.User
import java.sql.DriverManager
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

    fun fetchExpenseSheets(user: User): List<ExpenseSheet> {
        val query = """
            SELECT user_identity, name, description, shared_with FROM expense_sheets
            WHERE user_identity = ? OR shared_with like ?;
        """.trimIndent()
        val expenseSheets = mutableListOf<ExpenseSheet>()
        createConnection().let { conn ->
            conn.prepareStatement(query).let { stmt ->
                stmt.setString(1, user.identity)
                stmt.setString(2, "%${user.identity}%")
                stmt.executeQuery().let { rs ->
                    while (rs.next()) {
                        expenseSheets.add(
                            ExpenseSheet(
                                rs.getString("user_identity"),
                                rs.getString("name"),
                                rs.getString("description"),
                                rs.getString("shared_with")?.split("###")?.toMutableList() ?: mutableListOf<String>()
                            )
                        )
                    }
                }
            }
        }
        return expenseSheets
    }

    fun insertExpenseSheets(expenseSheets: List<ExpenseSheet>): Int {
        val query = """
            INSERT INTO expense_sheets (user_identity, name, description, shared_with)
            VALUES (?, ?, ?, ?)
        """.trimIndent()
        val connection = createConnection()
        val statement = connection.prepareStatement(query)
        for (expenseSheet in expenseSheets) {
            statement.setString(1, expenseSheet.userIdentity)
            statement.setString(2, expenseSheet.name)
            statement.setString(3, expenseSheet.description)
            statement.setString(4, expenseSheet.sharedWith.joinToString { "###" })
            statement.addBatch()
        }
        return statement.executeUpdate()
    }

    fun insertExpenses(expenses: List<Expense>): Int {
        val query = """
            INSERT INTO expenses (${getColumnNames().filter { it != "id" }.joinToString()})
            VALUES(${getColumnNames().filter { it != "id" }.joinToString { "?" }});
        """.trimIndent()
        val connection = createConnection()
        val statement = connection.prepareStatement(query)
        for (expense in expenses) {
            statement.setString(1, expense.expenseSheetName)
            statement.setString(2, expense.date.toString())
            statement.setString(3, expense.description)
            statement.setString(4, expense.category)
            statement.setString(5, expense.paidBy)
            statement.setDouble(6, expense.amount)
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
            AND expense_sheet_name = ?
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
            statement.setString(7, expense.expenseSheetName)
            statement.addBatch()
        }
        return statement.executeUpdate()
    }

    fun deleteExpenseSheets(expenseSheetNames: List<String>): Int {
        if (expenseSheetNames.isEmpty()) {
            return 0
        }
        val query = """
            DELETE FROM expense_sheets 
            WHERE name in ${expenseSheetNames.joinToString(",", "(", ")")}
        """.trimIndent()
        val connection = createConnection()
        val statement = connection.prepareStatement(query)
        return statement.executeUpdate()
    }

    fun deleteExpenses(expenseSheetName: String, expenseIds: List<Long>): Int {
        if (expenseIds.isEmpty()) {
            return 0
        }
        val query = """
            DELETE FROM expenses 
            WHERE id in ${expenseIds.joinToString(",", "(", ")")}
            AND expense_sheet_name = ?
        """.trimIndent()
        val connection = createConnection()
        val statement = connection.prepareStatement(query)
        statement.setString(1, expenseSheetName)
        return statement.executeUpdate()
    }

    fun fetchExpenses(expenseSheetName: String, startDateIncluding: Instant, endDateExcluding: Instant): List<Expense> {
        val query = """
            SELECT ${getColumnNames().joinToString()} FROM expenses 
            WHERE date BETWEEN ? AND ?
            AND expense_sheet_name = ?
            ;
        """.trimIndent()
        val expenses = mutableListOf<Expense>()
        createConnection().let { conn ->
            conn.prepareStatement(query).let { stmt ->
                stmt.setString(1, startDateIncluding.toString())
                stmt.setString(2, endDateExcluding.toString())
                stmt.setString(3, expenseSheetName)
                stmt.executeQuery().let { rs ->
                    while (rs.next()) {
                        expenses.add(
                            Expense(
                                rs.getString("expense_sheet_name"),
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
        expenseSheetName: String,
        startDateIncluding: Instant,
        endDateExcluding: Instant,
        prevStartDateIncluding: Instant,
        prevEndDateExcluding: Instant
    ): SummaryData {
        val expenses = fetchExpenses(expenseSheetName, startDateIncluding, endDateExcluding)
        val prevExpenses = fetchExpenses(expenseSheetName, prevStartDateIncluding, prevEndDateExcluding)
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
        return SummaryData(
            total,
            previousTotal,
            totalByCategory,
            totalByUser
        )
    }

    fun shareExpenseSheets(data: List<Pair<String, String>>): Int {
        val expenseSheets = fetchExpenseSheetsByNames(data.map { it.first })
        val expenseSheetsMap = expenseSheets.associateBy { it.name }
        val enrichedSheets = data.filter { expenseSheetsMap.containsKey(it.first) }.map {
            val expenseSheet = expenseSheetsMap.getValue(it.first)
            if (!expenseSheet.sharedWith.contains(it.second)) {
                expenseSheet.sharedWith.add(it.second)
            }
            expenseSheet
        }

        val query = """
            UPDATE expense_sheets 
            SET shared_with = ?
            WHERE name = ?
        """.trimIndent()
        val connection = createConnection()
        val statement = connection.prepareStatement(query)
        for (expenseSheet in enrichedSheets) {
            statement.setString(1, expenseSheet.sharedWith.joinToString { "###" })
            statement.setString(2, expenseSheet.name)
            statement.addBatch()
        }
        return statement.executeUpdate()
    }

    private fun fetchExpenseSheetsByNames(names: List<String>): List<ExpenseSheet> {
        val query = """
            SELECT user_identity, name, description FROM expense_sheets
            WHERE name in ${names.joinToString(",", "(", ")")};
        """.trimIndent()
        val expenseSheets = mutableListOf<ExpenseSheet>()
        createConnection().let { conn ->
            conn.prepareStatement(query).let { stmt ->
                stmt.executeQuery().let { rs ->
                    while (rs.next()) {
                        expenseSheets.add(
                            ExpenseSheet(
                                rs.getString("user_identity"),
                                rs.getString("name"),
                                rs.getString("description"),
                                rs.getString("shared_with").split("###").toMutableList()
                            )
                        )
                    }
                }
            }
        }
        return expenseSheets
    }

    private fun getColumnNames() =
        listOf("expense_sheet_name", "id", "date", "description", "category", "paid_by", "amount")
}
