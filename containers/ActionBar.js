import './ActionBar.css'
import 'flatpickr/dist/themes/material_green.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Flatpickr from 'react-flatpickr'

@inject('ExpensesStore')
@observer
class ActionBar extends Component {

    addNewExpense = (e) => {
        e.preventDefault()
        const dateval = this.date.flatpickr.selectedDates[0]
        this.props.ExpensesStore.addNewExpense(-1, dateval, this.description.value, this.amount.value)
        this.description.value = ''
        this.amount.value = ''
        document.querySelector('#new-expense-form').style.display = 'none'
    }

    addNewExpenseButtonClick = (e) => {
        document.querySelector('#new-expense-form').style.display = 'block'
        document.querySelector('.description').focus()
    }

    mouseUpHandler = (e) => {
        if (e.target.closest('#new-expense-form')) {
            return
        }
        document.querySelector('#new-expense-form').style.display = 'none'
    }

    render() {
        const { ExpensesStore } = this.props
        const today = new Date()
        return <div className='action-bar' onMouseUp={e => this.mouseUpHandler(e)}>
            
            <div id="new-expense" onClick={e => this.addNewExpenseButtonClick(e)}>Add new expense</div>

            <div id="new-expense-form">
                <h1>Add new expense</h1>
                <form onSubmit={e => this.addNewExpense(e)}>
                    <Flatpickr className='date' value={today} placeholder='enter date' ref={input => this.date = input} />
                    <input type='input' className='description' placeholder='enter description' ref={input => this.description = input} />
                    <input type='number' className='amount' placeholder='enter amount' step='0.01' ref={input => this.amount = input} />
                    <button className='submit'>Submit</button>
                </form>
            </div>
        </div>
    }
}
export default ActionBar