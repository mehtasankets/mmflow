import './ActionBar.css'
import 'flatpickr/dist/themes/material_green.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flatpickr from 'react-flatpickr'
import {RadioGroup, Radio} from 'react-radio-group'

@inject('ExpenseStore')
@observer
class ActionBar extends Component {

    addNewExpenseButtonClick = () => {
        document.querySelector('.expense-form').style.display = 'block'
        document.querySelector('.description').focus()
    }

    render() {
        const { ExpenseStore } = this.props
        return <div className='action-bar'>
            <div id="new-expense" onClick={this.addNewExpenseButtonClick}>Add new expense</div>
            <div id="delete-expenses">Delete expenses</div>
        </div>
    }
}
export default ActionBar