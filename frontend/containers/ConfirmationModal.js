import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Modal } from 'react-bootstrap'

@observer
class ConfirmationModal extends Component {

    render() {
        return <Modal show={this.props.show} onHide={this.props.onCancellation}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{this.props.question}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={this.props.onConfirmation}>Yes</Button>
                <Button variant="secondary" onClick={this.props.onCancellation}>No</Button>
            </Modal.Footer>
        </Modal>
    }
}
export default ConfirmationModal