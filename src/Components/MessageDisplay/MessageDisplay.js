import React, {Component} from 'react';
import axios from 'axios';
import editIcon from '../../assets/edit-2.svg';
import deleteIcon from '../../assets/trash-2.svg';
import './MessageDisplay.scss';

class MessageDisplay extends Component {
    constructor(props){
        super(props);
        this.state = {
            showOptions: 'hidden',
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

    optionsToggle = () => {
        if(this.state.showOptions === 'hidden'){
            this.setState({showOptions: 'show'})
        } else {
            this.setState({showOptions: 'hidden'})
        }
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

    deleteMessage = () => {
        const {message, group, updateFn} = this.props;

        axios.delete(`/api/message/${message.message_id}/${group}`)
        .then(res => {
            updateFn(res.data);
        })
        .catch(err => console.log(err));
    }

    render(){
        const {showOptions, editMessage, messageInput} = this.state,
              {message} = this.props;
        return (
            <div>
                {!editMessage
                ? (
                    <div className='message' onMouseEnter={this.optionsToggle} onMouseLeave={this.optionsToggle}>
                        <img className='sender-avatar' src={message.profile_picture} alt='Message Sender'/>
                        <section>
                            <p className='sender'>{message.username}</p>
                            <p className='message-text'>{message.message}</p>
                        </section>
                        <div className={`message-options ${showOptions}`}>
                            <img src={editIcon} alt='Edit Message'/>
                            <img src={deleteIcon} alt='Delete Message' onClick={this.deleteMessage}/>
                        </div>
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