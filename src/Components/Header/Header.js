import React, {Component} from 'react';
import SideMenu from '../SideMenu/SideMenu';
import './Header.css';

class Header extends Component {
    render(){
        return (
            <div className='main-header'>
                <SideMenu />
            </div>
        )
    }
}

export default Header;