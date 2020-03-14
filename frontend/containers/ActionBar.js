import './ActionBar.css'
import 'flatpickr/dist/themes/material_green.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { ButtonToolbar, Button, Col } from 'react-bootstrap'

@inject('ExpenseStore')
@observer
class ActionBar extends Component {

    addNewExpense = () => {
        this.props.ExpenseStore.actionType = "New"
        this.props.ExpenseStore.showForm = true
    }

    deleteExpenses = () => {
        this.props.ExpenseStore.deleteExpenses(this.props.ExpenseStore.selectedExpenseIds)
    }

    render() {
        const { ExpenseStore } = this.props
        return <div className='action-bar'>
            <div className='action-row'>
                <Button className='action-button' variant="primary" onClick={this.addNewExpense}>Add new expense</Button>
                <Button className='action-button' variant="danger" onClick={this.deleteExpenses}>Delete expenses</Button>
            </div>
        </div>
    }
}
export default ActionBar