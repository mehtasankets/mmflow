import { observable, action, computed } from 'mobx'
import Expense from './Expense'
import Summary from './Summary'
import SummaryData from './SummaryData'
import expenseService from '../api/ExpenseService'

const createDefaultExpense = () => new Expense("", -1, new Date().toISOString(), "", "Groceries", "Sanket", "")
const formatDateKey = (date) => {
    const normalizedDate = new Date(date)
    const year = normalizedDate.getFullYear()
    const month = `${normalizedDate.getMonth() + 1}`.padStart(2, "0")
    const day = `${normalizedDate.getDate()}`.padStart(2, "0")
    return `${year}-${month}-${day}`
}
const getCurrentMonthRange = () => {
    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
    const endExclusive = new Date(today.getFullYear(), today.getMonth() + 1, 1)
    return { start, endExclusive }
}

const defaultSummary = new Summary("", new SummaryData(), new SummaryData())

class ExpenseStore {
    // List of expenses to be shown in the grid
    @observable expenses = []
    // Expense being added / modified
    @observable expense = Object.assign({}, createDefaultExpense())
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
    // Current loaded feed range
    @observable loadedStartDate = ""
    @observable loadedEndDate = ""

    @action openNewExpenseForm = () => {
        this.expense = Object.assign({}, createDefaultExpense())
        this.actionType = "New"
        this.showForm = true
    }

    @action openUpdateExpenseForm = (expense) => {
        this.expense = expense
        this.actionType = "Update"
        this.showForm = true
    }

    @action getExpenses = async (user, expenseSheetName) => {
        const { start, endExclusive } = getCurrentMonthRange()
        await this.getExpensesForDates(user, expenseSheetName, start, endExclusive)
    }

    @action getExpensesForDates = async (user, expenseSheetName, startDate, endDate) => {
        const expensesList = await expenseService.get(user, expenseSheetName, startDate.toISOString(), endDate.toISOString())
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
        this.loadedStartDate = formatDateKey(startDate)
        this.loadedEndDate = formatDateKey(new Date(new Date(endDate).getTime() - 24 * 60 * 60 * 1000))
    }

    @action addNewExpense = async (user, expenseSheetName) => {
        const data = await expenseService.post(user, expenseSheetName, [this.expense])
        if (data == 1) {
            this.expense = Object.assign({}, createDefaultExpense())
            this.expenses = []
            this.getExpenses(user, expenseSheetName)
            this.fetchSummary(user, expenseSheetName)
            return true
        }
        return false
    }

    @action updateExpense = async (user, expenseSheetName) => {
        const data = await expenseService.put(user, expenseSheetName, [this.expense])
        if (data == 1) {
            this.expense = Object.assign({}, createDefaultExpense())
            this.expenses = []
            this.getExpenses(user, expenseSheetName)
            this.fetchSummary(user, expenseSheetName)
            return true
        }
        return false
    }

    @action deleteExpenses = async (user, expenseSheetName, ids) => {
        const count = await expenseService.delete(user, expenseSheetName, ids)
        if (count > 0) {
            this.expense = Object.assign({}, createDefaultExpense())
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
