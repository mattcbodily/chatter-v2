import React from 'react';
import {withRouter} from 'react-router-dom';
import Header from './Components/Header/Header';
import routes from './routes';
import './App.css';

function App(props) {
  return (
    <div className="App">
      {props.location.pathname !== '/'
      ? <Header />
      : null}
      {routes}
    </div>
  );
}

export default withRouter(App);
