const initialState = {
    user: {}
}

const LOGIN_USER = 'LOGIN_USER';

export function loginUser(userObj){
    return {
        type: LOGIN_USER,
        payload: userObj
    }
}

export default function reducer(state = initialState, action){
    const {type, payload} = action;
    switch(type){
        case LOGIN_USER:
            return {...state, user: payload};
        default:
            return state;
    }
}