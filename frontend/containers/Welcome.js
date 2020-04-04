import './Welcome.css'
import React, { Component } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import { FaTrashAlt } from 'react-icons/fa'
import Header from './Header'
import ExpenseSheet from './../store/ExpenseSheet'

@inject('UserStore', 'ExpenseSheetStore')
@observer
class Welcome extends Component {

    componentWillMount() {
        const { UserStore, ExpenseSheetStore } = this.props
        ExpenseSheetStore.getExpenseSheets(UserStore.user)
    }

    redirect = (expenseSheetName) => {
        this.props.history.push("/details?expenseSheetName=" + expenseSheetName)
    }

    delete = (expenseSheetName) => {
        alert("TODO: delete from here")
        // this.props.ExpenseSheetStore.delete(this.props.UserStore.user, [expenseSheetName])
    }

    create = (name, description) => {
        alert("TODO: create from here")
        // const expenseSheet = new ExpenseSheet(null, name, description, null)
        // this.props.ExpenseSheetStore.create(this.props.UserStore.user, [expenseSheet])
    }

    render() {
        return <div className='welcome'>
            <Header />
            <Row className='welcome-row'>
                {
                    this.props.ExpenseSheetStore.expenseSheets.map(expenseSheet => (
                        <Col className='welcome-col' lg={6} xl={4} key={expenseSheet.name}>
                            <Card>
                                <Card.Header>
                                    <Row>
                                        <Col xl={10} >
                                            {expenseSheet.name}
                                        </Col>
                                        <Col xl={2} >
                                            <FaTrashAlt className='delete-sheet' style={{cursor:'pointer'}} onClick={() => this.delete(expenseSheet.name)} size={25} />
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        {expenseSheet.description}
                                    </Card.Text>
                                    <Button variant="primary" style={{cursor:'pointer'}} onClick={() => this.redirect(expenseSheet.name)}>Open Sheet</Button>{' '}
                                    <Button variant="success">Share</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                }
                <Col className='welcome-col' style={{cursor:'pointer'}} onClick={() => this.create("test", "foo")} lg={6} xl={4}>
                    <Card border="primary" className="create-new-sheet-div">
                        <blockquote className="blockquote mb-0 card-body">
                            <p>
                                Create new sheet
                            </p>
                        </blockquote>
                    </Card>
                </Col>
            </Row>
        </div>
    }
}
export default Welcome