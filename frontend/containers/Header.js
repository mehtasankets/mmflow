import React, { Component } from 'react'
import { Navbar} from 'react-bootstrap'
import { GiWallet } from 'react-icons/gi'

class Header extends Component {
    render() {
        return <div className='header-bar'>
            <Navbar bg="dark" variant="dark" fixed='top'>
                <Navbar.Brand href="/mmflow/">
                    <GiWallet size={2} className='logo' />{' '}Monthly money flow
                </Navbar.Brand>
            </Navbar>
        </div>
    }
}
export default Header