import './ExpenseForm.css'
import 'flatpickr/dist/themes/material_green.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flatpickr from 'react-flatpickr'
import { RadioGroup, Radio } from 'react-radio-group'
import Expense from '../store/Expense'
import { Modal, Button } from 'react-bootstrap'

@inject('ExpenseStore')
@observer
class ExpenseForm extends Component {

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
                <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <Flatpickr placeholder='enter date'
                        defaultValue={ExpenseStore.expense.date.toISOString()} onChange={value => this.date = value} />
                    <input type='input' className='description' placeholder='enter description'
                        defaultValue={ExpenseStore.expense.description} onChange={e => this.description = e.target.value} />
                    <select id="categories" name="categories"
                        defaultValue={ExpenseStore.expense.category} onChange={e => this.category = e.target.value}>
                        <option value="Food">Food</option>
                        <option value="Bills">Bills</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Clothes">Clothes</option>
                        <option value="Travel">Travel</option>
                        <option value="Fuel">Fuel</option>
                        <option value="Misc">Misc</option>
                    </select>
                    <RadioGroup name="paidby" selectedValue={ExpenseStore.expense.paidBy} onChange={value => this.paidBy = value}>
                        <Radio value="Sanket" />Sanket
                    <Radio value="Priyanka" />Priyanka
                </RadioGroup>
                    <input type='number' placeholder='enter amount' step='0.01'
                        defaultValue={ExpenseStore.expense.amount} onChange={e => this.amount = e.target.value} />
                </form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" onClick={e => this.addNewExpense(e)}>Save changes</Button>
            </Modal.Footer>
        </Modal>
    }
}
export default ExpenseForm