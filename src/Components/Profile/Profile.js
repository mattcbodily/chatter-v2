import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {logoutUser} from '../../redux/reducer';

class Profile extends Component {
    handleLogout = () => {
        axios.get('/api/logout')
        .then(() => {
            this.props.logoutUser();
            this.props.history.push('/');            
        })
    }

    render(){
        const {user, logoutUser} = this.props;
        return (
            <div>
                <h1>Hello, {user.username}!</h1>
                <img src={user.profile_picture} alt={user.username}/>
                <button onClick={this.handleLogout}>Log out</button>
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps, {logoutUser})(Profile);