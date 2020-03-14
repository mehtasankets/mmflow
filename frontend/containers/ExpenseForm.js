import './ExpenseForm.css'
import 'flatpickr/dist/themes/material_green.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flatpickr from 'react-flatpickr'
import { Modal, Form, Col, Button } from 'react-bootstrap'

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

    saveChanges = (e) => {
        if (e.charCode == 13) {
            this.addNewExpense(e)
        }
    }

    render() {
        const { ExpenseStore } = this.props
        const handleClose = () => { ExpenseStore.showForm = false }
        return <Modal show={ExpenseStore.showForm} onHide={handleClose} animation={false}
            size="m" key={ExpenseStore.expense.description}>
            <Modal.Header closeButton>
                <Modal.Title>{ExpenseStore.actionType}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Row>
                        <Col>
                            <Form.Group>
                                <Flatpickr placeholder='enter date'
                                    defaultValue={ExpenseStore.expense.date.toISOString()} onChange={value => this.date = value} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Control as="select"
                                    defaultValue={ExpenseStore.expense.category} onChange={e => this.category = e.target.value}>
                                    <option value="Food">Food</option>
                                    <option value="Bills">Bills</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Clothes">Clothes</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Fuel">Fuel</option>
                                    <option value="Misc">Misc</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Form.Row>
                    <Form.Group>
                        <Form.Control type="text" placeholder="Enter description" autoFocus onKeyPress={this.saveChanges}
                            defaultValue={ExpenseStore.expense.description} onChange={e => this.description = e.target.value} />
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Control type="number" placeholder="Enter amount" step='0.01' onKeyPress={this.saveChanges}
                                defaultValue={ExpenseStore.expense.amount} onChange={e => this.amount = e.target.value} />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Check inline defaultChecked={'Sanket' === ExpenseStore.expense.paidBy}
                                onChange={e => this.paidBy = e.target.value}
                                type='radio' name='paidBy' value='Sanket' label='Sanket'
                            />
                            <Form.Check inline defaultChecked={'Priyanka' === ExpenseStore.expense.paidBy}
                                onChange={e => this.paidBy = e.target.value}
                                type='radio' name='paidBy' value='Priyanka' label='Priyanka'
                            />
                        </Form.Group>
                    </Form.Row>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} tabIndex={1}>Close</Button>
                <Button variant="primary" onClick={e => this.addNewExpense(e)} tabIndex={0}>Save changes</Button>
            </Modal.Footer>
        </Modal >
    }
}
export default ExpenseForm