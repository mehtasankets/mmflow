const webApiUrl = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8090/expense"
    : "http://mmflow-backend.mehtasanket.in/expense"
const userSessionHeader = "X-User-Session"

class AuthService {

    login = async (user) => {
        const headers = new Headers()
        headers.append("Content-Type", "application/json")
        var options = {
            credentials: "include",
            method: "POST",
            headers,
            body: JSON.stringify(user)
        }
        const request = new Request(webApiUrl + '/login', options)
        const response = await fetch(request)
        if (!response.ok) {
            throw new Error(await response.text())
        }
        return response.headers.get('X-User-Session')
    }

    logout = async (user) => {
        const headers = new Headers()
        headers.append(userSessionHeader, user.sessionId)
        var options = {
            credentials: "include",
            method: "POST",
            headers
        }
        const request = new Request(webApiUrl + '/logout', options)
        const response = await fetch(request)
        if (!response.ok) {
            throw new Error(await response.text())
        }
    }
}
const authService = new AuthService()
export default authService
