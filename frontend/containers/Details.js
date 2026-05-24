import './Details.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Summary from './Summary'
import DataGrid from './DataGrid'
import ExpenseForm from './ExpenseForm'
import { GiWallet } from 'react-icons/gi'

@inject('ExpenseStore', 'UserStore')
@observer
class Details extends Component {
    state = {
        showUserMenu: false
    }

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick)
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick)
    }

    handleDocumentClick = (event) => {
        if (!this.menuRef || !this.menuRef.contains(event.target)) {
            this.setState({ showUserMenu: false })
        }
    }

    logout = () => {
        this.props.UserStore.logout(() => {
            this.props.history.push('/login')
        })
    }

    openNewExpenseForm = () => {
        this.props.ExpenseStore.openNewExpenseForm()
    }

    goToWelcome = () => {
        this.props.history.push('/welcome')
    }

    toggleUserMenu = (event) => {
        event.stopPropagation()
        this.setState((state) => ({ showUserMenu: !state.showUserMenu }))
    }

    getUserInitial = () => {
        const name = this.props.UserStore.user.displayName || 'U'
        return name.trim().charAt(0).toUpperCase()
    }

    render() {
        const { UserStore } = this.props
        return <div className='details'>
            <header className="details-header">
                <div className="details-header-copy">
                    <button type="button" className="details-brandline details-brand-button" onClick={this.goToWelcome}>
                        <GiWallet className="details-brand-icon" />
                        <div>
                            <h1 className="details-brand-title">MMFlow</h1>
                            <p className="details-brand-subtitle">Family expense tracker</p>
                        </div>
                    </button>
                </div>
                <div className="details-header-actions">
                    <button type="button" className="details-add-button" onClick={this.openNewExpenseForm} aria-label="Add expense">+</button>
                    {UserStore.isAuthenticated ? <div className="details-user-menu" ref={(node) => { this.menuRef = node }}>
                            <button type="button" className="details-user-trigger" onClick={this.toggleUserMenu}>
                                <span className="details-user-avatar">
                                    {UserStore.user.profilePicUrl ? <img className="details-user-avatar-image" src={UserStore.user.profilePicUrl} alt={UserStore.user.displayName} /> : this.getUserInitial()}
                                </span>
                                <span className="details-user-name">{UserStore.user.displayName}</span>
                            </button>
                            {this.state.showUserMenu ? <div className="details-user-popover">
                                <p className="details-user-popover-label">Signed in as</p>
                                <p className="details-user-popover-name">{UserStore.user.displayName}</p>
                                <button type="button" className="details-user-logout" onClick={this.logout}>Logout</button>
                            </div> : null}
                        </div> : null}
                </div>
            </header>
            <div className="details-shell">
                <Summary {...this.props} />
                <DataGrid {...this.props} />
                <ExpenseForm {...this.props} />
            </div>
        </div>
    }
}
export default Details
