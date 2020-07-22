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
            modalView: false
        }
    }

    handleToggle = () => {
        this.setState(prevState => ({modalView: !prevState.modalView}))
    }

    handleChatSelect = (id) => {
        const {toggleFn, selectChat} = this.props;

        selectChat(id);
        toggleFn();
    }

    render(){
        const {modalView} = this.state,
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
                        <img src={addUserIcon} alt='Add User'/>
                        <img src={settingIcon} alt='Chat Settings'/>
                    </section>
                ))
                : (
                    <>
                        <p>You don't have any groups!</p>
                    </>
                )}
                <button onClick={this.handleToggle}>Create a Group</button>
                {modalView
                ? <GroupModal getGroupFn={getGroupFn} modalFn={this.handleToggle}/>
                : null}
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps, {selectChat})(SideMenu);