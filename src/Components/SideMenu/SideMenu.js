import React, {Component} from 'react';
import {connect} from 'react-redux';
import GroupDisplay from '../GroupDisplay/GroupDisplay';
import GroupModal from '../GroupModal/GroupModal';
import {selectChat} from '../../redux/reducer';
import './SideMenu.scss';

class SideMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            createModalView: false
        }
    }

    createModalToggle = () => {
        this.setState(prevState => ({createModalView: !prevState.createModalView}))
    }

    handleChatSelect = (id) => {
        const {toggleFn, selectChat} = this.props;

        selectChat(id);
        toggleFn();
    }

    render(){
        const {createModalView} = this.state,
              {chatGroups, getGroupFn} = this.props;

        return (
            <div className='side-menu'>
                <div className='modal-backdrop'></div>
                    {chatGroups.length
                    ? chatGroups.map(group => (
                        <GroupDisplay 
                            key={group.group_id} 
                            group={group} 
                            selectChatFn={this.handleChatSelect}
                            getGroupFn={getGroupFn}/>
                    ))
                    : (
                        <>
                            <p>You don't have any groups!</p>
                        </>
                    )}
                    <button className='create-btn' onClick={this.createModalToggle}>Create a Group</button>
                    {createModalView
                    ? <GroupModal create={true} getGroupFn={getGroupFn} toggleFn={this.createModalToggle} />
                    : null}
                </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps, {selectChat})(SideMenu);