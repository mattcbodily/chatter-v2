import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import GroupModal from '../GroupModal/GroupModal';
import {selectChat} from '../../redux/reducer';
import addUserIcon from '../../assets/user-plus.svg';
import settingIcon from '../../assets/settings.svg';
import './SideMenu.scss';

class SideMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalView: false,
            inviteView: false,
            settingView: false
        }
    }

    handleModalToggle = () => {
        this.setState(prevState => ({modalView: !prevState.modalView}))
    }

    handleInviteToggle = () => {
        this.setState(prevState => ({inviteView: !prevState.inviteView}))
    }

    handleSettingToggle = () => {
        this.setState(prevState => ({settingView: !prevState.settingView}))
    }

    handleChatSelect = (id) => {
        const {toggleFn, selectChat} = this.props;

        selectChat(id);
        toggleFn();
    }

    render(){
        const {modalView, inviteView, settingView} = this.state,
              {chatGroups, getGroupFn} = this.props;

        return (
            <div className='side-menu'>
                {chatGroups.length
                ? chatGroups.map(group => (
                    <section key={group.group_id} className='chat-group'>
                        <Link 
                            to={`/chat/${group.group_id}`} 
                            className='chat-links'
                            onClick={() => this.handleChatSelect(+group.group_id)}>{group.group_name}</Link>
                        <img src={addUserIcon} alt='Add User' onClick={this.handleInviteToggle}/>
                        {inviteView
                        ? <GroupModal group={group.group_id} getGroupFn={getGroupFn} modalFn={this.handleInviteToggle} render={(handleInput, groupName, userInput, users, filteredUsers, selectedUsers, createGroup, selectUser, inviteUser) => (
                            <div className='group-modal'>
                                <h3>Invite Someone</h3>
                                <input value={userInput} name='userInput' onChange={e => this.handleInput(e)}/>
                                {filteredUsers?.map(user => (
                                    <p key={user.user_id} onClick={() => selectUser(user)}>{user.username}</p>
                                ))}
                                <button onClick={inviteUser}>Invite</button>
                            </div>
                        )}/>
                        : null}
                        <img src={settingIcon} alt='Chat Settings'/>
                    </section>
                ))
                : (
                    <>
                        <p>You don't have any groups!</p>
                    </>
                )}
                <button onClick={this.handleModalToggle}>Create a Group</button>
                {modalView
                ? <GroupModal getGroupFn={getGroupFn} modalFn={this.handleModalToggle} render={(handleInput, groupName, userInput, users, filteredUsers, selectedUsers, createGroup, selectUser) => (
                    <div className='group-modal'>
                        <h3>Create a Group</h3>
                        <input value={groupName} name='groupName' onChange={e => handleInput(e)}/>
                        <label>Invite Someone</label>
                        <input value={userInput} name='userInput' onChange={e => handleInput(e)}/>
                        {filteredUsers?.map(user => (
                            <p key={user.user_id} onClick={() => selectUser(user)}>{user.username}</p>
                        ))}
                        <button onClick={createGroup}>Submit</button>
                    </div>
                )}/>
                : null}
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps, {selectChat})(SideMenu);