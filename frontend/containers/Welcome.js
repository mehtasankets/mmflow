import './Welcome.css'
import React, { Component } from 'react'
import { Row, Col, Card, Button, Form, Modal } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import { FaTrashAlt } from 'react-icons/fa'
import Header from './Header'
import ConfirmationModal from './ConfirmationModal'
import ExpenseSheet from './../store/ExpenseSheet'

@inject('UserStore', 'ExpenseSheetStore')
@observer
class Welcome extends Component {

    componentWillMount() {
        const { UserStore, ExpenseSheetStore } = this.props
        ExpenseSheetStore.getExpenseSheets(UserStore.user)
    }

    redirectToDetails = (expenseSheetName) => {
        this.props.history.push("/details?expenseSheetName=" + expenseSheetName)
    }

    redirectToAnalyze = (expenseSheetName) => {
        this.props.history.push("/analyze?expenseSheetName=" + expenseSheetName)
    }

    delete = (expenseSheetName) => {
        this.props.ExpenseSheetStore.delete(this.props.UserStore.user, [expenseSheetName])
    }

    createNewSheet = () => {
        const expenseSheet = new ExpenseSheet(null, this.name, this.description, [])
        this.props.ExpenseSheetStore.create(this.props.UserStore.user, [expenseSheet])
    }

    render() {
        const { ExpenseSheetStore } = this.props
        return <div className='welcome'>
            <Header {...this.props} />
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
                                            <FaTrashAlt className='delete-sheet' style={{ cursor: 'pointer' }} onClick={() => {
                                                this.sheetToBeDeleted = expenseSheet.name
                                                ExpenseSheetStore.showDeletionConfirmationDialog = true
                                            }} size={25} />
                                        </Col>
                                    </Row>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        {expenseSheet.description}
                                    </Card.Text>
                                    <Button variant="primary" style={{ cursor: 'pointer' }} onClick={() => this.redirectToDetails(expenseSheet.name)}>Open Sheet</Button>{' '}
                                    <Button variant="secondary" style={{ cursor: 'pointer' }} onClick={() => this.redirectToAnalyze(expenseSheet.name)}>Analyze</Button>{' '}
                                    <Button variant="success">Share</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                }
                <Col className='welcome-col' style={{ cursor: 'pointer' }} onClick={() => ExpenseSheetStore.showCreateForm = true} lg={6} xl={4}>
                    <Card border="primary" className="create-new-sheet-div">
                        <blockquote className="blockquote mb-0 card-body">
                            Create new expense sheet
                        </blockquote>
                    </Card>
                </Col>
            </Row>
            <Modal show={ExpenseSheetStore.showCreateForm} onHide={() => ExpenseSheetStore.showCreateForm = false} animation={false} size="m">
                <Modal.Header closeButton>
                    <Modal.Title>New expense sheet form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Control type="text" placeholder="Enter name" autoFocus onChange={e => this.name = e.target.value} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control type="text" placeholder="Enter description" onChange={e => this.description = e.target.value} />
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary" onClick={this.createNewSheet}>Create new sheet</Button>{' '}
                            <Button variant="secondary" onClick={() => ExpenseSheetStore.showCreateForm = false}>Cancel</Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
            <ConfirmationModal 
                show={ExpenseSheetStore.showDeletionConfirmationDialog} 
                title="Delete Expense Sheet" 
                question={`Do you really want to delete '${this.sheetToBeDeleted}' expense sheet?`}
                onConfirmation={() => this.delete(this.sheetToBeDeleted)}
                onCancellation={() => ExpenseSheetStore.showDeletionConfirmationDialog = false}/>
        </div>
    }
}
export default Welcome