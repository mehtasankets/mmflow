import { observable, action, computed } from 'mobx'
import Expense from './Expense'

class ExpensesStore {
    @observable expenses = []

    @action addNewExpense = (id, description, amount) => this.expenses.push(new Expense(id, description, amount))

    @computed get getCount() {
        return this.expenses.length
    }
}

const expensesStore = new ExpensesStore()
export default expensesStore