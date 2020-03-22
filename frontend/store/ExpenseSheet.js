import { observable } from "mobx"

export default class ExpenseSheet {
    @observable name
    @observable description

    constructor(name, description) {
        this.name=name
        this.description = description
    }
}