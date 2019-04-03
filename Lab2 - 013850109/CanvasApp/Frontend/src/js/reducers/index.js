import { combineReducers } from 'redux';
import LoginReducer from "./LoginReducer";
import SignupReducer from './SignupReducer';
import ProfileReducer from './ProfileReducer';
import DashboardReducer from './DashboardReducer';
import CourseReducer from './CourseReducer';
import { reducer as formReducer } from "redux-form";


const rootReducer = combineReducers({
  login: LoginReducer,
  signup: SignupReducer,
  profile: ProfileReducer,
  dashboard: DashboardReducer,
  course: CourseReducer,
  form: formReducer
});

export default rootReducer;