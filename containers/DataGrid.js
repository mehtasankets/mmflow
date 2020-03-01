import './DataGrid.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import ReactDataGrid from 'react-data-grid'

const columns = [
    { key: "id", name: "ID" },
    { key: "date", name: "Date", editable: true },
    { key: "description", name: "Complete", editable: true },
    { key: "amount", name: "Amount", editable: true}
];

@inject('ExpensesStore')
@observer
class DataGrid extends Component {

    createRow = (expense) => {
        if (expense == undefined) 
            return {}
        return {
            "id": expense.id,
            "date": expense.date.toLocaleDateString("en-US"),
            "description": expense.description,
            "amount": expense.amount
        }
    }

    render() {
        const { ExpensesStore } = this.props
        return <div className='data-grid'>
            <ReactDataGrid
                columns={columns}
                rowGetter={i => this.createRow(ExpensesStore.expenses[i])}
                rowsCount={ExpensesStore.getCount}
                enableCellSelect={true}
            />
        </div>
    }
}
export default DataGrid