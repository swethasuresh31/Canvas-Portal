import { SEARCH_COURSE, SEARCH_COURSE_ERROR } from '../actions/SearchCourseAction';

var intialState = {
    errorRedirect : false
}


export default function(state = intialState, action){
    switch(action.type){
        case SEARCH_COURSE:
            console.log('SEARCH_COURSE Reducer');
            console.log("Payload: " + JSON.stringify(action.payload))
            return {
                ...state,
                result: action.payload
            }
        case SEARCH_COURSE_ERROR:
            return {
                ...state,
                errorRedirect : action.payload
            }
        default: 
            return state;
    }
} 