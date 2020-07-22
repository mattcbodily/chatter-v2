import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import GroupModal from '../GroupModal/GroupModal';
import {selectChat} from '../../redux/reducer';
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
                    <Link 
                        key={group.group_id} 
                        to={`/chat/${group.group_id}`} 
                        onClick={() => this.handleChatSelect(+group.group_id)}><p>{group.group_name}</p></Link>
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