import './Welcome.css'
import React, { Component } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import Header from './Header'

@inject('UserStore', 'ExpenseSheetStore')
@observer
class Welcome extends Component {

    componentWillMount() {
        const { UserStore, ExpenseSheetStore } = this.props
        ExpenseSheetStore.getExpenseSheets(UserStore.user.login)
    }

    redirect = (expenseSheetName) => {
        this.props.history.push("/mmflow/details?expenseSheetName=" + expenseSheetName)
    }

    render() {
        return <div className='welcome'>
            <Header />
            <Row className='welcome-row'>
                {
                    this.props.ExpenseSheetStore.expenseSheets.map(expenseSheet => (
                        <Col className='welcome-col' lg={6} xl={4} key={expenseSheet.name}
                            onClick={() => this.redirect(expenseSheet.name)}>
                            <Card>
                                <Card.Header>{expenseSheet.name}</Card.Header>
                                <Card.Body>{expenseSheet.description}</Card.Body>
                            </Card>
                        </Col>
                    ))
                }
            </Row>
        </div>
    }
}
export default Welcome