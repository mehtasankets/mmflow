import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';

@inject('ExpenseStore', 'UserStore')
@observer
class PivotAnalytics extends Component {

    componentDidMount() {
        const expenseSheetName = new URLSearchParams(this.props.location.search).get("expenseSheetName")
        const startDate = new Date(1970, 1, 1)
        const endDate = new Date(2055, 12, 31)
        this.props.ExpenseStore.getExpensesForDates(this.props.UserStore.user, expenseSheetName, startDate, endDate)
    }

    formatData(data) {
        let result = data.map(o => Object({ 
                ...o,
                "year": o.date.toISOString().slice(0, 4),
                "month": o.date.toISOString().slice(0, 7), 
                "date": o.date.toISOString().slice(0, 10)
            }))
          return result;
    }

    render() {
        const PlotlyRenderers = createPlotlyRenderers(Plot);
        const { ExpenseStore } = this.props
        return <div className='main-component pivot-analytics'>
            <section className="pivot-card">
                <div className="pivot-card-header">
                    <p className="pivot-card-kicker">Explore</p>
                    <h2 className="pivot-card-title">Pivot analyzer</h2>
                </div>
                <div className="pivot-card-body">
                    <PivotTableUI
                        data={this.formatData(ExpenseStore.expenses)}
                        onChange={s => this.setState(s)}
                        renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
                        {...this.state}
                    />
                </div>
            </section>
        </div>
    }
}
export default PivotAnalytics
