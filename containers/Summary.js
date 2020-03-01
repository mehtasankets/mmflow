import './Summary.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject('ExpensesStore')
@observer
class Summary extends Component {

    render() {
        const { ExpensesStore } = this.props
        return <div className='summary'>
            <div>Month to date expenditure</div>
            <div>Year to date expenditure</div>
            <div>expenditure by category</div>
            <div>Last month expenditure</div>
        </div>
    }
}
export default Summary