const webApiUrl = "http://192.168.1.22:8090/expense/"
const userSessionHeader = "X-User-Session"

class ExpenseService {
    fetchExpenseSheets = async (user) => {
        const headers = new Headers()
        headers.append(userSessionHeader, user.sessionId)
        const options = {
            credentials: "include",
            method: "GET",
            headers
        }
        const request = new Request(webApiUrl + `expenseSheets`, options)
        const response = await fetch(request)
        return response.json()
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
        return response.json()
    }
    fetchSummary = async (user, expenseSheetName) => {
        const headers = new Headers()
        headers.append(userSessionHeader, user.sessionId)
        const options = {
            credentials: "include",
            method: "GET",
            headers
        }
        const request = new Request(webApiUrl + `summary?expenseSheetName=${expenseSheetName}`, options)
        const response = await fetch(request)
        return response.json()
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
        return response.json()
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
        return response.json()
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
        return response.json()
    }
}
const expenseService = new ExpenseService()
export default expenseService