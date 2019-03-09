import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Login from './Login/Login';
import Account from './Account/Account';
import Courses from './Courses/Courses';
import CourseDetails from './Courses/CourseDetails';
import CourseHome from './Courses/CourseLanding';
import CourseStudent from './Courses/StudentCourseLanding';
import CourseFaculty from './Courses/FacultyCourseLanding';
import SearchCourse from './Courses/SearchCourse';
import CreateCourse from './Courses/CreateCourse';
import GeneratePermission from './Courses/GeneratePermission';
import Signup from './Signup/Signup';

import Dashboard from './Dashboard/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

//Create a Main Component
class Main extends Component {
    render() {
        return (
            <div>
                {/*Render Different Component based on Route*/}

                <Route path="/" exact component={Dashboard} />
                <Route path="/account" exact component={Account} />
                <Route path="/courses" exact component={Courses} />
                <Route path="/coursehome" exact component={CourseHome} />
                <Route path="/login" exact component={Login} />
                <Route path="/signup" exact component={Signup} />
                <Route path="/searchCourse" exact component={SearchCourse} />
                <Route path="/createCourse" exact component={CreateCourse} />
                <Route path="/facultyCourse" exact component={CourseFaculty} />
                <Route path="/studentCourse" exact component={CourseStudent} />
                <Route path="/generatePermissionCode" exact component={GeneratePermission} />
            </div>
        )
    }
}
//Export The Main Component
export default Main;