package com.mehtasankets.mmflow.dao

import java.io.File
import java.sql.DriverManager

fun main() {
    val dbPath = System.getenv("MMFLOW_DB_PATH") ?: error("MMFLOW_DB_PATH must be set for DB bootstrap")
    val dbFile = File(dbPath)
    dbFile.parentFile?.mkdirs()

    if (dbFile.exists() && dbFile.length() > 0L) {
        println("Skipping DB bootstrap; existing database found at $dbPath")
        return
    }

    val dbUrl = "jdbc:sqlite:$dbPath"
    val migrationFiles = listOf("v0.sql", "v1.sql", "v2.sql")
    DriverManager.getConnection(dbUrl).use { conn ->
        conn.autoCommit = false
        try {
            migrationFiles.forEach { resourceName ->
                val sql = loadResource(resourceName)
                executeSqlStatements(conn, sql)
            }
            conn.commit()
            println("Initialized local database at $dbPath")
        } catch (e: Exception) {
            conn.rollback()
            throw e
        }
    }
}

private fun loadResource(resourceName: String): String {
    val resource = Thread.currentThread().contextClassLoader.getResourceAsStream(resourceName)
        ?: error("Missing resource: $resourceName")
    return resource.bufferedReader().use { it.readText() }
}

private fun executeSqlStatements(conn: java.sql.Connection, sql: String) {
    sql.split(";")
        .map { it.trim() }
        .filter { it.isNotEmpty() }
        .forEach { statement ->
            conn.createStatement().use { stmt ->
                stmt.executeUpdate(statement)
            }
        }
}
