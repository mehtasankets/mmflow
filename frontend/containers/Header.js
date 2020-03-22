import React, { Component } from 'react'
import { Navbar } from 'react-bootstrap'
import { GiWallet } from 'react-icons/gi'
import { inject, observer } from 'mobx-react'

@inject('UserStore')
@observer
class Header extends Component {
    render() {
        const { UserStore } = this.props
        return <div className='header-bar'>
            <Navbar bg="dark" variant="dark" fixed='top'>
                <Navbar.Brand href="/mmflow/welcome">
                    <GiWallet size={2} className='logo' />{' '}Monthly money flow
                </Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text style={{color: "white"}}>
                        {UserStore.user.displayName}
                    </Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        </div>
    }
}
export default Header