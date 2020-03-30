import { observable } from "mobx"

export default class ExpenseSheet {
    @observable userIdentity
    @observable name
    @observable description

    constructor(userIdentity, name, description) {
        this.userIdentity = userIdentity
        this.name=name
        this.description = description
    }
}