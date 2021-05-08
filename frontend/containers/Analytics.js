import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Card } from 'react-bootstrap'
import { CartesianGrid, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList } from 'recharts'

const renderCustomizedLabel = (props) => {
    const { x, y, width, value } = this.props;
    console.log(value)
    return (
        <g>
            <text x={x + (width / 2)} y={y - 10} textAnchor="middle">{value}</text>
        </g>
    );
};

@inject('ExpenseStore', 'UserStore')
@observer
class Analytics extends Component {

    componentDidMount() {
        const expenseSheetName = new URLSearchParams(this.props.location.search).get("expenseSheetName")
        const startDate = new Date(1970, 1, 1)
        const endDate = new Date(2055, 12, 31)
        this.props.ExpenseStore.getExpensesForDates(this.props.UserStore.user, expenseSheetName, startDate, endDate)
    }

    constructMonthOnMonthAggregates(data) {
        let updatedData = data.map(o => Object({ 
            "month": o.date.toISOString().slice(0, 7), 
            "amountBySanket": o.paidBy == 'Sanket'? o.amount : 0,
            "amountByPriyanka": o.paidBy == 'Priyanka'? o.amount : 0, 
            ...o })).sort((a,b) => { 
                let val = new Date(a.date) - new Date(b.date)
                if (val != 0) {
                    return val
                }
                return a.id - b.id
            })
        const result = [...updatedData.reduce((r, o) => {
            const key = o.month;
            const item = r.get(key) || Object.assign({}, o, {
                amountBySanket: 0,
                amountByPriyanka: 0
            });
            item.amountBySanket += o.amountBySanket;
            item.amountByPriyanka += o.amountByPriyanka;
            return r.set(key, item);
          }, new Map).values()];
          return result;
    }

    render() {
        const { ExpenseStore } = this.props
        return <div className='main-component analytics'>
            <Row className='analytics-row'>
                <Col className='analytics-col' lg={12}>
                    <Card>
                        <Card.Header>Month on month expenses</Card.Header>
                        <Card.Body>
                            <Row style={{ height: "100%" }}>
                                <Col className="center-align right-border">
                                    <BarChart width={1000} height={500} data={this.constructMonthOnMonthAggregates(
                                        ExpenseStore.expenses
                                    )}>
                                        <CartesianGrid strokeDasharray="3 3" />
				                        <XAxis dataKey="month" />
				                        <YAxis />
				                        <Tooltip />
				                        <Legend />
				                        <Bar dataKey="amountBySanket" stackId="a" fill="#8884d8">
                                            <LabelList dataKey="amount" content={renderCustomizedLabel} />
                                        </Bar>
				                        <Bar dataKey="amountByPriyanka" stackId="a" fill="#82ca9d">
                                            <LabelList dataKey="amount" content={renderCustomizedLabel} />
                                        </Bar>
                                    </BarChart>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    }
}
export default Analytics