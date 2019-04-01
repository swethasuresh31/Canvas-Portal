import { combineReducers } from 'redux';
import LoginReducer from "./LoginReducer";
import SignupReducer from './SignupReducer';
import ProfileReducer from './ProfileReducer';
import { reducer as formReducer } from "redux-form";


const rootReducer = combineReducers({
  login: LoginReducer,
  signup: SignupReducer,
  profile: ProfileReducer,
  form: formReducer
});

export default rootReducer;