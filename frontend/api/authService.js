const webApiUrl = "http://192.168.1.22:8090/expense/";

class AuthService {

    login = async (user) => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        var options = {
            credentials: "include",
            method: "POST",
            headers,
            body: JSON.stringify(user)
        }
        const request = new Request(webApiUrl + 'login', options);
        const response = await fetch(request);
        return response.headers.get('X-User-Session');
    }

    logout() {
        // no-op
    }
}
const authService = new AuthService()
export default authService;