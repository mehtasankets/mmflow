import { observable } from "mobx"

export default class User {
    @observable sessionId
    @observable idToken
    @observable displayName
    @observable profilePicUrl

    constructor(sessionId, idToken, displayName, profilePicUrl) {
        this.sessionId = sessionId
        this.idToken = idToken
        this.displayName = displayName
        this.profilePicUrl = profilePicUrl
    }
}