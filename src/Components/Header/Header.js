import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import SideMenu from '../SideMenu/SideMenu';
import './Header.scss';

class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            chatGroups: []
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

    render(){
        return (
            <div className='main-header'>
                <h1>Chatter</h1>
                <nav>
                    <Link to='/chat/0'>Dashboard</Link>
                    <Link to='/profile'>Profile</Link>
                </nav>
                {this.props.location.pathname !== '/profile'
                ? <SideMenu chatGroups={this.state.chatGroups} getGroupFn={this.getGroups}/>
                : null}
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default withRouter(connect(mapStateToProps)(Header));