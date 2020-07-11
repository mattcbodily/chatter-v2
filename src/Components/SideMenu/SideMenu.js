import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import axios from 'axios';
import './SideMenu.css';

class SideMenu extends Component {
    constructor(props){
        super(props);
        this.state = {
            chatGroups: []
        }
    }

    componentDidMount(){
        const {user} = this.props;
        axios.get(`/api/groups/${user.user_id}`)
        .then(res => {
            this.setState({chatGroups: res.data});
        })
        .catch(err => console.log(err))
    }

    render(){
        const {chatGroups} = this.state;
        return (
            <div className='side-menu'>
                {chatGroups.length
                ? chatGroups.map(group => (
                    <Link key={group.group_id} to={`/chat/${group.group_id}`}><p>{group.group_name}</p></Link>
                ))
                : (
                    <>
                        <p>You don't have any groups!</p>
                    </>
                )}
                <button>Create a Group</button>
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(SideMenu);