import { observable } from "mobx"

export default class User {
    @observable login
    @observable displayName
    @observable profilePic

    constructor(login, displayName, profilePic) {
        this.login = login
        this.displayName = displayName
        this.profilePic = profilePic
    }
}