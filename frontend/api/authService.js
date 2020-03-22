import User from "../store/User";

class AuthService {

    login(password) {
        let login = password == 'p' ? 'mehtasan' : 'unknown'
        return new User(login, "Sanket", "")
    }

    logout() {
        // no-op
    }
}
const authService = new AuthService()
export default authService;