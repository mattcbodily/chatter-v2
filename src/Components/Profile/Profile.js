import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {loginUser, logoutUser} from '../../redux/reducer';

class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: this.props.user.username,
            email: this.props.user.email,
            edit: false
        }
    }

    handleInput = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleLogout = () => {
        axios.get('/api/logout')
        .then(() => {
            this.props.logoutUser();
            this.props.history.push('/');            
        })
    }

    editView = () => {
        this.setState(prevState => ({editView: !prevState.editView}));
    }

    updateUser = () => {
        const {username, email} = this.state,
              {user, loginUser} = this.props;

        axios.put(`/api/user/${user.user_id}`, {username, email})
        .then(res => {
            loginUser(res.data);
            this.editView();
        })
    }

    render(){
        const {username, email, editView} = this.state,
              {user} = this.props;

        return (
            <div>
                {!editView
                ? (
                    <>
                        <h1>Hello, {user.username}!</h1>
                        <img src={user.profile_picture} alt={user.username}/>
                        <button onClick={this.editView}>Edit Information</button>
                        <button onClick={this.handleLogout}>Log out</button>
                    </>
                )
                : (
                    <>
                        <input value={username} name='username' onChange={e => this.handleInput(e)}/>
                        <input value={email} name='email' onChange={e => this.handleInput(e)}/>
                        <button onClick={this.updateUser}>Update</button>
                        <button onClick={this.editView}>Cancel</button>
                    </>
                )}
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps, {loginUser, logoutUser})(Profile);