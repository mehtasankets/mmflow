import { observable, action, computed } from 'mobx'
import Expense from './Expense'
import Summary from './Summary'
import SummaryData from './SummaryData'
import expenseService from '../api/expenseService'

const defaultExpense = new Expense(-1, new Date().toISOString(), "", "Food", "Sanket", 0)

const defaultSummary = new Summary(new SummaryData(), new SummaryData())

class ExpenseStore {
    // List of expenses to be shown in the grid
    @observable expenses = []
    // Expense being added / modified
    @observable expense = Object.assign({}, defaultExpense)
    // New / Update
    @observable actionType = "New"
    // show / hide form
    @observable showForm = false
    // Manage selected rows
    @observable selectedExpenseIds = []
    // Summary
    @observable summary = defaultSummary

    @action getExpenses = async () => {
        let today = new Date()
        let startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const expensesList = await expenseService.get(startOfMonth.toISOString(), today.toISOString())
        this.expenses = expensesList.map(expenseJson => new Expense(
            expenseJson.id, expenseJson.date, expenseJson.description,
            expenseJson.category, expenseJson.paidBy, expenseJson.amount)
        )
    };

    @action addNewExpense = async () => {
        const data = await expenseService.post([this.expense])
        if (data == 1) {
            this.expense = Object.assign({}, defaultExpense)
            this.expenses = []
            this.getExpenses()
            this.fetchSummary()
        }
    }

    @action updateExpense = async () => {
        const data = await expenseService.put([this.expense])
        if (data == 1) {
            this.expense = Object.assign({}, defaultExpense)
            this.expenses = []
            this.getExpenses()
            this.fetchSummary()
        }
    }

    @action deleteExpenses = async (ids) => {
        const data = await expenseService.delete(ids)
        if (data == ids.length) {
            this.expense = Object.assign({}, defaultExpense)
            this.getExpenses()
            this.fetchSummary()
        }
    }

    @action fetchSummary = async () => {
        this.summary = await expenseService.fetchSummary()
    }
}

const expenseStore = new ExpenseStore()
export default expenseStore