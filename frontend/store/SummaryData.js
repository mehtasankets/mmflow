import { observable } from "mobx"

export default class SummaryData {
    @observable total
    @observable previousTotal
    @observable totalByCategory
    @observable totalByUser

    constructor(total = 0, previousTotal = 0, totalByCategory = {}, totalByUser = {}) {
        this.total = total
        this.previousTotal = previousTotal
        this.totalByCategory = totalByCategory
        this.totalByUser = totalByUser
    }
}