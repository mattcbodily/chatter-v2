import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import {loginUser} from '../../redux/reducer';
import logo from '../../assets/chatter-logo.png';
import './Landing.scss';

class Landing extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            verPassword: '',
            registerView: false
        }
    }

    componentDidMount(){
        if(this.props.user.email){
            this.props.history.push('/chat')
        }
    }

    handleInput = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    handleToggle = () => {
        this.setState(prevState => ({registerView: !prevState.registerView}))
    }

    handleLogin = () => {
        const {email, password} = this.state,
              {loginUser, history} = this.props;
        axios.post('/api/login', {email, password})
        .then(res => {
            loginUser(res.data);
            history.push('/chat/0');
        })
        .catch(err => console.log(err));
    }

    handleRegister = () => {
        const {username, email, password, verPassword} = this.state,
              {loginUser, history} = this.props;
        if(password && password === verPassword){
            axios.post('/api/register', {username, email, password})
            .then(res => {
                loginUser(res.data);
                history.push('/chat/5');
            })
            .catch(err => console.log(err));
        }
    }

    render(){
        const {username, email, password, verPassword, registerView} = this.state;
        return (
            <div className='landing'>
                <img className='logo' src={logo} alt='Chatter'/>
                <h1>Welcome to Chatter!</h1>
                {registerView
                ? <input value={username} name='username' onChange={e => this.handleInput(e)}/>
                : null}
                <input value={email} name='email' onChange={e => this.handleInput(e)}/>
                <input type='password' value={password} name='password' onChange={e => this.handleInput(e)}/>
                {registerView
                ? (
                    <>
                        <input type='password' value={verPassword} name='verPassword' onChange={e => this.handleInput(e)}/>
                        <button onClick={this.handleRegister}>Register</button>
                        <p>Already have an account? <span onClick={this.handleToggle}>Sign in here</span></p>
                    </>
                )
                : (
                    <>
                        <button onClick={this.handleLogin}>Log in</button>
                        <p>Don't have an account? <span onClick={this.handleToggle}>Register here</span></p>
                    </>
                )}
            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState;

export default connect(mapStateToProps, {loginUser})(Landing);