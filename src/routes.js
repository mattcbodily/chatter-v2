import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Landing from './Components/Landing/Landing';
import Chat from './Components/Chat/Chat';
import Profile from './Components/Profile/Profile';

export default (
    <Switch>
        <Route exact path='/' component={Landing} />
        <Route path='/chat/:id' component={Chat} />
        <Route path='/profile' component={Profile} />
    </Switch>
)