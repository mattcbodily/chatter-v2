import React, {Component} from 'react';
import axios from 'axios';
import {Picker, Emoji} from 'emoji-mart';
import editIcon from '../../assets/edit-2.svg';
import deleteIcon from '../../assets/trash-2.svg';
import smileIcon from '../../assets/smile.svg';
import plusIcon from '../../assets/plus.svg';
import 'emoji-mart/css/emoji-mart.css'
import './MessageDisplay.scss';

class MessageDisplay extends Component {
    constructor(props){
        super(props);
        this.state = {
            reactions: [],
            reactionCounts: [],
            showOptions: 'hidden',
            editMessage: false,
            showPicker: false,
            messageInput: this.props.message.message
        }
    }

    componentDidMount(){
        axios.get(`/api/message-reaction/${this.props.message.message_id}`)
        .then(res => {
            this.setState({reactions: res.data})
            if(res.data.length){
                this.sortEmoji();
            }
        })
        .catch(err => console.log(err));
    }

    sortEmoji = () => {
        const {reactions} = this.state,
              reactionNames = [],
              countArr = [];

        for(let i = 0; i < reactions.length; i++){
            if(!reactionNames.includes(reactions[i].reaction)){
                reactionNames.push(reactions[i].reaction);
                countArr.push({reaction: reactions[i].reaction, count: 1})
            } else {
                let reactionCopy = countArr.find(e => e.reaction === reactions[i].reaction);
                reactionCopy.count += 1;
            }
        }

        this.setState({reactionCounts: countArr})
    }

    addEmoji = (e) => {
        const {message_id} = this.props.message;

        this.props.socket.emit('emoji react', {
            message_id,
            reaction: e.colons,
            group: this.props.group
        })
        this.setState({showPicker: false});
        this.sortEmoji();
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
        const {reactionCounts, showOptions, editMessage, showPicker, messageInput} = this.state,
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
                        <div className='add-emoji-box' onClick={() => this.setState(prevState => ({showPicker: !prevState.showPicker}))}>
                            <img src={smileIcon} alt='add emoji part one'/>
                            <img src={plusIcon} alt='add emoji part two'/>
                        </div>
                        {showPicker
                        ? <Picker onSelect={e => this.addEmoji(e)}/>
                        : null}
                        <div className={`message-options ${showOptions}`}>
                            <img src={editIcon} alt='Edit Message' onClick={this.handleToggle}/>
                            <img src={deleteIcon} alt='Delete Message' onClick={this.deleteMessage}/>
                        </div>
                        {}
                    </div>
                )
                : (
                    <div className='message'>
                        <input value={messageInput} onChange={e => this.handleInput(e.target.value)}/>
                        <button onClick={this.handleEdit}>Submit</button>
                        <button onClick={this.handleToggle}>Cancel</button>
                    </div>
                )}
                {reactionCounts.length
                ? (
                    <div className='emoji-flex'>
                        {reactionCounts.map((reaction, i) => (
                        <div  key={i} className='emoji-container'>
                            <Emoji emoji={reaction.reaction} size={18}/>
                            <p>{reaction.count}</p>
                        </div>
                        ))}
                    </div>
                )
                : null}
            </div>
        )
    }
}

export default MessageDisplay;