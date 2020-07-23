import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import removeIcon from '../../assets/x.svg';
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
        if(prevState.userInput !== this.state.userInput && this.state.userInput){
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

        this.setState({
            selectedUsers: selectedArr,
            userInput: '',
            filteredUsers: []
        })
    }

    inviteUser = () => {
        const {selectedUsers} = this.state,
              {group, toggleFn} = this.props;

        axios.post('/api/user', {userArr: selectedUsers, group_id: group})
        .then(() => toggleFn())
        .catch(err => console.log(err));
    }

    removeSelectedUser = (id) => {
        let selected = this.state.selectedUsers.slice(),
            index = selected.findIndex(e => e.user_id === id);

        selected.splice(index, 1);
        this.setState({selectedUsers: selected});
    }

    render(){
        const {groupName, userInput, filteredUsers, selectedUsers} = this.state,
              {toggleFn} = this.props;
        return (
            <div className='full-modal-backdrop'>
                <div className='group-modal'>
                    <h3>Create a Group</h3>
                    <label>Group Name</label>
                    <input value={groupName} name='groupName' onChange={e => this.handleInput(e)}/>
                    <label>Invite Someone</label>
                    <input value={userInput} name='userInput' onChange={e => this.handleInput(e)}/>
                    {filteredUsers?.map(user => (
                        <p key={user.user_id} onClick={() => this.selectUser(user)}>{user.username}</p>
                    ))}
                    <div className='selected-user-flex'>
                        {selectedUsers?.map(user => (
                            <div key={user.user_id} className='selected-user'>
                                <p>{user.username}</p>
                                <img src={removeIcon} alt='Remove Selected User' className='remove-icon' onClick={() =>this.removeSelectedUser(user.user_id)}/>
                            </div>
                        ))}
                    </div>
                    <button onClick={this.createGroup}>Submit</button>
                    <button onClick={toggleFn}>Cancel</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(GroupModal);