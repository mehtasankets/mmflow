import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Expense from '../store/Expense'
import ConfirmationModal from './ConfirmationModal'
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa"

const CATEGORY_EMOJI = {
    Groceries: "🛍️",
    ReadyMadeFood: "🍽️",
    Bills: "📄",
    Entertainment: "🎬",
    Transport: "🚕",
    HouseUtilities: "🏠",
    Toys: "🧸",
    Books: "📚",
    Health: "💊",
    Education: "🎓",
    Painting: "🎨",
    Clothes: "👕",
    Trips: "✈️",
    Gifts: "🎁",
    PersonalGrooming: "✨",
    ExtendedFamilyExpenses: "👪",
    Misc: "📎"
}

@inject('ExpenseStore', 'UserStore')
@observer
class DataGrid extends Component {
    state = {
        search: "",
        paidBy: "",
        category: "",
        from: "",
        to: ""
    }

    componentDidMount() {
        this.expenseSheetName = new URLSearchParams(this.props.location.search).get("expenseSheetName")
        this.props.ExpenseStore.getExpenses(this.props.UserStore.user, this.expenseSheetName)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.from !== this.state.from || prevState.to !== this.state.to) {
            this.syncExpenseRangeWithFilters()
        }
    }

    getFilteredExpenses = () => {
        const { search, paidBy, category, from, to } = this.state
        return this.props.ExpenseStore.expenses.filter((expense) => {
            const normalizedDescription = (expense.description || "").toLowerCase()
            const normalizedCategory = (expense.category || "").toLowerCase()
            const normalizedPaidBy = (expense.paidBy || "").toLowerCase()
            const searchValue = search.trim().toLowerCase()
            const expenseDate = this.formatDateForInput(expense.date)

            if (searchValue &&
                !normalizedDescription.includes(searchValue) &&
                !normalizedCategory.includes(searchValue) &&
                !normalizedPaidBy.includes(searchValue)) {
                return false
            }

            if (paidBy && expense.paidBy !== paidBy) {
                return false
            }

            if (category && expense.category !== category) {
                return false
            }

            if (from && expenseDate < from) {
                return false
            }

            if (to && expenseDate > to) {
                return false
            }

            return true
        })
    }

    getGroupedExpenses = (expenses) => {
        return expenses.reduce((groups, expense) => {
            const groupKey = this.formatDateForInput(expense.date)
            if (!groups[groupKey]) {
                groups[groupKey] = {
                    items: [],
                    total: 0
                }
            }
            groups[groupKey].items.push(expense)
            groups[groupKey].total += Number(expense.amount || 0)
            return groups
        }, {})
    }

    getUserOptions = () => {
        return Array.from(new Set(this.props.ExpenseStore.expenses.map((expense) => expense.paidBy))).filter(Boolean)
    }

    getCategoryOptions = () => {
        return Array.from(new Set(this.props.ExpenseStore.expenses.map((expense) => expense.category))).filter(Boolean)
    }

    formatCurrency = (value) => {
        const numericValue = Number(value || 0)
        return `₹${numericValue.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
            minimumFractionDigits: numericValue % 1 === 0 ? 0 : 2
        })}`
    }

    formatDateForInput = (date) => {
        const normalizedDate = new Date(date)
        const year = normalizedDate.getFullYear()
        const month = `${normalizedDate.getMonth() + 1}`.padStart(2, "0")
        const day = `${normalizedDate.getDate()}`.padStart(2, "0")
        return `${year}-${month}-${day}`
    }

    getDefaultRange = () => {
        const today = new Date()
        return {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            endInclusive: new Date(today.getFullYear(), today.getMonth() + 1, 0)
        }
    }

    parseDateInput = (dateString) => new Date(`${dateString}T00:00:00`)

    toExclusiveEndDate = (inclusiveEndDate) => {
        const exclusiveEndDate = new Date(inclusiveEndDate)
        exclusiveEndDate.setDate(exclusiveEndDate.getDate() + 1)
        return exclusiveEndDate
    }

    syncExpenseRangeWithFilters = async () => {
        const { ExpenseStore, UserStore } = this.props
        const defaultRange = this.getDefaultRange()
        const defaultStartKey = this.formatDateForInput(defaultRange.start)
        const defaultEndKey = this.formatDateForInput(defaultRange.endInclusive)
        const requestedStartKey = this.state.from || defaultStartKey
        const requestedEndKey = this.state.to || defaultEndKey
        const loadedStartKey = ExpenseStore.loadedStartDate
        const loadedEndKey = ExpenseStore.loadedEndDate

        if (!loadedStartKey || !loadedEndKey) {
            return
        }

        if (requestedStartKey > requestedEndKey) {
            return
        }

        const shouldResetToDefault = !this.state.from && !this.state.to &&
            (loadedStartKey !== defaultStartKey || loadedEndKey !== defaultEndKey)
        const shouldFetchExpandedRange = requestedStartKey < loadedStartKey || requestedEndKey > loadedEndKey

        if (!shouldResetToDefault && !shouldFetchExpandedRange) {
            return
        }

        const nextStart = this.state.from ? this.parseDateInput(requestedStartKey) : defaultRange.start
        const nextEndInclusive = this.state.to ? this.parseDateInput(requestedEndKey) : defaultRange.endInclusive
        const rangeKey = `${requestedStartKey}:${requestedEndKey}`

        if (this.pendingRangeKey === rangeKey) {
            return
        }

        this.pendingRangeKey = rangeKey
        try {
            await ExpenseStore.getExpensesForDates(
                UserStore.user,
                this.expenseSheetName,
                nextStart,
                this.toExclusiveEndDate(nextEndInclusive)
            )
        } finally {
            this.pendingRangeKey = null
        }
    }

    formatFriendlyDate = (dateKey) => {
        const today = this.formatDateForInput(new Date())
        const yesterdayDate = new Date()
        yesterdayDate.setDate(yesterdayDate.getDate() - 1)
        const yesterday = this.formatDateForInput(yesterdayDate)

        if (dateKey === today) {
            return "Today"
        }

        if (dateKey === yesterday) {
            return "Yesterday"
        }

        return new Date(`${dateKey}T00:00:00`).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short"
        })
    }

    formatFriendlyTime = (date) => {
        return new Date(date).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        })
    }

    getUserInitial = (name) => {
        if (!name) {
            return "?"
        }
        return name.trim().charAt(0).toUpperCase()
    }

    getCategoryEmoji = (category) => {
        return CATEGORY_EMOJI[category] || "📎"
    }

    getCategoryLabel = (category) => {
        if (!category) {
            return ""
        }

        return category
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/^./, (match) => match.toUpperCase())
    }

    updateFilter = (field) => (event) => {
        this.setState({ [field]: event.target.value })
    }

    clearFilters = () => {
        this.setState({
            search: "",
            paidBy: "",
            category: "",
            from: "",
            to: ""
        })
    }

    openExpenseForEdit = (expense) => {
        this.props.ExpenseStore.openUpdateExpenseForm(
            new Expense(
                expense.expenseSheetName,
                expense.id,
                expense.date,
                expense.description,
                expense.category,
                expense.paidBy,
                expense.amount
            )
        )
    }

    requestDeleteExpense = (expenseId) => {
        if (!expenseId) {
            return
        }
        this.props.ExpenseStore.selectedExpenseIds = [expenseId]
        this.props.ExpenseStore.showDeletionConfirmationDialog = true
    }

    renderExpenseRow = (expense) => {
        return <article key={expense.id} className="ledger-row">
            <div className="ledger-icon-box">{this.getCategoryEmoji(expense.category)}</div>
            <div className="ledger-content">
                <div className="ledger-main">
                    <div className="ledger-note">{expense.description || "Untitled expense"}</div>
                    <p className="ledger-meta">
                        <span className="ledger-avatar">{this.getUserInitial(expense.paidBy)}</span>
                        {expense.paidBy} · {this.getCategoryLabel(expense.category)} · {this.formatFriendlyTime(expense.date)}
                    </p>
                </div>
                <div className="ledger-side">
                    <div className="ledger-amount">{this.formatCurrency(expense.amount)}</div>
                    <div className="ledger-actions" aria-label="Expense actions">
                        <button
                            type="button"
                            className="ledger-action-button ledger-action-edit"
                            onClick={() => this.openExpenseForEdit(expense)}
                            aria-label="Edit expense"
                            title="Edit expense"
                        >
                            <FaPencilAlt />
                        </button>
                        <button
                            type="button"
                            className="ledger-action-button ledger-action-delete"
                            onClick={() => this.requestDeleteExpense(expense.id)}
                            aria-label="Delete expense"
                            title="Delete expense"
                        >
                            <FaRegTrashAlt />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    }

    render() {
        const { ExpenseStore, UserStore } = this.props
        const filteredExpenses = this.getFilteredExpenses()
        const groupedExpenses = this.getGroupedExpenses(filteredExpenses)
        const hasActiveFilters = Object.values(this.state).some((value) => value)

        return <div className='main-component data-grid'>
            <section className="ledger-filter-card">
                <div className="ledger-filter-header">
                    <div className="ledger-filter-heading">
                        <h2 className="data-grid-title">Expenses</h2>
                    </div>
                    {hasActiveFilters ? <button type="button" className="ledger-clear-button" onClick={this.clearFilters}>Clear filters</button> : null}
                </div>
                <div className="ledger-filter-grid">
                    <div className="ledger-filter-grid-row ledger-filter-grid-row-primary">
                        <div className="ledger-search">
                            <span className="ledger-search-icon">🔍</span>
                            <input
                                type="text"
                                value={this.state.search}
                                onChange={this.updateFilter("search")}
                                placeholder="Search notes…"
                            />
                        </div>
                        <select value={this.state.paidBy} onChange={this.updateFilter("paidBy")}>
                            <option value="">All users</option>
                            {this.getUserOptions().map((user) => <option key={user} value={user}>{user}</option>)}
                        </select>
                        <select value={this.state.category} onChange={this.updateFilter("category")}>
                            <option value="">All categories</option>
                            {this.getCategoryOptions().map((category) => <option key={category} value={category}>{this.getCategoryLabel(category)}</option>)}
                        </select>
                    </div>
                    <div className="ledger-filter-grid-row ledger-filter-grid-row-secondary">
                        <label className="ledger-filter-field">
                            <span className="ledger-filter-label">From</span>
                            <input type="date" value={this.state.from} onChange={this.updateFilter("from")} />
                        </label>
                        <label className="ledger-filter-field">
                            <span className="ledger-filter-label">To</span>
                            <input type="date" value={this.state.to} onChange={this.updateFilter("to")} />
                        </label>
                    </div>
                </div>
                {hasActiveFilters ? <p className="ledger-filter-results">Showing <strong>{filteredExpenses.length}</strong> of {ExpenseStore.expenses.length} expenses</p> : null}
            </section>

            <section className="ledger-card">
                <div className="ledger-toolbar">
                    <div className="ledger-toolbar-copy">
                        <div className="ledger-results">
                            {filteredExpenses.length} expense{filteredExpenses.length === 1 ? "" : "s"}
                        </div>
                    </div>
                </div>

                <div className="ledger-feed">
                    {filteredExpenses.length === 0 ?
                        <div className="ledger-empty-state">
                            <div className="ledger-empty-title">No expenses match these filters</div>
                            <p>Try clearing a filter or logging a new expense.</p>
                        </div> :
                        Object.keys(groupedExpenses).sort((a, b) => b.localeCompare(a)).map((dateKey) => (
                            <section key={dateKey} className="ledger-group">
                                <header className="ledger-group-header">
                                    <span>{this.formatFriendlyDate(dateKey)}</span>
                                    <strong>{this.formatCurrency(groupedExpenses[dateKey].total)}</strong>
                                </header>
                                <div className="ledger-group-list">
                                    {groupedExpenses[dateKey].items.map(this.renderExpenseRow)}
                                </div>
                            </section>
                        ))
                    }
                </div>
            </section>

            <ConfirmationModal
                show={ExpenseStore.showDeletionConfirmationDialog}
                title="Delete Expense"
                question="Do you really want to delete this expense?"
                onConfirmation={() => ExpenseStore.deleteExpenses(UserStore.user, this.expenseSheetName, ExpenseStore.selectedExpenseIds)}
                onCancellation={() => ExpenseStore.showDeletionConfirmationDialog = false} />
        </div>
    }
}
export default DataGrid
