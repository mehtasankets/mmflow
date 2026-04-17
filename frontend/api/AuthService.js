const prodFrontendHosts = ["mmflow.mehtasanket.in"]
const isProdHost = prodFrontendHosts.includes(window.location.hostname)
const localBackendUrl = `${window.location.protocol}//${window.location.hostname}:8090/expense`
const webApiUrl = isProdHost ? "http://mmflow-backend.mehtasanket.in/expense" : localBackendUrl
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
