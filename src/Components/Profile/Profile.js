import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {loginUser, logoutUser} from '../../redux/reducer';
import './Profile.scss';

class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: this.props.user.username,
            email: this.props.user.email,
            profilePicture: this.props.user.profilePicture,
            edit: false,
            avatarArr: []
        }
    }

    componentDidMount(){
        if(!this.props.user.user_id){
            this.props.history.push('/');
        }
    }

    handleInput = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    changeAvatar = (avatar) => {
        this.setState({profilePicture: avatar})
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

        if(!this.state.editView){
            let pictureArr = [],
                randStr = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            for(let i = 1; i <= 6; i++){
                pictureArr.push(`https://robohash.org/${randStr}${i}.png`)
            };

            this.setState({avatarArr: pictureArr});
        }
    }

    updateUser = () => {
        const {username, email, profilePicture} = this.state,
              {user, loginUser} = this.props;

        axios.put(`/api/user/${user.user_id}`, {username, email, profilePicture})
        .then(res => {
            loginUser(res.data);
            this.editView();
        })
    }

    render(){
        const {username, email, editView, avatarArr} = this.state,
              {user} = this.props;

        return (
            <div className='profile'>
                {!editView
                ? (
                    <section className='profile-flex'>
                        <h1>Hello, {user.username}!</h1>
                        <img src={user.profile_picture} alt={user.username} className='profile-avatar'/>
                        <button onClick={this.editView}>Edit Information</button>
                        <button onClick={this.handleLogout}>Log out</button>
                    </section>
                )
                : (
                    <section className='profile-flex'>
                        <h1>Edit Your Info</h1>
                        <label>Username</label>
                        <input value={username} name='username' onChange={e => this.handleInput(e)}/>
                        <label>Email</label>
                        <input value={email} name='email' onChange={e => this.handleInput(e)}/>
                        <label>Change your Avatar?</label>
                        <div className='avatar-flex'>
                            {avatarArr.map((avatar, i) => (
                                <img 
                                    key={i} 
                                    style={{height: '100px', width: '100px'}} 
                                    src={avatar} 
                                    alt='New Avatar'
                                    onClick={() => this.changeAvatar(avatar)}/>
                            ))}
                        </div>
                        <button onClick={this.updateUser}>Update</button>
                        <button onClick={this.editView}>Cancel</button>
                    </section>
                )}
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps, {loginUser, logoutUser})(Profile);