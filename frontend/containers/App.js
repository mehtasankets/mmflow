import './App.css'
import 'flatpickr/dist/themes/material_green.css'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Header from './Header'
import Summary from './Summary'
import ActionBar from './ActionBar'
import DataGrid from './DataGrid'
import ExpenseForm from './ExpenseForm'

@inject('ExpenseStore')
@observer
class App extends Component {

    render() {
        return <div className='app'>
            <Header />
            <Summary />
            <ActionBar />
            <DataGrid />
            <ExpenseForm />
        </div>
    }
}
export default App