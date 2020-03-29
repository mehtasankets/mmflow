import { observable } from "mobx"

export default class User {
    @observable sessionId
    @observable idToken
    @observable displayName
    @observable profilePic

    constructor(sessionId, idToken, displayName, profilePic) {
        this.sessionId = sessionId
        this.idToken = idToken
        this.displayName = displayName
        this.profilePic = profilePic
    }
}