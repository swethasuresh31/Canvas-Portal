import { GET_COURSE_INFO, GET_COURSE_INFO_ERROR } from '../actions/CourseAction';

var intialState = {
    errorRedirect : false
}


export default function(state = intialState, action){
    switch(action.type){
        case GET_COURSE_INFO:
            console.log('GET_COURSE_INFO Reducer');
            console.log("Payload: " + JSON.stringify(action.payload))
            return {
                ...state,
                result: action.payload
            }
        case GET_COURSE_INFO_ERROR:
            return {
                ...state,
                errorRedirect : action.payload
            }
        default: 
            return state;
    }
} 