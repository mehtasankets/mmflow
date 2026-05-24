import './Welcome.css'
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { GiWallet } from 'react-icons/gi'
import { FaArrowRight, FaChartLine, FaPlus, FaTrashAlt } from 'react-icons/fa'
import ConfirmationModal from './ConfirmationModal'
import ExpenseSheet from './../store/ExpenseSheet'

@inject('UserStore', 'ExpenseSheetStore')
@observer
class Welcome extends Component {
    state = {
        showUserMenu: false
    }

    componentWillMount() {
        const { UserStore, ExpenseSheetStore } = this.props
        ExpenseSheetStore.getExpenseSheets(UserStore.user)
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

    redirectToDetails = (expenseSheetName) => {
        this.props.history.push("/details?expenseSheetName=" + expenseSheetName)
    }

    redirectToAnalyze = (expenseSheetName) => {
        this.props.history.push("/analyze?expenseSheetName=" + expenseSheetName)
    }

    delete = (expenseSheetName) => {
        this.props.ExpenseSheetStore.delete(this.props.UserStore.user, [expenseSheetName])
    }

    createNewSheet = () => {
        const expenseSheet = new ExpenseSheet(null, this.name, this.description, [])
        this.props.ExpenseSheetStore.create(this.props.UserStore.user, [expenseSheet])
    }

    renderSheetCard = (expenseSheet) => {
        const sharedCount = (expenseSheet.sharedWith || []).length

        return <article className="welcome-sheet-card" key={expenseSheet.name}>
            <div className="welcome-sheet-top">
                <div className="welcome-sheet-copy">
                    <h2 className="welcome-sheet-title">{expenseSheet.name}</h2>
                    <p className="welcome-sheet-description">{expenseSheet.description || "No description yet. Add one when you create the next sheet."}</p>
                </div>
                <button
                    type="button"
                    className="welcome-sheet-delete"
                    onClick={() => {
                        this.sheetToBeDeleted = expenseSheet.name
                        this.props.ExpenseSheetStore.showDeletionConfirmationDialog = true
                    }}
                    aria-label={`Delete ${expenseSheet.name}`}
                    title="Delete sheet"
                >
                    <FaTrashAlt />
                </button>
            </div>

            <div className="welcome-sheet-meta">
                <span>{sharedCount} shared</span>
                <span>Expense sheet</span>
            </div>

            <div className="welcome-sheet-actions">
                <button type="button" className="welcome-sheet-primary" onClick={() => this.redirectToDetails(expenseSheet.name)}>
                    <span>Open sheet</span>
                    <FaArrowRight />
                </button>
                <button type="button" className="welcome-sheet-secondary" onClick={() => this.redirectToAnalyze(expenseSheet.name)}>
                    <FaChartLine />
                    <span>Analyze</span>
                </button>
            </div>
        </article>
    }

    render() {
        const { ExpenseSheetStore, UserStore } = this.props

        return <div className='welcome'>
            <header className="welcome-header">
                <div className="welcome-header-copy">
                    <button type="button" className="welcome-brandline welcome-brand-button" onClick={this.goToWelcome}>
                        <GiWallet className="welcome-brand-icon" />
                        <div>
                            <h1 className="welcome-brand-title">MMFlow</h1>
                            <p className="welcome-brand-subtitle">Family expense tracker</p>
                        </div>
                    </button>
                </div>
                <div className="welcome-header-actions">
                    {UserStore.isAuthenticated ? <div className="welcome-user-menu" ref={(node) => { this.menuRef = node }}>
                        <button type="button" className="welcome-user-trigger" onClick={this.toggleUserMenu}>
                            <span className="welcome-user-avatar">
                                {UserStore.user.profilePicUrl ? <img className="welcome-user-avatar-image" src={UserStore.user.profilePicUrl} alt={UserStore.user.displayName} /> : this.getUserInitial()}
                            </span>
                            <span className="welcome-user-name">{UserStore.user.displayName}</span>
                        </button>
                        {this.state.showUserMenu ? <div className="welcome-user-popover">
                            <p className="welcome-user-popover-label">Signed in as</p>
                            <p className="welcome-user-popover-name">{UserStore.user.displayName}</p>
                            <button type="button" className="welcome-user-logout" onClick={this.logout}>Logout</button>
                        </div> : null}
                    </div> : null}
                </div>
            </header>

            <main className="welcome-shell">
                <section className="welcome-hero">
                    <p className="welcome-kicker">Expense Sheets</p>
                    <h1 className="welcome-title">Pick a sheet and keep the household ledger moving.</h1>
                    <p className="welcome-subtitle">Each sheet holds a separate stream of spending. Open one to log expenses, review the timeline, or jump into analysis.</p>
                </section>

                <section className="welcome-grid">
                    <article className="welcome-create-card" onClick={() => ExpenseSheetStore.showCreateForm = true} role="button" tabIndex="0" onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            ExpenseSheetStore.showCreateForm = true
                        }
                    }}>
                        <div className="welcome-create-icon">
                            <FaPlus />
                        </div>
                        <h2 className="welcome-create-title">Create new expense sheet</h2>
                        <p className="welcome-create-copy">Start a fresh ledger for a trip, a month, or a new household track.</p>
                    </article>
                    {ExpenseSheetStore.expenseSheets.map(this.renderSheetCard)}
                </section>
            </main>

            {ExpenseSheetStore.showCreateForm ? <div className="welcome-modal-overlay" onClick={() => ExpenseSheetStore.showCreateForm = false}>
                <section className="welcome-modal-sheet" role="dialog" aria-modal="true" aria-labelledby="new-sheet-title" onClick={(event) => event.stopPropagation()}>
                    <button type="button" className="welcome-modal-close" onClick={() => ExpenseSheetStore.showCreateForm = false} aria-label="Close new expense sheet form">×</button>
                    <div className="welcome-modal-shell">
                        <p className="welcome-modal-kicker">New sheet</p>
                        <h2 id="new-sheet-title" className="welcome-modal-title">Create an expense sheet</h2>
                        <div className="welcome-modal-fields">
                            <label className="welcome-modal-field">
                                <span>Name</span>
                                <input type="text" placeholder="Family May 2026" autoFocus onChange={e => this.name = e.target.value} />
                            </label>
                            <label className="welcome-modal-field">
                                <span>Description</span>
                                <input type="text" placeholder="What will this sheet track?" onChange={e => this.description = e.target.value} />
                            </label>
                        </div>
                        <div className="welcome-modal-actions">
                            <button type="button" className="welcome-modal-submit" onClick={this.createNewSheet}>Create sheet</button>
                            <button type="button" className="welcome-modal-cancel" onClick={() => ExpenseSheetStore.showCreateForm = false}>Cancel</button>
                        </div>
                    </div>
                </section>
            </div> : null}

            <ConfirmationModal
                show={ExpenseSheetStore.showDeletionConfirmationDialog}
                title="Delete Expense Sheet"
                question={`Do you really want to delete '${this.sheetToBeDeleted}' expense sheet?`}
                onConfirmation={() => this.delete(this.sheetToBeDeleted)}
                onCancellation={() => ExpenseSheetStore.showDeletionConfirmationDialog = false} />
        </div>
    }
}

export default Welcome
