import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { BarChart, Bar, XAxis, LabelList, Tooltip, PieChart, Pie, Cell } from 'recharts';

const COLORS = ["#663300", "#006633", "#330066", "#aaaa00", "#00aaaa", "#aa00aa", "#ff0000", "#00ff00", "#0000ff"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
@inject('ExpenseStore', 'UserStore')
@observer
class Summary extends Component {

    componentWillMount() {
        const expenseSheetName = new URLSearchParams(this.props.location.search).get("expenseSheetName")
        this.props.ExpenseStore.fetchSummary(this.props.UserStore.user, expenseSheetName)
    }

    constructDataExpenditureByCategory(data) {
        return Object.entries(data).map(e => Object({ "name": e[0], "value": e[1] }))
    }

    constructDataExpenditureByUser(data) {
        return Object.entries(data).map(e => Object({ "name": e[0], "value": e[1] }))
    }

    render() {
        const { ExpenseStore } = this.props
        return <div className='main-component summary'>
            <Row className='summary-row'>
                <Col className='summary-col' lg={12} xl={4}>
                    <Card>
                        <Card.Header>Total expenditure</Card.Header>
                        <Card.Body>
                            <Row style={{ height: "20%" }}>
                                <Col className="column-header center-align right-border">
                                    Monthly
                                    </Col>
                                <Col className="column-header center-align">
                                    Yearly
                                </Col>
                            </Row>
                            <Row style={{ height: "80%" }}>
                                <Col className="total-value center-align right-border">
                                    {ExpenseStore.summary.monthToDateSummary.total}
                                </Col>
                                <Col className="total-value center-align">
                                    {ExpenseStore.summary.yearToDateSummary.total}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='summary-col' lg={12} xl={4}>
                    <Card>
                        <Card.Header>Expenditure by category</Card.Header>
                        <Card.Body>
                            <Row style={{ height: "20%" }}>
                                <Col className="column-header center-align right-border">
                                    Monthly
                                    </Col>
                                <Col className="column-header center-align">
                                    Yearly
                                </Col>
                            </Row>
                            <Row style={{ height: "80%" }}>
                                <Col className="center-align right-border pie-font">
                                    <PieChart width={140} height={140}>
                                        <Pie
                                            data={this.constructDataExpenditureByCategory(
                                                ExpenseStore.summary.monthToDateSummary.totalByCategory
                                            )}
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={68}
                                            dataKey="value"
                                        >
                                            {this.constructDataExpenditureByCategory(
                                                ExpenseStore.summary.monthToDateSummary.totalByCategory
                                            ).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </Col>
                                <Col className="center-align pie-font">
                                    <PieChart width={140} height={140}>
                                        <Pie
                                            data={this.constructDataExpenditureByCategory(
                                                ExpenseStore.summary.yearToDateSummary.totalByCategory
                                            )}
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={68}
                                            dataKey="value"
                                        >
                                            {this.constructDataExpenditureByCategory(
                                                ExpenseStore.summary.yearToDateSummary.totalByCategory
                                            ).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </Col>
                            </Row>

                        </Card.Body>
                    </Card>
                </Col>
                <Col className='summary-col' lg={12} xl={4}>
                    <Card>
                        <Card.Header>Expenditure by user</Card.Header>
                        <Card.Body>
                            <Row style={{ height: "20%" }}>
                                <Col className="column-header center-align right-border">
                                    Monthly
                                    </Col>
                                <Col className="column-header center-align">
                                    Yearly
                                </Col>
                            </Row>
                            <Row style={{ height: "80%" }}>
                                <Col className="center-align right-border">
                                    <BarChart width={140} height={140} data={this.constructDataExpenditureByUser(
                                        ExpenseStore.summary.monthToDateSummary.totalByUser
                                    )}>
                                        <Bar dataKey='value' fill='#663300'>
                                            <LabelList dataKey="value" position="center" fill="white" />
                                        </Bar>
                                        <XAxis stroke='#555555' dataKey="name" />
                                        <Tooltip />
                                    </BarChart>
                                </Col>
                                <Col className="center-align">
                                    <BarChart width={140} height={140} data={this.constructDataExpenditureByUser(
                                        ExpenseStore.summary.yearToDateSummary.totalByUser
                                    )}>
                                        <Bar dataKey='value' fill='#663300'>
                                            <LabelList dataKey="value" position="center" fill="white" />
                                        </Bar>
                                        <XAxis stroke='#555555' dataKey="name" />
                                        <Tooltip />
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
export default Summary