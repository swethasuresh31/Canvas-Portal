import { GET_PROFILE_INFO, GET_PROFILE_INFO_ERROR, UPDATE_PROFILE_INFO,  UPDATE_PROFILE_INFO_ERROR } from '../actions/ProfileAction';

var intialState = {
    errorRedirect : false
}


export default function(state = intialState, action){
    switch(action.type){
        case GET_PROFILE_INFO:
            console.log('GET_PROFILE_INFO Reducer');
            console.log("Payload: " + JSON.stringify(action.payload))
            return {
                ...state,
                result: action.payload
            }
        case GET_PROFILE_INFO_ERROR:
            return {
                ...state,
                errorRedirect : action.payload
            }
        case UPDATE_PROFILE_INFO:
            console.log('UPDATE PROFILE INFO Reducer..');
            return {
                ...state
            }
        case UPDATE_PROFILE_INFO_ERROR:
            console.log('UPDATE_PROFILE_INFO_ERROR', action.payload);
            return{                
                ...state,
                errorRedirect : action.payload
            }
        default: 
            return state;
    }
} 