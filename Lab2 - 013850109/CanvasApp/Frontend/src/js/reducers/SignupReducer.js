import { SIGNUP } from '../actions/index';
import {SIGNUP_USER_ALREADY_PRESENT} from '../actions/index';

var initialState = {
    existingUser :false
}

export default function (state = initialState, action) {

    switch (action.type) {
        case SIGNUP:
            console.log('Inside Reducer', action.payload);
            return {
                ...state,
                result: action.payload
            }
        case SIGNUP_USER_ALREADY_PRESENT:
            console.log('Inside reducer SIGNUP_USER_ALREADY_PRESENT');
            return{
                ...state,
                existingUser : true
            }        
        
        default:
            return state;
    }
}