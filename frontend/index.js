import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react'
import { render } from 'react-dom'
import App from './containers/App'
import { Provider } from 'mobx-react'
import ExpenseStore from './store/ExpenseStore'

const Root = (
    <Provider ExpenseStore={ExpenseStore}>
        <App />
    </Provider>
)

render(Root, document.getElementById('root'))