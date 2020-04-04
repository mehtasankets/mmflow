import { observable, action } from 'mobx'
import ExpenseSheet from './ExpenseSheet'
import expenseService from '../api/ExpenseService'

class ExpenseSheetStore {
    // User expense sheets
    @observable expenseSheets = []

    @action getExpenseSheets = async (user) => {
        const expenseSheetsList = await expenseService.fetchExpenseSheets(user)
        this.expenseSheets = expenseSheetsList.map(sheetJson => new ExpenseSheet(
            sheetJson.userIdentity, sheetJson.name, sheetJson.description, sheetJson.sharedWith
        ))
    }

    @action create = async (user, expenseSheets) => {
        const count = await expenseService.createExpenseSheets(user, expenseSheets)
        if (count > 0) { 
            this.getExpenseSheets(user)
        }
    }

    @action share = async (user, sharingDetails) => {
        const count = await expenseService.shareExpenseSheets(user, sharingDetails)
        if (count > 0) {
            this.getExpenseSheets(user)
        }
    }
    

    @action delete = async (user, expenseSheetNames) => {
        const count = await expenseService.deleteExpenseSheets(user, expenseSheetNames)
        if (count > 0) {
            this.getExpenseSheets(user)
        }
    }

}
const expenseSheetStore = new ExpenseSheetStore()
export default expenseSheetStore