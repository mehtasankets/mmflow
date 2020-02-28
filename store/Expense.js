import { observable } from "mobx"

export default class Expense {
    @observable id
    @observable date
    @observable description
    @observable amount

    constructor(id, date, description, amount) {
        if (!id) {
            id = -1
        }
        if(!date) {
            date = new Date()
        }
        this.id = id
        this.date = date
        this.description = description
        this.amount = amount
    }
}