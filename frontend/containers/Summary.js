import './Summary.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Container, Row, Col, Card } from 'react-bootstrap'

@inject('ExpenseStore')
@observer
class Summary extends Component {

    render() {
        const { ExpenseStore } = this.props
        return <div className='summary'>
            <Row className="summary-row">
                <Col className="summary-column" xs={6} md={3}>
                    <Card className='tile tile-leftmost' bg={'success'}>
                        <Card.Header>Month to date expenditure</Card.Header>
                        <Card.Body>
                            <Card.Title>Number here</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="summary-column" xs={6} md={3}>
                    <Card className='tile tile-middle' bg={'success'}>
                        <Card.Header>Year to date expenditure</Card.Header>
                        <Card.Body>
                            <Card.Title>Number here</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="summary-column" xs={6} md={3}>
                    <Card className='tile tile-middle' bg={'success'}>
                        <Card.Header>Expenditure by category</Card.Header>
                        <Card.Body>
                            <Card.Title>Piechart here</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
                <Col className="summary-column" xs={6} md={3}>
                    <Card className='tile tile-rightmost' bg={'success'}>
                        <Card.Header>Last month expenditure</Card.Header>
                        <Card.Body>
                            <Card.Title>Number here</Card.Title>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    }
}
export default Summary