import Expense from "../store/Expense";

const webApiUrl = "http://localhost:8090/";

class ExpenseService {
    get = async (month) => {
        const options = {
            method: "GET",
        }
        const request = new Request(webApiUrl + "get-expenses-for-month/" + month, options);
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
        const request = new Request(webApiUrl + "upsert/", options);
        const response = await fetch(request);
        return response.json();
    }
}
const expenseService = new ExpenseService()
export default expenseService;