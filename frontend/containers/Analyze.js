import './Analyze.css'
import 'flatpickr/dist/themes/material_green.css'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-balham.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Header from './Header'
import Summary from './Summary'
import Analytics from './Analytics'
import PivotAnalytics from './PivotAnalytics'

@inject('ExpenseStore')
@observer
class Analyze extends Component {

    render() {
        return <div className='analyze'>
            <Header {...this.props} />
            <Summary {...this.props} />
            <Analytics {...this.props} />
            <PivotAnalytics {...this.props} />
        </div>
    }
}
export default Analyze