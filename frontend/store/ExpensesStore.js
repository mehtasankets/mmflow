import { observable, action, computed } from 'mobx'
import Expense from './Expense'

class ExpensesStore {
    @observable expenses = []

    @action addNewExpense = (id, date, description, amount) => this.expenses.push(new Expense(id, date, description, amount))

    @computed get getCount() {
        return this.expenses.length
    }
}

const expensesStore = new ExpensesStore()
export default expensesStore