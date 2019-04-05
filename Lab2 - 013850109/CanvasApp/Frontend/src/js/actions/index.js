import axios from "axios";
export const LOGIN_AUTHORIZATION = "LOGIN_AUTHORIZATION";
export const SIGNUP = "SIGNUP";
export const SIGNUP_USER_ALREADY_PRESENT = "SIGN_USER_ALREADY_PRESENT";


//login post call for login authorization
export function submitLogin(data) {
  return function (dispatch) {
      console.log('Inside Login');
      axios.defaults.withCredentials = true;
      axios.post('http://localhost:3001/login', data)
          .then(response => {
              console.log(response);
              if (response.status === 200) {
                localStorage.setItem('userToken', response.data.token)
                localStorage.setItem('user',response.data.emailId);
                localStorage.setItem('role',response.data.role);
                localStorage.setItem('name',response.data.name);

                  var resultData = {
                      emailId : response.data.emailId,
                      role : response.data.role,
                      authFlag : true
                  }
                  console.log('Result in action: ', resultData)
                  dispatch({
                      type: LOGIN_AUTHORIZATION,
                      payload: resultData
                  });

              }                               
          })
          .catch((err) => {
              if (err) {
                 // if (err.response.status === 401) {
                  var resultData = {
                    authFlag : false
                  }
                     console.log(err);
                      console.log('Login authentication error', err);
                      dispatch({
                          type: LOGIN_AUTHORIZATION,
                          payload: resultData
                      });                        
                  //}
              }

          });
  }
}


export function signup(data) {
    return function (dispatch) {
        console.log('Inside Signup');
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/signup', data)
            .then(response => {
                console.log('response', response.data);
                if (response.status === 200) {
                    var resultData = {
                        newUser: true
                    }

                    dispatch({
                        type: SIGNUP,
                        payload: resultData
                    });
                }
                if(response.status === 210){
                    console.log('Username already exists');
                    dispatch({
                        type: SIGNUP_USER_ALREADY_PRESENT                       
                    });
                } 
            })
            .catch((err) => {
                console.log('Error Occured!');
                var result = {
                    errorRedirect: true
                }

                dispatch({
                    type: SIGNUP,
                    payload: result
                });
            });

    }
}
