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
    }

    componentDidMount(){
        this.socket = io('http://localhost:3333');
        this.socket.on('room joined', data => {
            this.joinSuccess(data)
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

    joinRoom = async() => {
        this.socket.emit('join room', {
            group: +this.props.match.params.id
        })
    }

    joinSuccess(messages) {
        this.setState({
          messages
        })
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
    }

    render(){
        const {messageInput, messages} = this.state,
              {id} = this.props.match.params;
    
        return (
            <div className='chat'>
                {id === 0
                ? (
                    <>
                        <p>Select or create a group to start chatting!</p>
                    </>
                )
                : messages.sort((a,b) => a.message_id - b.message_id).map((message, i) => (
                    <MessageDisplay key={i} message={message} group={id} updateFn={this.updateMessages}/>
                ))}
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