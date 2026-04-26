import { observable, action } from 'mobx'
import User from './User'
import authService from '../api/AuthService'

const defaultUser = new User("", "unknown", "", "")
const localStorageKey = 'mmflow-user-session'

class UserStore {
    // User info
    @observable user = defaultUser

    @observable isAuthenticated = false

    constructor() {
        this.restoreSession()
    }

    @action restoreSession = () => {
        const serializedUser = window.localStorage.getItem(localStorageKey)
        if (!serializedUser) {
            return
        }

        try {
            const user = JSON.parse(serializedUser)
            if (!user.sessionId) {
                window.localStorage.removeItem(localStorageKey)
                return
            }
            this.user = new User(user.sessionId, user.idToken, user.displayName, user.profilePicUrl)
            this.isAuthenticated = true
        } catch (e) {
            console.error("From userStore.restoreSession:", e)
            window.localStorage.removeItem(localStorageKey)
        }
    }

    persistSession = (user) => {
        window.localStorage.setItem(localStorageKey, JSON.stringify({
            sessionId: user.sessionId,
            idToken: user.idToken,
            displayName: user.displayName,
            profilePicUrl: user.profilePicUrl
        }))
    }

    @action login = async (user, callback) => {
        try {
            user.sessionId = await authService.login(user)
            this.user = user
            this.isAuthenticated = true
            this.persistSession(user)
            callback()
        } catch (e) {
            console.error("From userStore.login:", e)
            this.user = defaultUser
            this.isAuthenticated = false
            window.localStorage.removeItem(localStorageKey)
        }
    }

    @action logout = async (callback) => {
        await authService.logout(this.user)
        this.isAuthenticated = false
        this.user = defaultUser
        window.localStorage.removeItem(localStorageKey)
        callback()
    }

    @action loginForDev = async (callback) => {
        const user = new User("", "dev-user", "Local Dev User", "")
        try {
            user.sessionId = await authService.login(user)
            this.user = user
            this.isAuthenticated = true
            this.persistSession(user)
            callback()
        } catch (e) {
            console.error("From userStore.loginForDev:", e)
            this.user = defaultUser
            this.isAuthenticated = false
            window.localStorage.removeItem(localStorageKey)
        }
    }
}

const userStore = new UserStore()
export default userStore
