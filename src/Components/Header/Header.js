import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import {selectChat} from '../../redux/reducer';
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
            this.setState({chatGroups: res.data});
            this.props.history.push(`/chat/${res.data[0].group_id}`);
            this.props.selectChat(res.data[0].group_id);
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
              {selectedChat} = this.props;

        return (
            <div className='main-header'>
                <header className='header-mobile'>
                    <img src={hamburger} alt='Menu' onClick={this.toggleSideMenu}/>
                    {sideMenuView
                    ? <SideMenu chatGroups={chatGroups} getGroupFn={this.getGroups} toggleFn={this.toggleSideMenu}/>
                    : null}
                    <h3 className='group-name'>{chatGroups.find(e => e.group_id === selectedChat)?.group_name}</h3>
                    <img src={moreVertical} alt='Group Menu' onClick={this.toggleMainMenu}/>
                    {mainMenuView
                    ? (
                        <nav className='dropdown'>
                            <Link to={`/chat/${selectedChat}`} onClick={this.toggleMainMenu}>Dashboard</Link>
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

export default withRouter(connect(mapStateToProps, {selectChat})(Header));