import { observable } from "mobx"

export default class ExpenseSheet {
    @observable userIdentity
    @observable name
    @observable description
    @observable sharedWith

    constructor(userIdentity, name, description, sharedWith) {
        this.userIdentity = userIdentity
        this.name=name
        this.description = description
        this.sharedWith = sharedWith
    }
}