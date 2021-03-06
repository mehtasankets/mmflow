import './Login.css'
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import GoogleLogin from 'react-google-login'
import Header from './Header'
import User from '../store/User'

@inject('UserStore')
@observer
class Login extends Component {

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

    render() {
        return <div className='login'>
            <Header {...this.props} />
            <GoogleLogin
                clientId="534936470564-h75v3gcql2vlrph63qc0i1scsdbak94h.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={this.login}
                onFailure={this.showException}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div >
    }
}
export default Login
