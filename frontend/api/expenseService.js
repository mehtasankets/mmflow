const webApiUrl = "http://192.168.1.22:8090/expense/"
const userSessionHeader = "X-User-Session"

class ExpenseService {
    fetchExpenseSheets = async (user) => {
        const headers = new Headers();
        headers.append(userSessionHeader, user.sessionId);
        const options = {
            credentials: "include",
            method: "GET",
            headers
        }
        const request = new Request(webApiUrl + `expenseSheets`, options);
        const response = await fetch(request);
        return response.json();
    }
    get = async (user, startDate, endDate) => {
        const headers = new Headers();
        headers.append(userSessionHeader, user.sessionId);
        const options = {
            credentials: "include",
            method: "GET",
            headers
        }
        const request = new Request(webApiUrl + `?startDate=${startDate}&endDate=${endDate}`, options);
        const response = await fetch(request);
        return response.json();
    }
    fetchSummary = async (user) => {
        const headers = new Headers();
        headers.append(userSessionHeader, user.sessionId);
        const options = {
            credentials: "include",
            method: "GET",
            headers
        }
        const request = new Request(webApiUrl + `summary`, options);
        const response = await fetch(request);
        return response.json();
    }
    post = async(user, expenses) => {
        const headers = new Headers();
        headers.append(userSessionHeader, user.sessionId);
        headers.append("Content-Type", "application/json");
        var options = {
            credentials: "include",
            method: "POST",
            headers,
            body: JSON.stringify(expenses)
        }
        const request = new Request(webApiUrl, options);
        const response = await fetch(request);
        return response.json();
    }
    put = async(user, expenses) => {
        const headers = new Headers();
        headers.append(userSessionHeader, user.sessionId);
        headers.append("Content-Type", "application/json");
        var options = {
            credentials: "include",
            method: "PUT",
            headers,
            body: JSON.stringify(expenses)
        }
        const request = new Request(webApiUrl, options);
        const response = await fetch(request);
        return response.json();
    }
    delete = async(user, expenseIds) => {
        const headers = new Headers();
        headers.append(userSessionHeader, user.sessionId);
        headers.append("Content-Type", "application/json");
        var options = {
            credentials: "include",
            method: "DELETE",
            headers,
            body: JSON.stringify(expenseIds)
        }
        const request = new Request(webApiUrl, options);
        const response = await fetch(request);
        return response.json();
    }
}
const expenseService = new ExpenseService()
export default expenseService;