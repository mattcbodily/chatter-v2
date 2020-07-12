import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import './GroupModal.css';

class GroupModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            groupName: '',
            userInput: '',
            users: [],
            filteredUsers: []
        }
    }

    componentDidMount(){
        axios.get('/api/users')
        .then(res => this.setState({users: res.data}))
        .catch(err => console.log(err));
    }

    handleInput = (e) => {
        this.setState({[e.target.name]: e.target.value})
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
        const {groupName, userInput, filteredUsers} = this.state;
        return (
            <div className='group-modal'>
                <h3>Create a Group</h3>
                <input value={groupName} name='groupName' onChange={e => this.handleInput(e)}/>
                <label>Invite Someone</label>
                <input value={userInput} name='userInput' onChange={e => this.handleInput(e)}/>
                <button onClick={this.createGroup}>Submit</button>
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(GroupModal);