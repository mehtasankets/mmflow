import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'

@inject('UserStore')
@observer
class ProtectedRoute extends Component {

    render() {
        const { component: Component, ...rest } = this.props
        return <Route
            {...rest}
            render={
                (props) => {
                    if (this.props.UserStore.isAuthenticated) {
                        return <Component {...props} />
                    } else {
                        return <Redirect to={
                            {
                                pathname: "/login",
                                state: {
                                    from: props.location
                                }
                            }
                        } />
                    }
                }
            } />
    }
}
export default ProtectedRoute