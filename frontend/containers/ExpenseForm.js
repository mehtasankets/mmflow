import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

const CATEGORY_OPTIONS = [
    ["Groceries", "Groceries"],
    ["ReadyMadeFood", "Ready made food"],
    ["Bills", "Bills"],
    ["Entertainment", "Entertainment"],
    ["Transport", "Transport"],
    ["HouseUtilities", "House utilities"],
    ["Toys", "Toys"],
    ["Books", "Books"],
    ["Health", "Health"],
    ["Education", "Education"],
    ["Painting", "Painting"],
    ["Clothes", "Clothes"],
    ["Trips", "Trips"],
    ["Gifts", "Gifts"],
    ["PersonalGrooming", "Personal grooming"],
    ["ExtendedFamilyExpenses", "Extended family"],
    ["Misc", "Misc"]
]

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
class ExpenseForm extends Component {
    constructor(props) {
        super(props)
        this.state = this.getFormState(props.ExpenseStore.expense)
        this.lastSyncedExpenseKey = this.getExpenseSyncKey(props.ExpenseStore.expense, props.ExpenseStore.actionType)
        this.dateInputRef = React.createRef()
    }

    componentDidUpdate() {
        const { ExpenseStore } = this.props
        if (!ExpenseStore.showForm) {
            this.lastSyncedExpenseKey = null
            return
        }

        const nextExpenseKey = this.getExpenseSyncKey(ExpenseStore.expense, ExpenseStore.actionType)
        if (nextExpenseKey !== this.lastSyncedExpenseKey) {
            this.lastSyncedExpenseKey = nextExpenseKey
            this.setState(this.getFormState(ExpenseStore.expense))
        }
    }

    getFormState = (expense) => ({
        date: this.formatDateForInput(expense.date),
        category: expense.category || "Groceries",
        amount: expense.amount === 0 || expense.amount ? expense.amount.toString() : "",
        paidBy: expense.paidBy || "Sanket",
        description: expense.description || ""
    })

    getExpenseSyncKey = (expense, actionType) => {
        return JSON.stringify({
            id: expense.id,
            actionType,
            ...this.getFormState(expense)
        })
    }

    formatDateForInput = (date) => {
        if (!date) {
            return ""
        }
        const normalizedDate = new Date(date)
        const year = normalizedDate.getFullYear()
        const month = `${normalizedDate.getMonth() + 1}`.padStart(2, "0")
        const day = `${normalizedDate.getDate()}`.padStart(2, "0")
        return `${year}-${month}-${day}`
    }

    updateField = (field) => (e) => {
        this.setState({ [field]: e.target.value })
    }

    setCategory = (category) => {
        this.setState({ category })
    }

    setPaidBy = (paidBy) => {
        this.setState({ paidBy })
    }

    openDatePicker = () => {
        const input = this.dateInputRef.current
        if (!input) {
            return
        }

        input.focus()
        if (typeof input.showPicker === "function") {
            input.showPicker()
        }
    }

    handleShortcutSubmit = (e) => {
        if (e.key == "Enter" && e.target.tagName !== "SELECT" && e.target.type !== "button") {
            e.preventDefault()
            this.addNewExpense(e)
        }
    }

    handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            this.props.ExpenseStore.showForm = false
        }
    }

    addNewExpense = async (e) => {
        const expenseSheetName = new URLSearchParams(this.props.location.search).get("expenseSheetName")
        e.preventDefault()
        const { ExpenseStore } = this.props
        const { date, description, category, paidBy, amount } = this.state

        ExpenseStore.expense.expenseSheetName = expenseSheetName
        ExpenseStore.expense.date = date ? new Date(`${date}T00:00:00`) : new Date()
        ExpenseStore.expense.description = description
        ExpenseStore.expense.category = category
        ExpenseStore.expense.paidBy = paidBy
        ExpenseStore.expense.amount = amount === "" ? 0 : parseFloat(amount)

        let saveSuccessful = false
        if (ExpenseStore.actionType == "New") {
            ExpenseStore.expense.id = -1
            saveSuccessful = await ExpenseStore.addNewExpense(this.props.UserStore.user, expenseSheetName)
        } else {
            saveSuccessful = await ExpenseStore.updateExpense(this.props.UserStore.user, expenseSheetName)
        }

        if (saveSuccessful) {
            this.setState(this.getFormState(ExpenseStore.expense))
            ExpenseStore.showForm = false
        }
    }

    render() {
        const { ExpenseStore } = this.props
        const handleClose = () => { ExpenseStore.showForm = false }

        if (!ExpenseStore.showForm) {
            return null
        }

        return <div className="expense-form-overlay" onClick={this.handleOverlayClick}>
            <section className="expense-form-sheet" role="dialog" aria-modal="true" aria-labelledby="expense-form-title">
                <button type="button" className="expense-form-close" onClick={handleClose} aria-label="Close expense form">×</button>
                <form className="expense-form-shell" onSubmit={this.addNewExpense} onKeyDown={this.handleShortcutSubmit}>
                    <header className="expense-form-hero">
                        <p className="expense-form-kicker">{ExpenseStore.actionType === "New" ? "Log expense" : "Update expense"}</p>
                        <h2 id="expense-form-title" className="expense-form-title">{ExpenseStore.actionType === "New" ? "Add an entry" : "Refine this entry"}</h2>
                        <div className="expense-form-amount-wrap">
                            <span className="expense-form-currency">₹</span>
                            <input
                                id="expense-amount"
                                className="expense-form-amount-input"
                                type="number"
                                placeholder="0"
                                step="0.01"
                                inputMode="decimal"
                                value={this.state.amount}
                                onChange={this.updateField("amount")}
                                autoFocus
                            />
                        </div>
                    </header>

                    <div className="expense-form-body">
                        <section className="expense-form-section">
                            <label className="expense-form-section-label">Who spent?</label>
                            <div className="expense-form-person-grid">
                                {["Sanket", "Priyanka"].map((person) => (
                                    <button
                                        key={person}
                                        type="button"
                                        className={`expense-form-person-chip${this.state.paidBy === person ? " is-active" : ""}`}
                                        onClick={() => this.setPaidBy(person)}
                                    >
                                        <span className="expense-form-person-avatar">{person.charAt(0)}</span>
                                        <span>{person}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="expense-form-section">
                            <label className="expense-form-section-label">Category</label>
                            <div className="expense-form-category-grid">
                                {CATEGORY_OPTIONS.map(([value, label]) => (
                                    <button
                                        key={value}
                                        type="button"
                                        className={`expense-form-category-chip${this.state.category === value ? " is-active" : ""}`}
                                        onClick={() => this.setCategory(value)}
                                    >
                                        <span>{CATEGORY_EMOJI[value] || "📎"}</span>
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <div className="expense-form-input-grid">
                            <label className="expense-form-field">
                                <span className="expense-form-section-label">Date</span>
                                <input
                                    id="expense-date"
                                    ref={this.dateInputRef}
                                    type="date"
                                    value={this.state.date}
                                    onChange={this.updateField("date")}
                                    onClick={this.openDatePicker}
                                />
                            </label>
                            <label className="expense-form-field expense-form-field-wide">
                                <span className="expense-form-section-label">Description</span>
                                <input
                                    id="expense-description"
                                    type="text"
                                    placeholder="What was this for?"
                                    value={this.state.description}
                                    onChange={this.updateField("description")}
                                />
                            </label>
                        </div>
                    </div>

                    <footer className="expense-form-actions">
                        <button type="submit" className="expense-form-submit">Save expense</button>
                        <button type="button" className="expense-form-cancel" onClick={handleClose}>Cancel</button>
                    </footer>
                </form>
            </section>
        </div>
    }
}

export default ExpenseForm
