import { observable } from "mobx"

export default class Summary {
    @observable expenseSheetName
    @observable monthToDateSummary
    @observable yearToDateSummary

    constructor(expenseSheetName, monthToDateSummary, yearToDateSummary) {
        this.expenseSheetName = expenseSheetName
        this.monthToDateSummary = monthToDateSummary
        this.yearToDateSummary = yearToDateSummary
    }
}