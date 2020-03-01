import './App.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Header from './Header'
import Summary from './Summary'
import ActionBar from './ActionBar'
import DataGrid from './DataGrid'

@inject('ExpensesStore')
@observer
class App extends Component {

    render() {
        return <div className='app'>
            <Header />
            <Summary />
            <ActionBar />
            <DataGrid />
        </div>
    }
}
export default App