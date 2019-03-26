import { LOGIN_AUTHORIZATION } from '../actions/index';


//Reducer listening to action types

export default function (state={}, action){

    switch(action.type){

        case LOGIN_AUTHORIZATION: 
            console.log('Login reducer', action.payload);
            return {
                ...state,
                result : action.payload
            }  
        default: 
            return state;


    }
}