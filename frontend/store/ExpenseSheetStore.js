import { observable, action } from 'mobx'
import ExpenseSheet from './ExpenseSheet'

class ExpenseSheetStore {
    // User expense sheets
    @observable expenseSheets = []

    @action getExpenseSheets = (user) => {
        this.expenseSheets = [
            new ExpenseSheet("test1", "Test sheet 1")]
    }
}
const expenseSheetStore = new ExpenseSheetStore()
export default expenseSheetStore