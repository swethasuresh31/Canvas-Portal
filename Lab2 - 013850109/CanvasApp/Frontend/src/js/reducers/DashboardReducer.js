import { GET_COURSE_DASHBOARD, GET_COURSE_DASHBOARD_ERROR } from '../actions/DashboardAction';

var intialState = {
    errorRedirect : false
}


export default function(state = intialState, action){
    switch(action.type){
        case GET_COURSE_DASHBOARD:
            console.log('GET_COURSE_DASHBOARD Reducer');
            console.log("Payload: " + JSON.stringify(action.payload))
            return {
                ...state,
                result: action.payload
            }
        case GET_COURSE_DASHBOARD_ERROR:
            return {
                ...state,
                errorRedirect : action.payload
            }
        default: 
            return state;
    }
} 