import { observable, action } from 'mobx'
import ExpenseSheet from './ExpenseSheet'
import expenseService from '../api/ExpenseService'

class ExpenseSheetStore {
    // User expense sheets
    @observable expenseSheets = []

    @action getExpenseSheets = async (user) => {
        const expenseSheetsList = await expenseService.fetchExpenseSheets(user)
        this.expenseSheets = expenseSheetsList.map(sheetJson => new ExpenseSheet(
            sheetJson.userIdentity, sheetJson.name, sheetJson.description
        ))
    }
}
const expenseSheetStore = new ExpenseSheetStore()
export default expenseSheetStore