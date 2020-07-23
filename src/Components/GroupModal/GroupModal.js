import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import './GroupModal.scss';

class GroupModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            groupName: '',
            userInput: '',
            users: [],
            filteredUsers: [],
            selectedUsers: [],
            inviteView: false,
            settingView: false
        }
    }

    componentDidMount(){
        axios.get('/api/users')
        .then(res => this.setState({users: res.data}))
        .catch(err => console.log(err));
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.userInput !== this.state.userInput){
            this.setState({filteredUsers: this.state.users.filter(user => user.username.includes(this.state.userInput))})
        }
    }

    handleInput = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    createGroup = () => {
        const {groupName, selectedUsers} = this.state,
              {user, getGroupFn, modalFn} = this.props;
        axios.post('/api/group', {groupName, user_id: user.user_id, userArr: selectedUsers})
        .then(res => {
            getGroupFn();
            this.setState({
                groupName: '',
                filteredUsers: [],
                selectedUsers: []
            });
            modalFn();
        })
        .catch(err => console.log(err));
    }

    selectUser = (userObj) => {
        let selectedArr = this.state.selectedUsers.slice();
        selectedArr.push(userObj)

        this.setState({selectedUsers: selectedArr})
    }

    inviteUser = () => {
        const {selectedUsers} = this.state,
              {group, toggleFn} = this.props;

        axios.post('/api/user', {userArr: selectedUsers, group_id: group})
        .then(() => toggleFn())
        .catch(err => console.log(err));
    }

    render(){
        const {groupName, userInput, filteredUsers} = this.state;
        return (
            <div className='group-modal'>
                <h3>Create a Group</h3>
                <input value={groupName} name='groupName' onChange={e => this.handleInput(e)}/>
                <label>Invite Someone</label>
                <input value={userInput} name='userInput' onChange={e => this.handleInput(e)}/>
                {filteredUsers?.map(user => (
                    <p key={user.user_id} onClick={() => this.selectUser(user)}>{user.username}</p>
                ))}
                <button onClick={this.createGroup}>Submit</button>
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(GroupModal);