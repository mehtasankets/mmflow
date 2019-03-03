import { observable } from "mobx"

export default class Expense {
    @observable id
    @observable description
    @observable amount
    @observable date

    constructor(id, description, amount) {
        if (!id) {
            id = -1
        }
        this.date = new Date()
        this.id = id
        this.description = description
        this.amount = amount
    }
}