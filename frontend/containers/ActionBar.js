import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { ButtonToolbar, Button, Col } from 'react-bootstrap'

@inject('ExpenseStore', 'UserStore')
@observer
class ActionBar extends Component {

    addNewExpense = () => {
        this.props.ExpenseStore.actionType = "New"
        this.props.ExpenseStore.showForm = true
    }

    deleteExpenses = () => {
        let expenseSheetName = new URLSearchParams(this.props.location.search).get("expenseSheetName")
        this.props.ExpenseStore.deleteExpenses(this.props.UserStore.user, expenseSheetName, 
            this.props.ExpenseStore.selectedExpenseIds)
    }

    render() {
        const { ExpenseStore } = this.props
        return <div className='main-component action-bar'>
            <div className='action-row'>
                <Button className='action-button' variant="primary" onClick={this.addNewExpense}>Add new expense</Button>
                <Button className='action-button' variant="danger" onClick={this.deleteExpenses}>Delete expenses</Button>
            </div>
        </div>
    }
}
export default ActionBar