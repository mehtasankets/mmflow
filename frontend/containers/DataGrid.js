import './DataGrid.css'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { AgGridReact } from 'ag-grid-react'
import { Button } from 'react-bootstrap'
import Expense from '../store/Expense'
import { FaRegTrashAlt, FaPencilAlt } from "react-icons/fa"

@inject('ExpenseStore')
@observer
class DataGrid extends Component {

    constructor(props) {
        super(props)
        this.defaultColDef = {
            resizable: false, sortable: true, filter: true
        }
        this.columns = [
            {
                field: "actions", headerName: "Actions", sortable: false, filter: false, checkboxSelection: true, width: 100,
                cellRendererFramework: function (params) {
                    function updateExpense(params) {
                        const row = params.data
                        props.ExpenseStore.expense = new Expense(row.id, row.date, row.description, row.category, row.paidBy, row.amount)
                        props.ExpenseStore.actionType = "Update"
                        props.ExpenseStore.showForm = true
                    }
                    function deleteExpense(params) {
                        props.ExpenseStore.deleteExpenses([params.data.id])
                    }
                    return <div>
                        <FaPencilAlt className='cell-action-icon' onClick={e => updateExpense(params)} />
                        <FaRegTrashAlt className='cell-action-icon' onClick={e => deleteExpense(params)} />
                    </div>
                }
            },
            { field: "id", headerName: "ID", width: 80 },
            { 
                field: "date", headerName: "Date", 
                valueFormatter: function (params) {
                    return params.value.toISOString()
              }, width: 300 },
            { field: "description", headerName: "Description", width: 300 },
            { field: "category", headerName: "Category", width: 200 },
            { field: "paidBy", headerName: "Paid By", width: 200 },
            { field: "amount", headerName: "Amount", width: 200 }
        ];
    }

    componentDidMount() {
        this.props.ExpenseStore.getExpenses();
    }

    onSelectionChanged = () => {
        const selectedNodes = this.gridApi.getSelectedNodes()
        const selectedIds = selectedNodes.map(node => node.data.id)
        this.props.ExpenseStore.selectedExpenseIds = selectedIds
    };

    onGridReady = (params) => {
        params.api.sizeColumnsToFit()
    }

    render() {
        const { ExpenseStore } = this.props
        return <div className='data-grid'>
            <div className="ag-theme-balham" style={{height: 440}}>
                <AgGridReact
                    defaultColDef={this.defaultColDef}
                    columnDefs={this.columns}
                    rowData={ExpenseStore.expenses}
                    rowSelection='multiple'
                    onSelectionChanged={this.onSelectionChanged}
                    onGridReady={this.onGridReady}
                />
            </div>
        </div>
    }
}
export default DataGrid