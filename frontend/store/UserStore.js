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

    @action logout = async (callback) => {
        await authService.logout(this.user)
        this.isAuthenticated = false
        this.user = defaultUser
        callback()
    }

    @action loginForDev = (callback) => {
        this.user = new User("test-123", "dev-user", "Local Dev User", "")
        this.isAuthenticated = true
        callback()
    }
}

const userStore = new UserStore()
export default userStore
