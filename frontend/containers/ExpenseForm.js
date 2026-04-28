import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Modal, Form, Col, Button } from 'react-bootstrap'

@inject('ExpenseStore', 'UserStore')
@observer
class ExpenseForm extends Component {
    constructor(props) {
        super(props)
        this.state = this.getFormState(props.ExpenseStore.expense)
    }

    componentDidUpdate(prevProps) {
        const { ExpenseStore } = this.props
        if (ExpenseStore.showForm && ExpenseStore.expense !== prevProps.ExpenseStore.expense) {
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

    handleShortcutSubmit = (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key == "Enter") {
            this.addNewExpense(e)
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
        return <Modal show={ExpenseStore.showForm} onHide={handleClose} animation={false}
            size="lg" key={ExpenseStore.expense.description}>
            <Modal.Header closeButton>
                <Modal.Title>{ExpenseStore.actionType}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={this.addNewExpense} onKeyDown={this.handleShortcutSubmit}>
                    <Form.Row>
                        <Form.Group as={Col} md="4">
                            <Form.Label htmlFor="expense-date">Date</Form.Label>
                            <Form.Control
                                id="expense-date"
                                type="date"
                                value={this.state.date}
                                onChange={this.updateField("date")}
                                autoFocus={ExpenseStore.actionType == "New"}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label htmlFor="expense-category">Category</Form.Label>
                            <Form.Control
                                id="expense-category"
                                as="select"
                                value={this.state.category}
                                onChange={this.updateField("category")}
                                autoFocus={ExpenseStore.actionType != "New"}>
                                <option value="Groceries">Groceries</option>
                                <option value="ReadyMadeFood">Ready made food</option>
                                <option value="Bills">Bills</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Transport">Transport</option>
                                <option value="HouseUtilities">House utilities</option>
                                <option value="Toys">Toys</option>
                                <option value="Books">Books</option>
                                <option value="Health">Health</option>
                                <option value="Education">Education</option>
                                <option value="Painting">Painting</option>
                                <option value="Clothes">Clothes</option>
                                <option value="Trips">Trips</option>
                                <option value="Gifts">Gifts</option>
                                <option value="PersonalGrooming">Personal Grooming</option>
                                <option value="ExtendedFamilyExpenses">Extended Family Expenses</option>
                                <option value="Misc">Misc</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} md="4">
                            <Form.Label htmlFor="expense-amount">Amount</Form.Label>
                            <Form.Control
                                id="expense-amount"
                                type="number"
                                placeholder="Enter amount"
                                step='0.01'
                                inputMode="decimal"
                                value={this.state.amount}
                                onChange={this.updateField("amount")}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label htmlFor="expense-paid-by">Paid By</Form.Label>
                            <Form.Control
                                id="expense-paid-by"
                                as="select"
                                value={this.state.paidBy}
                                onChange={this.updateField("paidBy")}>
                                <option value="Sanket">Sanket</option>
                                <option value="Priyanka">Priyanka</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Group>
                        <Form.Label htmlFor="expense-description">Description</Form.Label>
                        <Form.Control
                            id="expense-description"
                            as="textarea"
                            rows="2"
                            placeholder="Enter description"
                            value={this.state.description}
                            onChange={this.updateField("description")}
                        />
                    </Form.Group>
                    <Modal.Footer className="expense-form-footer">
                        <Button variant="primary" type="submit">Save changes</Button>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    }
}
export default ExpenseForm
