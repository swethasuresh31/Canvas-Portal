import { combineReducers } from 'redux';
import LoginReducer from "./LoginReducer";
import SignupReducer from './SignupReducer';
import ProfileReducer from './ProfileReducer';
import DashboardReducer from './DashboardReducer';
import CourseReducer from './CourseReducer';
import CourseHomeReducer from './CourseHomeReducer';
import SearchCourseReducer from './SearchCourseReducer';
import { reducer as formReducer } from "redux-form";


const rootReducer = combineReducers({
  login: LoginReducer,
  signup: SignupReducer,
  profile: ProfileReducer,
  dashboard: DashboardReducer,
  course: CourseReducer,
  courseHome: CourseHomeReducer,
  searchCourse: SearchCourseReducer,
  form: formReducer
});

export default rootReducer;