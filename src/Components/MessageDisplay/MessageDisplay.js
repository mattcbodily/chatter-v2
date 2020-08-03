import React, {Component} from 'react';
import axios from 'axios';
import {Picker} from 'emoji-mart';
import editIcon from '../../assets/edit-2.svg';
import deleteIcon from '../../assets/trash-2.svg';
import 'emoji-mart/css/emoji-mart.css'
import './MessageDisplay.scss';

class MessageDisplay extends Component {
    constructor(props){
        super(props);
        this.state = {
            showOptions: 'hidden',
            editMessage: false,
            showPicker: false,
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

    addEmoji = (e) => {
        const {message_id} = this.props.message;

        this.props.emojiFn(message_id, e);
        this.setState({showPicker: false});
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
        const {showOptions, editMessage, showPicker, messageInput} = this.state,
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
                        <button onClick={() => this.setState({showPicker: true})}>Show Emoji</button>
                        {showPicker
                        ? <Picker onSelect={e => this.addEmoji(e)}/>
                        : null}
                        <div className={`message-options ${showOptions}`}>
                            <img src={editIcon} alt='Edit Message' onClick={this.handleToggle}/>
                            <img src={deleteIcon} alt='Delete Message' onClick={this.deleteMessage}/>
                        </div>
                    </div>
                )
                : (
                    <div className='message'>
                        <input value={messageInput} onChange={e => this.handleInput(e.target.value)}/>
                        <button onClick={this.handleEdit}>Submit</button>
                        <button onClick={this.handleToggle}>Cancel</button>
                    </div>
                )}
                
            </div>
        )
    }
}

export default MessageDisplay;