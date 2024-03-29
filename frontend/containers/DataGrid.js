import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { AgGridReact } from 'ag-grid-react'
import Expense from '../store/Expense'
import ConfirmationModal from './ConfirmationModal'
import { FaRegTrashAlt, FaPencilAlt } from "react-icons/fa"

@inject('ExpenseStore', 'UserStore')
@observer
class DataGrid extends Component {

    constructor(props) {
        super(props)
        this.expenseSheetName = new URLSearchParams(this.props.location.search).get("expenseSheetName")
        this.defaultColDef = {
            resizable: true, sortable: true, filter: true
        }
        this.columns = [
            {
                field: "actions", headerName: "Actions", sortable: false, filter: false, checkboxSelection: true,
                cellRendererFramework: function (params) {
                    function updateExpense(params) {
                        let expenseSheetName = new URLSearchParams(props.location.search).get("expenseSheetName")
                        const row = params.data
                        props.ExpenseStore.expense = new Expense(expenseSheetName, row.id, row.date, row.description, row.category, row.paidBy, row.amount)
                        props.ExpenseStore.actionType = "Update"
                        props.ExpenseStore.showForm = true
                    }
                    function deleteExpense(params) {
                        let expenseSheetName = new URLSearchParams(props.location.search).get("expenseSheetName")
                        props.ExpenseStore.selectedExpenseIds = params.data.id
                        props.ExpenseStore.showDeletionConfirmationDialog = true
                    }
                    return <div>
                        <FaPencilAlt style={{ cursor: 'pointer' }} className='cell-action-icon' onClick={e => updateExpense(params)} />
                        <FaRegTrashAlt style={{ cursor: 'pointer' }} className='cell-action-icon' onClick={e => deleteExpense(params)} />
                    </div >
                }
            },
            { field: "id", headerName: "ID" },
            {
                field: "date", headerName: "Date",
                valueFormatter: function (params) {
                    return params.value.toLocaleDateString("en-CA");
                }
            },
            { field: "description", headerName: "Description" },
            { field: "category", headerName: "Category" },
            { field: "paidBy", headerName: "Paid By" },
            { field: "amount", headerName: "Amount" }
        ]
    }

    componentDidMount() {
        this.props.ExpenseStore.getExpenses(this.props.UserStore.user, this.expenseSheetName)
    }

    componentDidUpdate() {
        this.gridApi.sizeColumnsToFit()
    }

    onSelectionChanged = () => {
        const selectedNodes = this.gridApi.getSelectedNodes()
        const selectedIds = selectedNodes.map(node => node.data.id)
        this.props.ExpenseStore.selectedExpenseIds = selectedIds
    }

    onGridReady = (params) => {
        this.gridApi = params.api
        this.gridApi.sizeColumnsToFit()
    }

    render() {
        const { ExpenseStore, UserStore } = this.props
        return <div className='main-component data-grid'>
            <div className="ag-theme-balham" style={{ height: 300 }}>
                <AgGridReact
                    defaultColDef={this.defaultColDef}
                    columnDefs={this.columns}
                    rowData={ExpenseStore.expenses}
                    rowSelection='multiple'
                    onSelectionChanged={this.onSelectionChanged}
                    onGridReady={this.onGridReady}
                    gridOptions={{
                        suppressHorizontalScroll: true
                    }}
                />
            </div>
            < ConfirmationModal
                show={ExpenseStore.showDeletionConfirmationDialog}
                title="Delete Expense"
                question={`Do you really want to delete selected expense?`}
                onConfirmation={() => ExpenseStore.deleteExpenses(UserStore.user, this.expenseSheetName, ExpenseStore.selectedExpenseIds)}
                onCancellation={() => ExpenseStore.showDeletionConfirmationDialog = false} />
        </div>
    }
}
export default DataGrid