import { observable, action, computed } from 'mobx'
import Expense from './Expense'
import expenseService from '../api/expenseService'

class ExpensesStore {
    @observable expenses = []

    @action getExpensesAsync = async () => {
        try {
            let today = new Date();
            let startOfMonth =  new Date(today.getFullYear(), today.getMonth(), 1);
            const expensesList = await expenseService.get(startOfMonth.toISOString(), today.toISOString())
            this.expenses = expensesList.map(expenseJson => new Expense(
                expenseJson.id, expenseJson.date, expenseJson.description,
                expenseJson.category, expenseJson.paidBy, expenseJson.amount)
            )
        } catch (error) {
            console.log(error)
        }
    };

    @action addNewExpense = async (id, date, description, category, paidBy, amount) => {
        const expense = new Expense(id, date, description, category, paidBy, amount)
        const data = await expenseService.post([expense])
        this.getExpensesAsync()
    }

    @action updateExpense = async (id, date, description, category, paidBy, amount) => {
        const expense = new Expense(id, date, description, category, paidBy, amount)
        const data = await expenseService.put([expense])
        this.getExpensesAsync()
    }

    @action deleteExpenses = async (ids) => {
        const data = await expenseService.delete(ids)
        this.getExpensesAsync()
    }

    @computed get getCount() {
        return this.expenses.length
    }
}

const expensesStore = new ExpensesStore()
export default expensesStore