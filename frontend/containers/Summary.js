import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { BarChart, Bar, XAxis, LabelList, Tooltip, PieChart, Pie, Cell } from 'recharts';

const COLORS = ["#663300", "#006633", "#330066", "#aaaa00", "#00aaaa", "#aa00aa", "#ff0000", "#00ff00", "#0000ff"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
@inject('ExpenseStore')
@observer
class Summary extends Component {

    componentWillMount() {
        this.props.ExpenseStore.fetchSummary()
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
                <Col className='summary-col' xs={12} md={4}>
                    <Card bg={'info'}>
                        <Card.Header>Current month total expenditure</Card.Header>
                        <Card.Body>
                            <Card.Title>{ExpenseStore.summary.monthToDateSummary.total}</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='summary-col' xs={6} md={4}>
                    <Card bg={'info'}>
                        <Card.Header>Expenditure by category</Card.Header>
                        <Card.Body>
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
                            </PieChart>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className='summary-col' xs={6} md={4}>
                    <Card bg={'info'}>
                        <Card.Header>Expenditure by user</Card.Header>
                        <Card.Body>
                            <BarChart width={140} height={140} data={this.constructDataExpenditureByUser(
                                ExpenseStore.summary.monthToDateSummary.totalByUser
                            )}>
                                <Bar dataKey='value' fill='#ffddbb'>
                                    <LabelList dataKey="value" position="middle" />
                                </Bar>
                                <XAxis stroke='#eaf0f4' dataKey="name" />
                                <Tooltip />
                            </BarChart>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    }
}
export default Summary