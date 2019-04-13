import React, { Component } from 'react';
import Navbar from '../../../LandingPage/Navbar';
import CourseNav from '../CourseNav';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import styled from "styled-components";
import { Breadcrumb, BreadcrumbLink } from '@instructure/ui-breadcrumb'
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import StudentGradeLanding from './StudentGradeLanding';
import FacultyGradeLanding from './FacultyGradeLanding';

import { getCourseHome } from '../../../../js/actions/CourseHomeAction';
import { connect } from 'react-redux';


import {
    AppContainer as BaseAppContainer,
    ExampleNavigation as Navigation,
    ExampleBody as Body
} from "../CourseNavStyle.js";

const AppContainer = styled(BaseAppContainer)`
  height: calc(100vh - 40px);
  padding:20px;
`;

const themeCourse = {
    hoverBgColor: "#f5f5f5",
    selectionBgColor: "#f5f5f5",
    selectionIconColor: "#03A9F4"
};


const cookies = new Cookies();

class UserCourseGrades extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            people: [],
            course: ''
        };
    }

    async componentWillMount() {
        await this.props.getCourseHome(this.props.match.params.courseUid);
            console.log("course: " + this.props.courseHomeStateStore.result.data)   
            const result = this.props.courseHomeStateStore.result.data;
            this.setState({
                course: result,
            })
    }

    render() {
        let redirectVar = null;
        let homePath = "/coursedetails/" + this.state.course._id + "/home";
        let courseName = this.state.course.course_term + ': ' + this.state.course.course_dept_code + ' - ' + this.state.course.course_id + ' - ' + this.state.course.course_name
        if (localStorage.role === 'faculty') {
            return (
                <div className="container-fluid md-0 p-0">
                    {redirectVar}
                    <div className="row">
                        <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                            <Navbar selected="courses" />
                        </div>
                        <div className="col">
                            <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">
                                <Breadcrumb size="large">
                                    <BreadcrumbLink href={homePath}>{courseName}</BreadcrumbLink>
                                    <BreadcrumbLink>Grades</BreadcrumbLink>
                                </Breadcrumb>
                            </Heading>
                            <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="grades" />
                                </div>
                                <FacultyGradeLanding parentProps={this.props} />
                                <div className="col">
                                    <div className="row">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (localStorage.role === 'student') {
            return (
                <div className="container-fluid md-0 p-0">
                    {redirectVar}
                    <div className="row">
                        <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                            <Navbar selected="courses" />
                        </div>
                        <div className="col">
                            <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">
                                <Breadcrumb size="large">
                                    <BreadcrumbLink href={homePath}>{courseName}</BreadcrumbLink>
                                    <BreadcrumbLink>Grades</BreadcrumbLink>
                                </Breadcrumb>
                            </Heading>
                            <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="grades" />
                                </div>

                                <div className="col">
                                    <div className="row">
                                        <StudentGradeLanding parentProps={this.props} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return (<div><Redirect to="/login" /></div>);
        }

    }
}
const mapStateToProps = state => {
    console.log(JSON.stringify(state))
    return {
      courseHomeStateStore: state.courseHome,
      courseStateStore: state.course,
      profileStateStore: state.profile,
      loginStateStore: state.login
    }
  }
  
  //export default Profile;
  export default connect(mapStateToProps, { getCourseHome })(UserCourseGrades);

