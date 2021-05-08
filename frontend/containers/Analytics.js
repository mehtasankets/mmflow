import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Row, Col, Card } from 'react-bootstrap'
import { CartesianGrid, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

const COLORS = ["#663300", "#006633", "#330066", "#aaaa00", "#00aaaa", "#aa00aa", "#ff0000", "#00ff00", "#0000ff"]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}
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
          console.log(result);
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
				                        <Bar dataKey="amountBySanket" stackId="a" fill="#8884d8" />
				                        <Bar dataKey="amountByPriyanka" stackId="a" fill="#82ca9d" label={{ position: 'top' }} />
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