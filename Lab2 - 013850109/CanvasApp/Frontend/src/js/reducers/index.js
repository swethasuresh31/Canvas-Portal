import { combineReducers } from 'redux';
import LoginReducer from "./LoginReducer";
import SignupReducer from './SignupReducer';
import { reducer as formReducer } from "redux-form";


const rootReducer = combineReducers({
  login: LoginReducer,
  signup: SignupReducer,
  form: formReducer
});

export default rootReducer;