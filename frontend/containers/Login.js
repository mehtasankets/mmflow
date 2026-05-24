import './Login.css'
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import GoogleLogin from 'react-google-login'
import Header from './Header'
import User from '../store/User'

const prodFrontendHosts = ['mmflow.mehtasanket.in']

@inject('UserStore')
@observer
class Login extends Component {
    componentDidMount() {
        if (this.props.UserStore.isAuthenticated) {
            this.props.history.replace('/welcome')
        }
    }

    login = (response) => {
        const profile = response.getBasicProfile()
        const idToken = response.getAuthResponse().id_token
        const displayName = profile.getName()
        const imageUrl = profile.getImageUrl()
        const user = new User("", idToken, displayName, imageUrl)
        this.props.UserStore.login(user, () => {
            let destination = '/welcome'
            if (this.props.location.state && this.props.location.state.from) {
                destination = this.props.location.state.from
            }
            this.props.history.push(destination)
        })
    }

    showException = (response) => {
        Window.alert(response)
    }

    isLocalDev = () => {
        return !prodFrontendHosts.includes(window.location.hostname)
    }

    loginForDev = () => {
        this.props.UserStore.loginForDev(() => {
            let destination = '/welcome'
            if (this.props.location.state && this.props.location.state.from) {
                destination = this.props.location.state.from
            }
            this.props.history.push(destination)
        })
    }

    render() {
        return <div className='login'>
            <Header {...this.props} />
            <div className="login-shell">
                <div className="login-panel">
                    <h1 className="login-title">Track spending with less friction</h1>
                    <p className="login-subtitle">
                        Sign in to review shared expenses, spot trends quickly, and update entries from any screen size.
                    </p>
                    <div className="login-actions">
                        <GoogleLogin
                            clientId="534936470564-h75v3gcql2vlrph63qc0i1scsdbak94h.apps.googleusercontent.com"
                            buttonText="Login with Google"
                            onSuccess={this.login}
                            onFailure={this.showException}
                            cookiePolicy={'single_host_origin'}
                            isSignedIn={true}
                        />
                        {
                            this.isLocalDev() &&
                            <div className="login-dev-action">
                                <button className="btn btn-outline-secondary btn-block" onClick={this.loginForDev}>Continue as Dev User</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div >
    }
}
export default Login
