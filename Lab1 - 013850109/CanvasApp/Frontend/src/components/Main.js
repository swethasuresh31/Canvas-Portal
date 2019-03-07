import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Login from './Login/Login';
import Account from './Account/Account';
import Courses from './Courses/Courses';
import CourseDetails from './Courses/CourseDetails';
import CourseHome from './Courses/CourseLanding';
import SearchCourse from './Courses/SearchCourse';
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
            </div>
        )
    }
}
//Export The Main Component
export default Main;