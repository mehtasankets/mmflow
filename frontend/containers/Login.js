import './Login.css'
import React, { Component } from 'react'
import { Form, Control, Button } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import Header from './Header'

@inject('UserStore')
@observer
class Login extends Component {

    login = () => {
        this.props.UserStore.login(this.password, () => {
            this.props.history.push("/mmflow/welcome")
        })
    }

    triggerLogin = (e) => {
        if (e.charCode == 13) {
            this.login(e)
        }
    }

    render() {
        return <div className='login'>
            <Header />
            <div className='login-form'>
                <Form.Group>
                    <Form.Control type="password" placeholder="Enter password" autoFocus
                        onChange={e => this.password = e.target.value} onKeyPress={this.triggerLogin} />
                </Form.Group>
                <Button variant="primary" onClick={this.login}>Login</Button>
            </div>
        </div >
    }
}
export default Login