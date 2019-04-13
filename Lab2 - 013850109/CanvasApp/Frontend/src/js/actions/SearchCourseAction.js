import axios from 'axios'
import {rooturl} from '../../config/settings';
export const SEARCH_COURSE = "SEARCH_COURSE";
export const SEARCH_COURSE_ERROR = "SEARCH_COURSE_ERROR";

export function searchCourse(data) {
    return async function (dispatch) {

        console.log('Inside Search Course action');
        axios.defaults.withCredentials = true;

        var result = {
            data:[]
        }
        
        var errorRedirect = false;
        console.log('jwt ' + localStorage.getItem('userToken'))
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
        
        await axios.get('http://' + rooturl + ':3001/course?term=' + data.term + '&name=' + data.name + '&department=' +
            data.department + '&courseId=' + data.courseId + '&operator=' + data.operator)
            .then((response) => {
                result.data = response.data;
                console.log("In success return of get Course Home:"+result);
                console.log(result);
            })
            .catch((err) => {
                errorRedirect = true;
                dispatch({
                    type: SEARCH_COURSE_ERROR,
                    payload: errorRedirect
                });

            });
        dispatch({
            type: SEARCH_COURSE,
            payload: result
        });

    }
}