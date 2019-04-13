import axios from 'axios'
import {rooturl} from '../../config/settings';
export const GET_COURSE_DASHBOARD = "GET_COURSE_DASHBOARD";
export const GET_COURSE_DASHBOARD_ERROR = "GET_COURSE_DASHBOARD_ERROR";

export function getDashboardInformation() {
    return async function (dispatch) {

        console.log('Inside Get Course Dashboard action');
        axios.defaults.withCredentials = true;

        var result = {
            data:[]
        }
        
        var errorRedirect = false;
        console.log('jwt ' + localStorage.getItem('userToken'))
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
        console.log('User: '+localStorage.getItem('user')+' Role: '+localStorage.getItem('role'));
        
        await axios.get('http://' + rooturl + ':3001/usercourse/' + encodeURI(localStorage.getItem('user')) + '?role=' + localStorage.getItem('role'))
            .then((response) => {
                result.data = Array.from(response.data);
                console.log("In success return of get dashboard:"+result);
                console.log(result);
            })
            .catch((err) => {
                errorRedirect = true;
                dispatch({
                    type: GET_COURSE_DASHBOARD_ERROR,
                    payload: errorRedirect
                });

            });
        dispatch({
            type: GET_COURSE_DASHBOARD,
            payload: result
        });

    }
}