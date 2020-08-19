import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
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
        this.getEmojis();
    }

    //Currently working on fixing a bug where emojis from groups remain even when switching groups

    // componentDidUpdate(prevProps){
    //     if(+prevProps.match.params.id !== +this.props.match.params.id){
    //         console.log('hit')
    //         this.setState({
    //             reactions: [],
    //             reactionCounts: []
    //         })
    //         this.getEmojis();
    //     }
    // }

    getEmojis = () => {
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
            if(!reactionNames.includes(reactions[i].colons)){
                reactionNames.push(reactions[i].colons);
                countArr.push({colons: reactions[i].colons, count: 1, senders: [reactions[i].sender_id]})
            } else {
                let reactionCopy = countArr.find(e => e.colons === reactions[i].colons);
                reactionCopy.count += 1;
                reactionCopy.senders.push(reactions[i].sender_id);
            }
        }

        this.setState({reactionCounts: countArr})
    }

    addEmoji = (e) => {
        const {reactionCounts} = this.state,
              {socket, user, match} = this.props,
              {message_id} = this.props.message,
              reaction = reactionCounts.find(emojiObj => emojiObj.colons === e.colons);

        if(reaction && reaction.senders.includes(user.user_id)){
            socket.emit('delete emoji', {
                colons: e.colons,
                sender: user.user_id,
                group: +match.params.id
            })
            reaction.count -= 1;
            this.setState({showPicker: false});
            this.getEmojis();
        } else {
            socket.emit('emoji react', {
                message_id,
                colons: e.colons,
                sender: user.user_id,
                group: +match.params.id
            })
            this.setState({showPicker: false});
            this.getEmojis();
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
        const {reactionCounts, showOptions, editMessage, showPicker, messageInput} = this.state,
              {message} = this.props;
              console.log(this.props.match.params.id)

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
                        {showPicker
                        ? <Picker onSelect={e => this.addEmoji(e)}/>
                        : null}
                        <div className={`message-options ${showOptions}`}>
                            <img src={smileIcon} alt='Emoji React' onClick={() => this.setState(prevState => ({showPicker: !prevState.showPicker}))}/>
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
                {reactionCounts.length
                ? (
                    <div className='emoji-flex'>
                        {reactionCounts.map((reaction, i) => (
                        <div key={i} className={`emoji-container ${reaction.senders.includes(this.props.user.user_id) ? 'user-reacted' : null}`} onClick={() => this.addEmoji(reaction)}>
                            <Emoji emoji={reaction.colons} size={18}/>
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

const mapStateToProps = reduxState => reduxState;

export default withRouter(connect(mapStateToProps)(MessageDisplay));