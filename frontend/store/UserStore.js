import { observable, action, computed } from 'mobx'
import User from './User'
import authService from '../api/AuthService'

const defaultUser = new User("", "unknown", "", "")

class UserStore {
    // User info
    @observable user = defaultUser

    @observable isAuthenticated = false

    @action login = async (user, callback) => {
        try {
            user.sessionId = await authService.login(user)
            this.user = user
            this.isAuthenticated = true
            callback()
        } catch (e) {
            console.error("From userStore.login:", e)
            this.user = null
            this.isAuthenticated = false
        }
    }

    @action logout = (callback) => {
        authService.logout()
        this.isAuthenticated = false
        callback()
    }
}

const userStore = new UserStore()
export default userStore