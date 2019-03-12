import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Login from './Login/Login';
import Account from './Account/Account';
import Courses from './Courses/Courses';
import UserCourseHome from './Courses/CourseModules/UserCourseHome';
import UserCourseAssignments from './Courses/CourseModules/UserCourseAssignments';
import UserCourseAnnouncements from './Courses/CourseModules/Announcements/UserCourseAnnouncements';
import AddAnnouncement from './Courses/CourseModules/Announcements/AddAnnouncement';
import ShowAnnouncement from './Courses/CourseModules/Announcements/ShowAnnouncement';
import UserCourseGrades from './Courses/CourseModules/UserCourseGrades';
import UserCoursePeople from './Courses/CourseModules/UserCoursePeople';
import UserCourseFiles from './Courses/CourseModules/UserCourseFiles';
import UserCourseQuizzes from './Courses/CourseModules/UserCourseQuizzes';
import CourseHome from './Courses/CourseLanding';
import CourseStudent from './Courses/StudentCourseLanding';
import CourseFaculty from './Courses/FacultyCourseLanding';
import AddCourse from './Courses/AddCourse';
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
                <Route path="/enrollCourse" exact component={AddCourse} />
                <Route path="/searchCourse" exact component={SearchCourse} />
                <Route path="/createCourse" exact component={CreateCourse} />
                <Route path="/facultyCourse" exact component={CourseFaculty} />
                <Route path="/studentCourse" exact component={CourseStudent} />
                <Route path="/generatePermissionCode" exact component={GeneratePermission} />
                <Route path="/coursedetails/:courseUid" exact component={UserCourseHome} />
                <Route path="/coursedetails/:courseUid/home" exact component={UserCourseHome} />
                <Route path="/coursedetails/:courseUid/assignments" exact component={UserCourseAssignments} />
                <Route path="/coursedetails/:courseUid/announcements" exact component={UserCourseAnnouncements} />
                <Route path="/coursedetails/:courseUid/announcement/:announcementUid" exact component={ShowAnnouncement} />
                <Route path="/coursedetails/:courseUid/announcements/add" exact component={AddAnnouncement} />
                <Route path="/coursedetails/:courseUid/grades" exact component={UserCourseGrades} />
                <Route path="/coursedetails/:courseUid/people" exact component={UserCoursePeople} />
                <Route path="/coursedetails/:courseUid/files" exact component={UserCourseFiles} />
                <Route path="/coursedetails/:courseUid/quizzes" exact component={UserCourseQuizzes} />
            </div>
        )
    }
}
//Export The Main Component
export default Main;