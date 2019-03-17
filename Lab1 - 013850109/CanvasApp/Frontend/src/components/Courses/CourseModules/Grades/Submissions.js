import React, { Component } from 'react';
import Navbar from '../../../LandingPage/Navbar';
import CourseNav from '../CourseNav';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import { Breadcrumb, BreadcrumbLink } from '@instructure/ui-breadcrumb'
import styled from "styled-components";
import axios from 'axios';
import { Avatar, Text, Table } from '@instructure/ui-elements'
import { Link } from 'react-router-dom';



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


export default class Submissions extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            assignments: [],
            course: ''
        };
    }

    componentWillMount() {
        axios.get('http://localhost:3001/studentassignment/'+ this.props.match.params.courseUid + '/' + this.props.match.params.assignmentUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ assignments: response.data })
            })
            axios.get('http://localhost:3001/course/' + this.props.match.params.courseUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ course: response.data[0] })
            })
    }

    render() {
        let homePath = "/coursedetails/" + this.state.course.course_uid + "/home";
        let path1 = "/coursedetails/" + this.state.course.course_uid + "/grades";
        let courseName = this.state.course.course_term + ': ' + this.state.course.course_dept_code + ' - ' + this.state.course.course_id + ' - ' + this.state.course.course_name

        console.log(this.state.assignments[0])
        let redirectVar = null;
        if (cookie.load('cookieF')) {
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
                                    <BreadcrumbLink href={path1}>Grades</BreadcrumbLink>
                                    <BreadcrumbLink>Submissions</BreadcrumbLink>
                                </Breadcrumb>
                            </Heading>
                            <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="grades" />
                                </div>

                                <div className="col">
                                    <br />

                                    <Table caption="" size="small" striped="rows">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Name</th>
                                                <th>Assignment</th>
                                                <th>Scored Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.assignments.map(assignment => {
                                                    let assignmentSubmissionLink = "/coursedetails/"+this.props.match.params.courseUid+"/assignments/submissions/"+this.props.match.params.assignmentUid+"/" + encodeURI(assignment.email_id)
                                                    return (
                                                        <tr>
                                                            <td> <Avatar name={assignment.name} size="small" /></td>
                                                            <td><Link to={assignmentSubmissionLink}>{assignment.name}</Link></td>
                                                            <td><Link to={assignmentSubmissionLink}>{assignment.coursework_name}</Link></td>
                                                            <td>{assignment.scored_points}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else if (cookie.load('cookieS')) {
            let announcementsPage = "/coursedetails/" + this.props.match.params.courseUid + "/assignments";
            return (<div><Redirect to={announcementsPage} /></div>);
        }
        else {
            return (<div><Redirect to="/login" /></div>);
        }

    }
}
