import { observable, action, computed } from 'mobx'
import User from './User'
import authService from '../api/authService'

const defaultUser = new User("unknown", "", "")

class UserStore {
    // User info
    @observable user = defaultUser

    @observable isAuthenticated = false

    @action login = (password, callback) => {
        this.user = authService.login(password)
        this.isAuthenticated = this.user.login != 'unknown' 
        callback()
    }

    @action logout = (callback) => {
        authService.logout()
        this.isAuthenticated = false
        callback()
    }
}

const userStore = new UserStore()
export default userStore