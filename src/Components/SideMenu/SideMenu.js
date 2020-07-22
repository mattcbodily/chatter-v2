import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import GroupModal from '../GroupModal/GroupModal';
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

    render(){
        const {modalView} = this.state,
              {chatGroups, getGroupFn} = this.props;

        return (
            <div className='side-menu'>
                {chatGroups.length
                ? chatGroups.map(group => (
                    <Link key={group.group_id} to={`/chat/${group.group_id}`} onClick={this.props.toggleFn}><p>{group.group_name}</p></Link>
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

export default connect(mapStateToProps)(SideMenu);