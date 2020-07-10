import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Landing from './Components/Landing/Landing';
import Chat from './Components/Chat/Chat';

export default (
    <Switch>
        <Route exact path='/' component={Landing} />
        <Route path='/chat' component={Chat} />
    </Switch>
)