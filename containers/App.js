import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject('ExpensesStore')
@observer
class App extends Component {

    addNewExpense = (e) => {
        e.preventDefault()
        this.props.ExpensesStore.addNewExpense(-1, this.description.value, this.amount.value)
        this.description.value = ''
        this.amount.value = ''
    }

    render() {
        const { ExpensesStore } = this.props
        return <div className='App'>
            <h1>We have {ExpensesStore.getCount} Expenses entered.</h1>
            <form onSubmit={e => this.addNewExpense(e)}>
                <input type='input' className='description' placeholder='enter description' ref={input => this.description = input} />
                <input type='input' className='amount' placeholder='enter amount' ref={input => this.amount = input} />
                <button>Submit</button>
            </form>
            <table>
                <thead>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                </thead>
                {ExpensesStore.expenses.map(expense => (
                    <tr>
                        <td>{expense.date.toLocaleDateString("en-US")}</td>
                        <td>{expense.description}</td>
                        <td>{expense.amount}</td>
                    </tr>
                ))}
            </table>
        </div>
    }
}
export default App