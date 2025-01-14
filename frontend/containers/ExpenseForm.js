import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flatpickr from 'react-flatpickr'
import { Modal, Form, Col, Button } from 'react-bootstrap'

@inject('ExpenseStore', 'UserStore')
@observer
class ExpenseForm extends Component {

    addNewExpense = (e) => {
        const expenseSheetName = new URLSearchParams(this.props.location.search).get("expenseSheetName")
        e.preventDefault()
        this.props.ExpenseStore.expense.expenseSheetName = expenseSheetName
        if (this.date) {
            this.props.ExpenseStore.expense.date = this.date
            this.date = null
        }
        if (this.description) {
            this.props.ExpenseStore.expense.description = this.description
            this.description = null
        }
        if (this.category) {
            this.props.ExpenseStore.expense.category = this.category
            this.category = null
        }
        if (this.paidBy) {
            this.props.ExpenseStore.expense.paidBy = this.paidBy
            this.paidBy = null
        }
        if (this.amount) {
            this.props.ExpenseStore.expense.amount = this.amount
            this.amount = null
        }

        if (this.props.ExpenseStore.actionType == "New") {
            this.props.ExpenseStore.expense.id = -1
            this.props.ExpenseStore.addNewExpense(this.props.UserStore.user, expenseSheetName)
        } else {
            this.props.ExpenseStore.updateExpense(this.props.UserStore.user, expenseSheetName)
        }
        this.props.ExpenseStore.showForm = false
    }

    saveChanges = (e) => {
        if (e.charCode == 13) {
            this.addNewExpense(e)
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
                <Form>
                    <Form.Row>
                        <Form.Group as={Col} md="4">
                            <Form.Label>Date</Form.Label><br />
                            <Flatpickr className='date-picker' placeholder='enter date'
                                defaultValue={ExpenseStore.expense.date.toISOString()} onChange={value => this.date = value[0]} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Category</Form.Label>
                            <Form.Control as="select"
                                defaultValue={ExpenseStore.expense.category} autoFocus onChange={e => this.category = e.target.value}>
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
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="number" placeholder="Enter amount" min={0} step='0.01' onKeyPress={this.saveChanges}
                                defaultValue={ExpenseStore.expense.amount} onChange={e => this.amount = e.target.value} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Paid By</Form.Label>
                            <Form.Control as="select"
                                defaultValue={ExpenseStore.expense.paidBy} onChange={e => this.paidBy = e.target.value}>
                                <option value="Sanket">Sanket</option>
                                <option value="Priyanka">Priyanka</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows="2" placeholder="Enter description" onKeyPress={this.saveChanges}
                            defaultValue={ExpenseStore.expense.description} onChange={e => this.description = e.target.value} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} tabIndex={1}>Close</Button>
                <Button variant="primary" onClick={e => this.addNewExpense(e)} tabIndex={0}>Save changes</Button>
            </Modal.Footer>
        </Modal>
    }
}
export default ExpenseForm