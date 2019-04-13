import axios from 'axios'
import {rooturl} from '../../config/settings';
export const GET_COURSE_HOME = "GET_COURSE_HOME";
export const GET_COURSE_HOME_ERROR = "GET_COURSE_HOME_ERROR";

export function getCourseHome(course_uid) {
    return async function (dispatch) {

        console.log('Inside Get Course Home action');
        axios.defaults.withCredentials = true;

        var result = {
            data:[]
        }
        
        var errorRedirect = false;
        console.log('jwt ' + localStorage.getItem('userToken'))
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
        
        await axios.get('http://' + rooturl + ':3001/course/' + course_uid)
            .then((response) => {
                result.data = response.data;
                console.log("In success return of get Course Home:"+result);
                console.log(result);
            })
            .catch((err) => {
                errorRedirect = true;
                dispatch({
                    type: GET_COURSE_HOME_ERROR,
                    payload: errorRedirect
                });

            });
        dispatch({
            type: GET_COURSE_HOME,
            payload: result
        });

    }
}