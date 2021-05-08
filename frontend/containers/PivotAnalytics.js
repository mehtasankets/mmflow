import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Card } from 'react-bootstrap'
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';

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
        const { ExpenseStore } = this.props
        return <div className='main-component pivot-analytics'>
            <Row className='pivot-analytics-row'>
                <Col className='pivot-analytics-col' lg={12}>
                    <Card>
                        <Card.Header>Pivot Analyzer</Card.Header>
                        <Card.Body>
                            <Row style={{ height: "100%" }}>
                                <Col className="center-align right-border">
                                    <PivotTableUI
                                        data={this.formatData(ExpenseStore.expenses)}
                                        onChange={s => this.setState(s)}
                                        {...this.state}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    }
}
export default PivotAnalytics