import './Header.css'
import React, { Component } from 'react'
import { Navbar} from 'react-bootstrap'

class Header extends Component {
    render() {
        return <div className='header-bar'>
            <Navbar bg="dark" variant="dark" fixed='top'>
                <Navbar.Brand href="/mmflow/">
                    Monthly money flow
                </Navbar.Brand>
            </Navbar>
        </div>
    }
}
export default Header