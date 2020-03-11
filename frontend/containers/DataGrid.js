import './DataGrid.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import ReactDataGrid from 'react-data-grid'
import Expense from '../store/Expense'

const columns = [
    { key: "actions", name: "Actions" },
    { key: "id", name: "ID" },
    { key: "date", name: "Date" },
    { key: "description", name: "Description" },
    { key: "category", name: "Category" },
    { key: "paidBy", name: "Paid By" },
    { key: "amount", name: "Amount" }
];

@inject('ExpenseStore')
@observer
class DataGrid extends Component {

    componentDidMount() {
        this.props.ExpenseStore.getExpenses();
    }

    createRow = (expense) => {
        if (expense == undefined)
            return {}
        return {
            "id": expense.id,
            "date": expense.date.toISOString(),
            "description": expense.description,
            "category": expense.category,
            "paidBy": expense.paidBy,
            "amount": expense.amount
        }
    }

    getCellActions = (column, row) => {
        const cellActions = {
            actions: [
                {
                    icon: <span className="glyphicon glyphicon-pencil" />,
                    callback: () => {
                        this.props.ExpenseStore.expense = new Expense(row.id, row.date, row.description, row.category, row.paidBy, row.amount)
                        this.props.ExpenseStore.actionType = "Update"
                        document.querySelector('.expense-form').style.display = 'block'
                        document.querySelector('.description').focus()
                    }
                },
                {
                    icon: <span className="glyphicon glyphicon-trash" />,
                    callback: () => {
                        this.props.ExpenseStore.deleteExpenses([row.id])
                    }
                }
            ]
        };
        return cellActions[column.key];
    }

    render() {
        const { ExpenseStore } = this.props
        return <div className='data-grid'>
            <ReactDataGrid
                columns={columns}
                rowGetter={i => this.createRow(ExpenseStore.expenses[i])}
                rowsCount={ExpenseStore.getCount}
                getCellActions={this.getCellActions}
            />
        </div>
    }
}
export default DataGrid