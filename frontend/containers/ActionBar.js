import './ActionBar.css'
import 'flatpickr/dist/themes/material_green.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import {ButtonToolbar, Button} from 'react-bootstrap'

@inject('ExpenseStore')
@observer
class ActionBar extends Component {

    addNewExpenseButtonClick = () => {
        this.props.ExpenseStore.actionType = "New"
        this.props.ExpenseStore.showForm = true
    }

    render() {
        const { ExpenseStore } = this.props
        return <div className='action-bar'>
            <ButtonToolbar>
                <Button variant="primary" onClick={this.addNewExpenseButtonClick}>Add new expense</Button>
                <Button variant="danger">Delete expenses</Button>
            </ButtonToolbar>
        </div>
    }
}
export default ActionBar