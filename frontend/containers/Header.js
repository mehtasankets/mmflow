import React, { Component } from 'react'
import { Navbar, Image, DropdownButton, Dropdown } from 'react-bootstrap'
import { GiWallet } from 'react-icons/gi'
import { inject, observer } from 'mobx-react'

@inject('UserStore')
@observer
class Header extends Component {

    logout = () => {
        this.props.UserStore.logout(() => {
            this.props.history.push('/login')
        })
    }

    render() {
        const { UserStore } = this.props
        return <div className='header-bar'>
            <Navbar bg="dark" variant="dark" fixed='top' expand="md" className="app-navbar">
                <Navbar.Brand href="/welcome" className="app-navbar-brand">
                    <GiWallet size={2} className='logo' />
                    <span className="brand-text">Monthly money flow</span>
                </Navbar.Brand>
                {
                    UserStore.isAuthenticated ?
                    <div className="app-navbar-actions">
                        <Navbar.Toggle aria-controls="app-navbar-nav" />
                        <Navbar.Collapse id="app-navbar-nav" className="justify-content-end">
                            <div className="user-menu">
                                <Image className="profile-pic" src={UserStore.user.profilePicUrl} roundedCircle />
                                <DropdownButton variant="dark" alignRight id="dropdown-basic-button" title={UserStore.user.displayName}>
                                    <Dropdown.Item onClick={this.logout}>
                                        Logout
                                    </Dropdown.Item>
                                </DropdownButton>
                            </div>
                        </Navbar.Collapse>
                    </div>
                    : null
                }
            </Navbar>
        </div>
    }
}
export default Header
