import { GET_COURSE_HOME, GET_COURSE_HOME_ERROR } from '../actions/CourseHomeAction';

var intialState = {
    errorRedirect : false
}


export default function(state = intialState, action){
    switch(action.type){
        case GET_COURSE_HOME:
            console.log('GET_COURSE_INFO Reducer');
            console.log("Payload: " + JSON.stringify(action.payload))
            return {
                ...state,
                result: action.payload
            }
        case GET_COURSE_HOME_ERROR:
            return {
                ...state,
                errorRedirect : action.payload
            }
        default: 
            return state;
    }
} 