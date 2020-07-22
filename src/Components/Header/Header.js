import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import SideMenu from '../SideMenu/SideMenu';
import hamburger from '../../assets/menu.svg';
import moreVertical from '../../assets/more-vertical.svg';
import './Header.scss';

class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            chatGroups: [],
            sideMenuView: false,
            mainMenuView: false
        }
    }

    componentDidMount(){
        this.getGroups();
    }

    getGroups = () => {
        const {user} = this.props;
        axios.get(`/api/groups/${user.user_id}`)
        .then(res => {
            this.setState({chatGroups: res.data})
        })
        .catch(err => console.log(err));
    }

    toggleSideMenu = () => {
        this.setState(prevState => ({sideMenuView: !prevState.sideMenuView}))
    }

    toggleMainMenu = () => [
        this.setState(prevState => ({mainMenuView: !prevState.mainMenuView}))
    ]

    render(){
        const {chatGroups, sideMenuView, mainMenuView} = this.state,
              {id} = this.props.match.params;

        return (
            <div className='main-header'>
                <header className='header-mobile'>
                    <img src={hamburger} alt='Menu' onClick={this.toggleSideMenu}/>
                    {sideMenuView
                    ? <SideMenu chatGroups={this.state.chatGroups} getGroupFn={this.getGroups} toggleFn={this.toggleSideMenu}/>
                    : null}
                    <img src={moreVertical} alt='Group Menu' onClick={this.toggleMainMenu}/>
                    {mainMenuView
                    ? (
                        <nav className='dropdown'>
                            <Link to='/chat/0' onClick={this.toggleMainMenu}>Dashboard</Link>
                            <Link to='/profile' onClick={this.toggleMainMenu}>Profile</Link>
                        </nav>
                    )
                    : null}
                </header>
                <header className='header-desktop'>
                    <h1>Chatter</h1>
                    <nav>
                        <Link to='/chat/0'>Dashboard</Link>
                        <Link to='/profile'>Profile</Link>
                    </nav>
                    {this.props.location.pathname !== '/profile'
                    ? <SideMenu chatGroups={this.state.chatGroups} getGroupFn={this.getGroups}/>
                    : null}
                </header>
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default withRouter(connect(mapStateToProps)(Header));