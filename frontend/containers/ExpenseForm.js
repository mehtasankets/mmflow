import './ExpenseForm.css'
import 'flatpickr/dist/themes/material_green.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flatpickr from 'react-flatpickr'
import { RadioGroup, Radio } from 'react-radio-group'
import Expense from '../store/Expense'
import { Modal, Form, Button } from 'react-bootstrap'

@inject('ExpenseStore')
@observer
class ExpenseForm extends Component {

    componentWillMount() {
        this.date = this.props.ExpenseStore.expense.date;
        this.description = this.props.ExpenseStore.expense.description;
        this.category = this.props.ExpenseStore.expense.category;
        this.paidBy = this.props.ExpenseStore.expense.paidBy;
        this.amount = this.props.ExpenseStore.expense.amount;
    }

    addNewExpense = (e) => {
        e.preventDefault()
        if (this.date)
            this.props.ExpenseStore.expense.date = this.date
        if (this.description)
            this.props.ExpenseStore.expense.description = this.description
        if (this.category)
            this.props.ExpenseStore.expense.category = this.category
        if (this.paidBy)
            this.props.ExpenseStore.expense.paidBy = this.paidBy
        if (this.amount)
            this.props.ExpenseStore.expense.amount = this.amount

        if (this.props.ExpenseStore.actionType == "New") {
            this.props.ExpenseStore.expense.id = -1
            this.props.ExpenseStore.addNewExpense()
        } else {
            this.props.ExpenseStore.updateExpense()
        }
        this.props.ExpenseStore.showForm = false
    }

    render() {
        const { ExpenseStore } = this.props
        const handleClose = () => { ExpenseStore.showForm = false }
        return <Modal show={ExpenseStore.showForm} onHide={handleClose} animation={false}
            size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{this.props.ExpenseStore.actionType}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Flatpickr placeholder='enter date'
                            defaultValue={this.date.toISOString()} onChange={value => this.date = value} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="text" placeholder="Enter description"
                            defaultValue={this.description} onChange={e => this.description = e.target.value} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control as="select"
                            defaultValue={this.category} onChange={e => this.category = e.target.value}>
                            <option value="Food">Food</option>
                            <option value="Bills">Bills</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Clothes">Clothes</option>
                            <option value="Travel">Travel</option>
                            <option value="Fuel">Fuel</option>
                            <option value="Misc">Misc</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Check defaultChecked={'Sanket' === this.paidBy} onChange={e => this.paidBy = e.target.value}
                            type='radio'
                            name='paidBy'
                            value='Sanket'
                            label='Sanket'
                        />
                        <Form.Check defaultChecked={'Priyanka' === this.paidBy} onChange={e => this.paidBy = e.target.value}
                            type='radio'
                            name='paidBy'
                            value='Priyanka'
                            label='Priyanka'
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Control type="number" placeholder="Enter amount" step='0.01'
                            defaultValue={this.amount} onChange={e => this.amount = e.target.value} />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={e => this.addNewExpense(e)}>Save changes</Button>
            </Modal.Footer>
        </Modal >
    }
}
export default ExpenseForm