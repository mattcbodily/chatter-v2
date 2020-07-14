const initialState = {
    user: {}
}

const LOGIN_USER = 'LOGIN_USER',
      LOGOUT_USER = 'LOGOUT_USER';

export function loginUser(userObj){
    return {
        type: LOGIN_USER,
        payload: userObj
    }
}

export function logoutUser(){
    return {
        type: LOGOUT_USER,
        payload: {}
    }
}

export default function reducer(state = initialState, action){
    const {type, payload} = action;
    switch(type){
        case LOGIN_USER:
        case LOGOUT_USER:
            return {...state, user: payload};
        default:
            return state;
    }
}