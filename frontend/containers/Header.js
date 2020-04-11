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
            <Navbar bg="dark" variant="dark" fixed='top'>
                <Navbar.Brand href="/welcome">
                    <GiWallet size={2} className='logo' />{' '}Monthly money flow
                </Navbar.Brand>
                {
                    UserStore.isAuthenticated ?
                    <Navbar.Collapse className="justify-content-end">
                        <Image className="profile-pic" src={UserStore.user.profilePicUrl} roundedCircle />
                        <DropdownButton variant="dark" alignRight id="dropdown-basic-button" title={UserStore.user.displayName}>
                            <Dropdown.Item onClick={this.logout}>
                                Logout
                            </Dropdown.Item>
                        </DropdownButton>
                    </Navbar.Collapse>
                    : null
                }
            </Navbar>
        </div>
    }
}
export default Header