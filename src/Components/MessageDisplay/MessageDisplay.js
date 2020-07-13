import React, {Component} from 'react';
import axios from 'axios';
import './MessageDisplay.css';

class MessageDisplay extends Component {
    constructor(props){
        super(props);
        this.state = {
            editMessage: false,
            messageInput: this.props.message.message
        }
    }

    handleInput = (val) => {
        this.setState({messageInput: val})
    }

    handleToggle = () => {
        this.setState(prevState => ({editMessage: !prevState.editMessage}));
    }

    handleEdit = () => {
        const {messageInput} = this.state,
              {message, group, updateFn} = this.props;
        axios.put('/api/message', {messageId: message.message_id, messageInput, group})
        .then(res => {
            updateFn(res.data);
            this.handleToggle();

        })
        .catch(err => console.log(err))
    }

    render(){
        const {editMessage, messageInput} = this.state,
              {message} = this.props;
        return (
            <div>
                {!editMessage
                ? (
                    <div>
                        <p className='message'>{message.message}</p>
                        <button onClick={this.handleToggle}>Edit</button>
                    </div>
                )
                : (
                    <>
                        <input value={messageInput} onChange={e => this.handleInput(e.target.value)}/>
                        <button onClick={this.handleEdit}>Submit</button>
                    </>
                )}
                
            </div>
        )
    }
}

export default MessageDisplay;