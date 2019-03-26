import axios from "axios";
export const GET_PROFILE_INFO = "GET_PROFILE_INFO";
export const GET_PROFILE_INFO_ERROR = "GET_PROFILE_INFO_ERROR";
export const UPDATE_PROFILE_INFO = "GET_PROFILE_INFO";
export const UPDATE_PROFILE_INFO_ERROR = "GET_PROFILE_INFO_ERROR";

export function getProfileInformation() {
    return async function (dispatch) {

        console.log('Inside Get Profile Information action');
        axios.defaults.withCredentials = true;

        var result = {
            data: {}
        }
        
        var errorRedirect = false;
        console.log('jwt ' + localStorage.getItem('userToken'))
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
        await axios.get('http://localhost:3001/user/')
            .then((response) => {
                console.log("came here")
                result.data = response.data;
                result.data.img = "http://localhost:3001/img/" + encodeURI(response.data.emailId);
                console.log("in return of get");

            })
            .catch((err) => {
                errorRedirect = true;
                dispatch({
                    type: GET_PROFILE_INFO_ERROR,
                    payload: errorRedirect
                });

            });
        dispatch({
            type: GET_PROFILE_INFO,
            payload: result
        });

    }
}

export function updateProfileInformation(data){
    return async function(dispatch){
        console.log('Inside Update Profile Information action');

        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
        await axios.post('http://localhost:3001/account', data)
            .then(response => {
                if (response.status === 200) {
                    var resultData={
                        isEditing:"false"
                    }
                    dispatch({
                         type: UPDATE_PROFILE_INFO,
                         payload: resultData                         
                    });
                }
            })
            .catch((err) =>{
                if(err){
                    var errorRedirect = true;
                    console.log('in update catch');
                    dispatch({
                        type: UPDATE_PROFILE_INFO_ERROR,
                        payload: errorRedirect                       
                   });
                }
            });
    }
}

