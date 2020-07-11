import React, {Component} from 'react';
import {connect, ReactReduxContext} from 'react-redux';
import axios from 'axios';

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

    }

    render(){
        const {groupName} = this.state;
        return (
            <div>
                <label>Group Name</label>
                <input value={groupName} onChange={e => this.handleInput(e.target.value)}/>
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(GroupModal);