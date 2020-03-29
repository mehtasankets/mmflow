import './Login.css'
import React, { Component } from 'react'
import { Form, Control, Button } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'
import GoogleLogin from 'react-google-login';
import Header from './Header'
import User from '../store/User'

@inject('UserStore')
@observer
class Login extends Component {

    login = (response) => {
        const profile = response.getBasicProfile();
        const idToken = response.getAuthResponse().id_token;
        const displayName = profile.getName();
        const imageUrl = profile.getImageUrl();
        const user = new User("", idToken, displayName, imageUrl);
        this.props.UserStore.login(user, () => {
            this.props.history.push("/mmflow/welcome")
        })
    }

    showException = (response) => {
        Window.alert(response);
    }

    render() {
        return <div className='login'>
            <Header />
            <GoogleLogin
                clientId="1034128931991-b5lgu67qod6vbsgilml6ir7iuaffqevk.apps.googleusercontent.com"
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