import { observable } from "mobx"

export default class Summary {
    @observable monthToDateSummary
    @observable yearToDateSummary

    constructor(monthToDateSummary, yearToDateSummary) {
        this.monthToDateSummary = monthToDateSummary
        this.yearToDateSummary = yearToDateSummary
    }
}