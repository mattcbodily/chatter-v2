import React, {Component} from 'react';
import {connect} from 'react-redux';
import io from 'socket.io-client';
import MessageDisplay from '../MessageDisplay/MessageDisplay';
import './Chat.scss';

class Chat extends Component {
    constructor(props){
        super(props);
        this.state = {
            messages: [],
            messageInput: ''
        }
        this.messageEnd = React.createRef();
    }


    componentDidMount(){
        if(!this.props.user.user_id){
            this.props.history.push('/');
        }

        this.socket = io();
        this.socket.on('room joined', data => {
            this.joinSuccess(data);
        })
        this.socket.on('reaction added', data => {
            this.updateMessages(data);
        })
        this.socket.on('reaction deleted', data => {
            this.updateMessages(data);
        })
        this.socket.on('message dispatched', data => {
            this.updateMessages(data);
        })
        this.joinRoom();
    }

    componentDidUpdate(prevProps){
        if(prevProps.match.params.id !== this.props.match.params.id){
            this.joinRoom();
        }
    }

    componentWillUnmount(){
        this.socket.disconnect()
    }

    scrollToBottom = () => {
        this.messageEnd.current.scrollIntoView();
    }

    joinRoom = async() => {
        this.socket.emit('join room', {
            group: +this.props.match.params.id
        })
    }

    joinSuccess(messages) {
        this.setState({
          messages
        })
        this.scrollToBottom();
    }

    handleInput = (val) => {
        this.setState({messageInput: val})
    }

    sendMessage = () => {
        this.socket.emit('message sent', {
          message: this.state.messageInput,
          sender: this.props.user.user_id,
          group: +this.props.match.params.id
        })

        this.setState({messageInput: ''})
    }

    updateMessages = (messages) => {
        this.setState({
          messages
        })
        this.scrollToBottom();
    }

    render(){
        const {messageInput, messages} = this.state,
              {id} = +this.props.match.params;
    
        return (
            <div className='chat'>
                    {id === 0
                    ? (
                        <>
                            <p>Select or create a group to start chatting!</p>
                        </>
                    )
                    : (
                        <div className='message-container'>
                            {messages.sort((a,b) => a.message_id - b.message_id).map((message, i) => (
                                <MessageDisplay key={message.message_id} message={message} updateFn={this.updateMessages} emojiFn={this.addEmoji} socket={this.socket}/>
                            ))}
                            <div ref={this.messageEnd}/>
                        </div>
                    )}
                <section className='send-message'>
                    <input value={messageInput} onChange={e => this.handleInput(e.target.value)}/>
                    <button onClick={this.sendMessage}>Send</button>
                </section>
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps)(Chat);