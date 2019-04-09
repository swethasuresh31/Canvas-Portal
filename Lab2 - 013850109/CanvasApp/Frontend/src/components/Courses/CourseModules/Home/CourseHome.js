import React, { Component } from 'react';
import Navbar from '../../../LandingPage/Navbar';
import CourseNav from '../CourseNav';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import styled from "styled-components";
import { Breadcrumb, BreadcrumbLink } from '@instructure/ui-breadcrumb'

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


class CourseHome extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            course: ''
        };
    }

    async componentWillMount() {
        await this.props.getCourseHome(this.props.match.params.courseUid);
        console.log("course: " + this.props.courseHomeStateStore.result.data)   
        const result = this.props.courseHomeStateStore.result.data;
        this.setState({
            course: result
        })
        console.log("course home: "+this.state.course);
        
    }

    render() {
        let homePath = "/coursedetails/" + this.state.course._id + "/home";
        let courseName = this.state.course.course_term + ': ' + this.state.course.course_dept_code + ' - ' + this.state.course.course_id + ' - ' + this.state.course.course_name
        console.log(courseName)
        if (localStorage.userToken && localStorage.userToken !== "undefined") {
            return (
                <div className="container-fluid md-0 p-0">
                    <div className="row">
                        <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                            <Navbar selected="courses" />
                        </div>
                        <div className="col">
                            <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">
                                <Breadcrumb size="large">
                                    <BreadcrumbLink href={homePath}>{courseName}</BreadcrumbLink>
                                    <BreadcrumbLink>Home</BreadcrumbLink>
                                </Breadcrumb>
                            </Heading>
                            <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="home" />
                                </div>

                                <div className="col">
                                    <br />
                                    <div class="list-group">
                                        <button type="button" class="list-group-item list-group-item-action" disabled>
                                            <div className="row">
                                                <div className="col">
                                                    <br /><Heading theme={{ borderPadding: "0.5rem" }} border="bottom"><b>{this.state.course.course_term}: {this.state.course.course_dept_code} - {this.state.course.course_id} - {this.state.course.course_name}</b></Heading>
                                                    <br />
                                                    <div class="h4">
                                                        <div class="panel-body"><b>Instructor:</b> {this.state.course.course_instructor}</div>
                                                        <div class="panel-body"><b>Classroom Location: </b>{this.state.course.course_room}</div>
                                                        <div class="panel-body"><b>Email Id: </b>{this.state.course.created_by}</div>
                                                        <div class="panel-body"><b>Class Days/Time: </b>{this.state.course.course_dayandtime}</div>
                                                        <div class="panel-body"><b>Course Description: </b>{this.state.course.course_desc}</div>
                                                        <div class="panel-body"><b>Syllabus: </b>{this.state.course.course_syllabus}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
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
  export default connect(mapStateToProps, { getCourseHome })(CourseHome);