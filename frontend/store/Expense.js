import { observable } from "mobx"

export default class Expense {
    @observable id
    @observable date
    @observable description
    @observable category
    @observable paidBy
    @observable amount

    constructor(id, dateStr, description, category, paidBy, amount) {
        if (!id) {
            id = -1
        }
        if(!dateStr) {
            this.date = new Date()
        } else {
            this.date = new Date(Date.parse(dateStr))
        }
        this.id = id
        this.description = description
        this.category = category
        this.paidBy = paidBy
        this.amount = amount
    }
}