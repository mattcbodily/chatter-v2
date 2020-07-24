import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import GroupModal from '../GroupModal/GroupModal';
import addUserIcon from '../../assets/user-plus.svg';
import settingIcon from '../../assets/settings.svg';
import './GroupDisplay.scss';

class GroupDisplay extends Component {
    constructor(props){
        super(props);
        this.state = {
            inviteView: false,
            settingView: false
        }
    }

    toggleInviteView = () => {
        if(this.state.settingView && !this.state.inviteView){
            this.setState({settingView: false})
        }
        this.setState(prevState => ({inviteView: !prevState.inviteView}))
    }

    toggleSettingView = () => {
        if(this.state.inviteView && !this.state.settingView){
            this.setState({inviteView: false})
        }
        this.setState(prevState => ({settingView: !prevState.settingView}))
    }

    deleteGroup = () => {
        const {group, getGroupFn} = this.props;

        axios.delete(`/api/group/${group.group_id}`)
        .then(() => getGroupFn())
        .catch(err => console.log(err));
    }

    render(){
        const {inviteView, settingView} = this.state,
              {group, selectChatFn, getGroupFn} = this.props;
        return (
            <div className='group-display-flex'>
                <section className='group-display'>
                    <Link 
                        to={`/chat/${group.group_id}`} 
                        className='chat-links'
                        onClick={() => selectChatFn(+group.group_id)}>{group.group_name}</Link>
                    <img src={addUserIcon} alt='Add User' onClick={this.toggleInviteView}/>
                    <img src={settingIcon} alt='Chat Settings' onClick={this.toggleSettingView}/>
                </section>
                {inviteView
                ? <GroupModal create={false} group={group} getGroupFn={getGroupFn} toggleFn={this.toggleInviteView} />
                : null}    
                {settingView
                ? (
                    <div className='setting-flex'>
                        <button className='edit-btn'>Edit Name</button>
                        <button className='delete-btn' onClick={this.deleteGroup}>Delete</button>
                    </div>
                )
                : null}
            </div>
        )
    }
}

export default GroupDisplay;