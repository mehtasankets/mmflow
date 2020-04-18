import { observable, action, computed } from 'mobx'
import Expense from './Expense'
import Summary from './Summary'
import SummaryData from './SummaryData'
import expenseService from '../api/ExpenseService'

const defaultExpense = new Expense("", -1, new Date().toISOString(), "", "Food", "Sanket", 0)

const defaultSummary = new Summary("", new SummaryData(), new SummaryData())

class ExpenseStore {
    // List of expenses to be shown in the grid
    @observable expenses = []
    // Expense being added / modified
    @observable expense = Object.assign({}, defaultExpense)
    // New / Update
    @observable actionType = "New"
    // show / hide form
    @observable showForm = false
    // show / hide deletion confirmation
    @observable showDeletionConfirmationDialog = false
    // Manage selected rows
    @observable selectedExpenseIds = []
    // Summary
    @observable summary = defaultSummary

    @action getExpenses = async (user, expenseSheetName) => {
        let today = new Date()
        let startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const expensesList = await expenseService.get(user, expenseSheetName, startOfMonth.toISOString(), today.toISOString())
        this.expenses = expensesList.map(expenseJson => new Expense(
            expenseJson.expenseSheetName, expenseJson.id, expenseJson.date, expenseJson.description,
            expenseJson.category, expenseJson.paidBy, expenseJson.amount)
        ).sort((a,b) => { 
            let val = new Date(b.date) - new Date(a.date)
            if (val != 0) {
                return val
            }
            return b.id - a.id
        })
    }

    @action addNewExpense = async (user, expenseSheetName) => {
        const data = await expenseService.post(user, expenseSheetName, [this.expense])
        if (data == 1) {
            this.expense = Object.assign({}, defaultExpense)
            this.expenses = []
            this.getExpenses(user, expenseSheetName)
            this.fetchSummary(user, expenseSheetName)
        }
    }

    @action updateExpense = async (user, expenseSheetName) => {
        const data = await expenseService.put(user, expenseSheetName, [this.expense])
        if (data == 1) {
            this.expense = Object.assign({}, defaultExpense)
            this.expenses = []
            this.getExpenses(user, expenseSheetName)
            this.fetchSummary(user, expenseSheetName)
        }
    }

    @action deleteExpenses = async (user, expenseSheetName, ids) => {
        const count = await expenseService.delete(user, expenseSheetName, ids)
        if (count > 0) {
            this.expense = Object.assign({}, defaultExpense)
            this.showDeletionConfirmationDialog = false
            this.getExpenses(user, expenseSheetName)
            this.fetchSummary(user, expenseSheetName)
        }
    }

    @action fetchSummary = async (user, expenseSheetName) => {
        this.summary = await expenseService.fetchSummary(user, expenseSheetName)
    }
}

const expenseStore = new ExpenseStore()
export default expenseStore