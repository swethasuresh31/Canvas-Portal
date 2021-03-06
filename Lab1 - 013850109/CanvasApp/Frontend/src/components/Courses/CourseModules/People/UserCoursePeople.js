import React, { Component } from 'react';
import Navbar from '../../../LandingPage/Navbar';
import CourseNav from '../CourseNav';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import styled from "styled-components";
import axios from 'axios';
import { Breadcrumb, BreadcrumbLink } from '@instructure/ui-breadcrumb'
import { Avatar, Text, Table } from '@instructure/ui-elements'
import { Link } from 'react-router-dom';
import { IconXLine } from '@instructure/ui-icons';




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


export default class UserCoursePeople extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            people: [],
            course: ''
        };
        this.onDrop = this.onDrop.bind(this);

    }

    onDrop(user, courseUid, enrollmentStatus) {
        this.setState({ errorMsg: '' })
        //drops the courses based on information entered
        axios.delete('http://localhost:3001/usercourse?user=' + encodeURI(user) + '&courseUid=' + courseUid + '&status=' + enrollmentStatus)
            .then((response) => {
                console.log(response);
                if (response !== undefined && response.status === 200) {
                    let index = this.state.people.findIndex(row => row.email_id === user)
                    console.log(index)
                    var newPeople = [...this.state.people]
                    newPeople.splice(index, 1);
                    console.log(newPeople)
                    this.setState({ people: newPeople });
                }

            })

    }

    componentWillMount() {
        axios.get('http://localhost:3001/user/course/' + this.props.match.params.courseUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ people: response.data })
            })
        axios.get('http://localhost:3001/course/' + this.props.match.params.courseUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ course: response.data[0] })
            })
    }

    render() {
        console.log(this.state.people[0])
        let homePath = "/coursedetails/" + this.state.course.course_uid + "/home";
        let courseName = this.state.course.course_term + ': ' + this.state.course.course_dept_code + ' - ' + this.state.course.course_id + ' - ' + this.state.course.course_name
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
                                    <BreadcrumbLink>People</BreadcrumbLink>
                                </Breadcrumb>
                            </Heading>
                            <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="people" />
                                </div>

                                <div className="col">
                                    <br />

                                    <Table caption="" size="small" striped="rows">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Name</th>
                                                <th>Section</th>
                                                <th>Role</th>
                                                <th>Enrollment Status</th>
                                                <th>Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.people.map(person => {
                                                    let personProfileLink = "/coursedetails/" + this.props.match.params.courseUid + "/people/" + encodeURI(person.email_id)
                                                    let profileImg = "http://localhost:3001/account/img/" + encodeURI(person.email_id)
                                                    let enrollmentStatus = (person.isWaitlist !== 0) ? "Waitlist" : "Enrolled";
                                                    return (
                                                        <tr>
                                                            <td> <Avatar src={profileImg} name={person.name} size="snall" /></td>
                                                            <td><Link to={personProfileLink}>{person.name}</Link></td>
                                                            <td> {person.course_term}: {person.course_dept_code}-{person.course_id}</td>
                                                            <td>Student</td>
                                                            <td>{enrollmentStatus}</td>
                                                            <td><button type="button" class="btn btn-danger mx-2" onClick={() => this.onDrop(person.email_id, person.course_uid, enrollmentStatus)}><IconXLine /> Remove</button></td>
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
        } else if (cookie.load('cookieS')) {
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
                                    <BreadcrumbLink>People</BreadcrumbLink>
                                </Breadcrumb>
                            </Heading>
                            <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="people" />
                                </div>

                                <div className="col">
                                    <br />

                                    <Table caption="" size="small" striped="rows">
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Name</th>
                                                <th>Section</th>
                                                <th>Role</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.people.map(person => {
                                                    let personProfileLink = "/coursedetails/" + this.props.match.params.courseUid + "/people/" + encodeURI(person.email_id)
                                                    let profileImg = "http://localhost:3001/account/img/" + encodeURI(person.email_id)
                                                    return (
                                                        <tr>
                                                            <td> <Avatar src={profileImg} name={person.name} size="snall" /></td>
                                                            <td><Link to={personProfileLink}>{person.name}</Link></td>
                                                            <td> {person.course_term}: {person.course_dept_code}-{person.course_id}</td>
                                                            <td>Student</td>
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
        else {
            return (<div><Redirect to="/login" /></div>);
        }

    }
}
