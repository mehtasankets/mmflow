import React from 'react'
import { render } from 'react-dom'
import App from './containers/App'
import { Provider } from 'mobx-react'
import ExpensesStore from './store/ExpensesStore'

const Root = (
    <Provider ExpensesStore={ExpensesStore}>
        <App />
    </Provider>
)

render(Root, document.getElementById('root'))