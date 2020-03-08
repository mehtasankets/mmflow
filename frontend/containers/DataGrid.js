import './DataGrid.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import ReactDataGrid from 'react-data-grid'

const columns = [
    { key: "actions", name: "Actions" },
    { key: "id", name: "ID" },
    { key: "date", name: "Date" },
    { key: "description", name: "Description" },
    { key: "category", name: "Category" },
    { key: "paidBy", name: "Paid By" },
    { key: "amount", name: "Amount"}
];

@inject('ExpensesStore')
@observer
class DataGrid extends Component {

    componentDidMount() {
        this.props.ExpensesStore.getExpensesAsync();
    }

    createRow = (expense) => {
        if (expense == undefined) 
            return {}
        return {
            "id": expense.id,
            "date": expense.date.toLocaleDateString("en-US"),
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
              icon: <span>edit</span>,
              callback: () => {
                  // TODO 
                  this.props.ExpensesStore.updateExpense(row.id, row.date, row.description, row.category, row.paidBy, row.amount)
              }
            },
            {
              icon: <span>delete</span>,
              callback: () => {
                  this.props.ExpensesStore.deleteExpenses([row.id])
              }
            }
          ]
        };
        return cellActions[column.key];
    }

    render() {
        const { ExpensesStore } = this.props
        return <div className='data-grid'>
            <ReactDataGrid
                columns={columns}
                rowGetter={i => this.createRow(ExpensesStore.expenses[i])}
                rowsCount={ExpensesStore.getCount}
                getCellActions={this.getCellActions}
            />
        </div>
    }
}
export default DataGrid