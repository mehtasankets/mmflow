import './Analyze.css'
import 'flatpickr/dist/themes/material_green.css'

import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Summary from './Summary'
import Analytics from './Analytics'
import PivotAnalytics from './PivotAnalytics'
import { GiWallet } from 'react-icons/gi'

@inject('ExpenseStore', 'UserStore')
@observer
class Analyze extends Component {
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

    toggleUserMenu = (event) => {
        event.stopPropagation()
        this.setState((state) => ({ showUserMenu: !state.showUserMenu }))
    }

    logout = () => {
        this.props.UserStore.logout(() => {
            this.props.history.push('/login')
        })
    }

    goToWelcome = () => {
        this.props.history.push('/welcome')
    }

    getUserInitial = () => {
        const name = this.props.UserStore.user.displayName || 'U'
        return name.trim().charAt(0).toUpperCase()
    }

    render() {
        const { UserStore } = this.props
        return <div className='analyze'>
            <header className="analyze-header">
                <div className="analyze-header-copy">
                    <button type="button" className="analyze-brandline analyze-brand-button" onClick={this.goToWelcome}>
                        <GiWallet className="analyze-brand-icon" />
                        <div>
                            <h1 className="analyze-brand-title">MMFlow</h1>
                            <p className="analyze-brand-subtitle">Family expense tracker</p>
                        </div>
                    </button>
                </div>
                <div className="analyze-header-actions">
                    {UserStore.isAuthenticated ? <div className="analyze-user-menu" ref={(node) => { this.menuRef = node }}>
                        <button type="button" className="analyze-user-trigger" onClick={this.toggleUserMenu}>
                            <span className="analyze-user-avatar">
                                {UserStore.user.profilePicUrl ? <img className="analyze-user-avatar-image" src={UserStore.user.profilePicUrl} alt={UserStore.user.displayName} /> : this.getUserInitial()}
                            </span>
                            <span className="analyze-user-name">{UserStore.user.displayName}</span>
                        </button>
                        {this.state.showUserMenu ? <div className="analyze-user-popover">
                            <p className="analyze-user-popover-label">Signed in as</p>
                            <p className="analyze-user-popover-name">{UserStore.user.displayName}</p>
                            <button type="button" className="analyze-user-logout" onClick={this.logout}>Logout</button>
                        </div> : null}
                    </div> : null}
                </div>
            </header>

            <main className="analyze-shell">
                <section className="analyze-hero">
                    <p className="analyze-kicker">Analysis</p>
                    <h1 className="analyze-title">Read the patterns behind your household spending.</h1>
                    <p className="analyze-subtitle">Use the summary, timeline, and pivot view to understand how expenses shift over time, across categories, and between people.</p>
                </section>
                <Summary {...this.props} />
                <Analytics {...this.props} />
                <PivotAnalytics {...this.props} />
            </main>
        </div>
    }
}
export default Analyze
