const initialState = {
    user: {},
    selectedChat: 0
}

const LOGIN_USER = 'LOGIN_USER',
      LOGOUT_USER = 'LOGOUT_USER',
      SELECT_CHAT = 'SELECT_CHAT';

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

export function selectChat(chatId){
    return {
        type: SELECT_CHAT,
        payload: chatId
    }
}

export default function reducer(state = initialState, action){
    const {type, payload} = action;
    switch(type){
        case LOGIN_USER:
        case LOGOUT_USER:
            return {...state, user: payload};
        case SELECT_CHAT:
            return {...state, selectedChat: payload}
        default:
            return state;
    }
}