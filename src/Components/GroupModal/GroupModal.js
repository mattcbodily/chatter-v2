import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import './GroupModal.css';

class GroupModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            groupName: ''
        }
    }

    handleInput = (val) => {
        this.setState({groupName: val})
    }

    createGroup = () => {
        const {groupName} = this.state,
              {user, getGroupFn, modalFn} = this.props;
        axios.post('/api/group', {groupName, user_id: user.user_id})
        .then(res => {
            getGroupFn();
            this.setState({groupName: ''});
            modalFn();
        })
        .catch(err => console.log(err));
    }

    render(){
        const {groupName} = this.state;
        return (
            <div className='group-modal'>
                <h3>Create a Group</h3>
                <input value={groupName} onChange={e => this.handleInput(e.target.value)}/>
                <button onClick={this.createGroup}>Submit</button>
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(GroupModal);