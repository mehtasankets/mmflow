import './DataGrid.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import ReactDataGrid from 'react-data-grid'
import Expense from '../store/Expense'
import { FaRegTrashAlt, FaPencilAlt } from "react-icons/fa";

const columns = [
    { key: "actions", name: "Actions", width: 100, resizable: true },
    { key: "id", name: "ID", width: 70, resizable: true },
    { key: "date", name: "Date", width: 220, resizable: true },
    { key: "description", name: "Description", width: 220, resizable: true },
    { key: "category", name: "Category", width: 180, resizable: true },
    { key: "paidBy", name: "Paid By", width: 130, resizable: true },
    { key: "amount", name: "Amount", width: 130, resizable: true }
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
                    icon: <FaPencilAlt />,
                    callback: () => {
                        this.props.ExpenseStore.expense = new Expense(row.id, row.date, row.description, row.category, row.paidBy, row.amount)
                        this.props.ExpenseStore.actionType = "Update"
                        this.props.ExpenseStore.showForm = true
                    }
                },
                {
                    icon: <FaRegTrashAlt />,
                    callback: () => {
                        this.props.ExpenseStore.deleteExpenses([row.id])
                    }
                }
            ]
        };
        return cellActions[column.key];
    }

    onRowsSelected = rows => {
        const selected = rows.map(r => r.row.id);
        this.props.ExpenseStore.selectedExpenseIds.push(...selected)
    };

    onRowsDeselected = rows => {
        const toRemove = rows.map(r => r.row.id)
        this.props.ExpenseStore.selectedExpenseIds = this.props.ExpenseStore.selectedExpenseIds
            .filter(x => toRemove.indexOf(x) < 0);
    };

    render() {
        const { ExpenseStore } = this.props
        return <div className='data-grid'>
            <ReactDataGrid
                columns={columns}
                rowGetter={i => this.createRow(ExpenseStore.expenses[i])}
                rowsCount={ExpenseStore.getCount}
                getCellActions={this.getCellActions}
                rowSelection={{
                    showCheckbox: true,
                    onRowsSelected: this.onRowsSelected,
                    onRowsDeselected: this.onRowsDeselected,
                    selectBy: {
                      keys: {
                          rowKey: "id",
                          values: this.props.ExpenseStore.selectedExpenseIds
                      }  
                    }
                }}
            />
        </div>
    }
}
export default DataGrid