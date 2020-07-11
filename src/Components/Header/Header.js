import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import axios from 'axios';
import SideMenu from '../SideMenu/SideMenu';
import './Header.css';

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
                <SideMenu chatGroups={this.state.chatGroups}/>
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default withRouter(connect(mapStateToProps)(Header));