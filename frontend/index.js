import 'bootstrap/dist/css/bootstrap.min.css'

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'mobx-react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'
import ProtectedRoute from './containers/ProtectedRoute'
import Login from './containers/Login'
import Welcome from './containers/Welcome'
import Details from './containers/Details'
import Analyze from './containers/Analyze'
import ExpenseStore from './store/ExpenseStore'
import UserStore from './store/UserStore'
import ExpenseSheetStore from './store/ExpenseSheetStore'

const Root = (
    <BrowserRouter>
        <Provider ExpenseStore={ExpenseStore} UserStore={UserStore} ExpenseSheetStore={ExpenseSheetStore}>
            <Route exact path={["", "/", "/login"]} component={Login} />
            <ProtectedRoute exact path="/welcome" component={Welcome} />
            <ProtectedRoute exact path="/details" component={Details} />
            <ProtectedRoute exact path="/analyze" component={Analyze} />
        </Provider>
    </BrowserRouter>
)

render(Root, document.getElementById('root'))