import React, {Component} from 'react';
import './Chat.css';

class Chat extends Component {
    render(){
        return (
            <div className='chat'>
                <section className='send-message'>
                    <input />
                    <button>Send</button>
                </section>
            </div>
        )
    }
}

export default Chat;