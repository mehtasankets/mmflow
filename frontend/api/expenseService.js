import Expense from "../store/Expense";

const webApiUrl = "http://localhost:8090/expense/";

class ExpenseService {
    get = async (startDate, endDate) => {
        const options = {
            method: "GET",
        }
        const request = new Request(webApiUrl + `?startDate=${startDate}&endDate=${endDate}`, options);
        const response = await fetch(request);
        return response.json();
    }
    fetchSummary = async () => {
        const options = {
            method: "GET",
        }
        const request = new Request(webApiUrl + `summary`, options);
        const response = await fetch(request);
        return response.json();
    }
    post = async(expenses) => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        var options = {
            method: "POST",
            headers,
            body: JSON.stringify(expenses)
        }
        const request = new Request(webApiUrl, options);
        const response = await fetch(request);
        return response.json();
    }
    put = async(expenses) => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        var options = {
            method: "PUT",
            headers,
            body: JSON.stringify(expenses)
        }
        const request = new Request(webApiUrl, options);
        const response = await fetch(request);
        return response.json();
    }
    delete = async(expenseIds) => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        var options = {
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