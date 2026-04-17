const webApiUrl = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8090/expense"
    : "http://mmflow-backend.mehtasanket.in/expense"
const userSessionHeader = "X-User-Session"

const parseJsonOrThrow = async (response) => {
    if (!response.ok) {
        throw new Error(await response.text())
    }
    return response.json()
}

class ExpenseService {
    fetchExpenseSheets = async (user) => {
        const headers = new Headers()
        headers.append(userSessionHeader, user.sessionId)
        const options = {
            credentials: "include",
            method: "GET",
            headers
        }
        const request = new Request(webApiUrl + `/expenseSheet`, options)
        const response = await fetch(request)
        return parseJsonOrThrow(response)
    }

    createExpenseSheets = async (user, expenseSheets) => {
        const headers = new Headers()
        headers.append(userSessionHeader, user.sessionId)
        headers.append("Content-Type", "application/json")
        var options = {
            credentials: "include",
            method: "POST",
            headers,
            body: JSON.stringify(expenseSheets)
        }
        const request = new Request(webApiUrl + `/expenseSheet`, options)
        const response = await fetch(request)
        return parseJsonOrThrow(response)
    }

    shareExpenseSheets = async (user, sharingDetails) => {
        const headers = new Headers()
        headers.append(userSessionHeader, user.sessionId)
        headers.append("Content-Type", "application/json")
        var options = {
            credentials: "include",
            method: "PUT",
            headers,
            body: JSON.stringify(sharingDetails)
        }
        const request = new Request(webApiUrl + `/expenseSheet`, options)
        const response = await fetch(request)
        return parseJsonOrThrow(response)
    }

    deleteExpenseSheets = async (user, expenseSheetNames) => {
        const headers = new Headers()
        headers.append(userSessionHeader, user.sessionId)
        headers.append("Content-Type", "application/json")
        var options = {
            credentials: "include",
            method: "DELETE",
            headers,
            body: JSON.stringify(expenseSheetNames)
        }
        const request = new Request(webApiUrl + `/expenseSheet`, options)
        const response = await fetch(request)
        return parseJsonOrThrow(response)
    }

    get = async (user, expenseSheetName, startDate, endDate) => {
        const headers = new Headers()
        headers.append(userSessionHeader, user.sessionId)
        const options = {
            credentials: "include",
            method: "GET",
            headers
        }
        const request = new Request(webApiUrl + `?expenseSheetName=${expenseSheetName}&startDate=${startDate}&endDate=${endDate}`, options)
        const response = await fetch(request)
        return parseJsonOrThrow(response)
    }
    fetchSummary = async (user, expenseSheetName) => {
        const headers = new Headers()
        headers.append(userSessionHeader, user.sessionId)
        const options = {
            credentials: "include",
            method: "GET",
            headers
        }
        const request = new Request(webApiUrl + `/summary?expenseSheetName=${expenseSheetName}`, options)
        const response = await fetch(request)
        return parseJsonOrThrow(response)
    }
    post = async(user, expenseSheetName, expenses) => {
        expenses.map(e => e.expenseSheetName = expenseSheetName)
        const headers = new Headers()
        headers.append(userSessionHeader, user.sessionId)
        headers.append("Content-Type", "application/json")
        var options = {
            credentials: "include",
            method: "POST",
            headers,
            body: JSON.stringify(expenses)
        }
        const request = new Request(webApiUrl, options)
        const response = await fetch(request)
        return parseJsonOrThrow(response)
    }
    put = async(user, expenseSheetName, expenses) => {
        expenses.map(e => e.expenseSheetName = expenseSheetName)
        const headers = new Headers()
        headers.append(userSessionHeader, user.sessionId)
        headers.append("Content-Type", "application/json")
        var options = {
            credentials: "include",
            method: "PUT",
            headers,
            body: JSON.stringify(expenses)
        }
        const request = new Request(webApiUrl, options)
        const response = await fetch(request)
        return parseJsonOrThrow(response)
    }
    delete = async(user, expenseSheetName, expenseIds) => {
        const data = { expenseSheetName: expenseSheetName, expenseIds: expenseIds }
        const headers = new Headers()
        headers.append(userSessionHeader, user.sessionId)
        headers.append("Content-Type", "application/json")
        var options = {
            credentials: "include",
            method: "DELETE",
            headers,
            body: JSON.stringify(data)
        }
        const request = new Request(webApiUrl, options)
        const response = await fetch(request)
        return parseJsonOrThrow(response)
    }
}
const expenseService = new ExpenseService()
export default expenseService
