import React, { Component } from 'react';
import Navbar from '../../../LandingPage/Navbar';
import CourseNav from '../CourseNav';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import styled from "styled-components";
import axios from 'axios'
import { rooturl } from '../../../../config/settings';
import { Breadcrumb, BreadcrumbLink } from '@instructure/ui-breadcrumb'
import { Avatar, Text, Table } from '@instructure/ui-elements'
import { Link } from 'react-router-dom';
import { IconXLine } from '@instructure/ui-icons';

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


class UserCoursePeople extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            people: [],
            enrolled: [],
            waitlisted: [],
            course: {
                enrolled: []
            },
            currentPage: 1,
            loadPage: 0,
            startIndex: 0,
            pagesPerPage: 2,
            peopleFiltered: []
        };
        this.onDrop = this.onDrop.bind(this);
        this.handlePagination = this.handlePagination.bind(this);

    }


    handlePagination(event) {

        var target = event.target;
        var id = target.id;
        var flag = true;
        if (id === "prev") {
            console.log('SI', this.state.startIndex);
            if (this.state.startIndex > 0) {
                var startIndex = this.state.startIndex - this.state.pagesPerPage;
            }
            else {
                flag = false;
            }
        }
        else {
            var startIndex = this.state.startIndex + this.state.pagesPerPage;
            if (startIndex > this.state.people.length) {
                flag = false;
            }
        }


        if (flag === true) {


            var endIndex = startIndex + this.state.pagesPerPage - 1;
            var people = this.state.people;
            var peopleFiltered = this.state.people.filter(function (course) {
                var index = people.indexOf(course);
                return index >= startIndex && index <= endIndex;
            });
            console.log('startomdex: ', startIndex);
            console.log('endomdex: ', endIndex);
            this.setState({
                peopleFiltered: peopleFiltered,
                startIndex: startIndex
            });
        }
    }



    onDrop(user, courseUid, enrollmentStatus) {
        this.setState({ errorMsg: '' })
        //drops the courses based on information entered
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
        axios.delete('http://' + rooturl + ':3001/usercourse?user=' + encodeURI(user) + '&courseUid=' + courseUid + '&status=' + enrollmentStatus)
            .then((response) => {
                console.log(response);
                if (response !== undefined && response.status === 200) {
                    if (enrollmentStatus === 'Waitlist') {
                        let index = this.state.waitlisted.findIndex(row => row.emailId === user)
                        console.log(index)
                        var newPeople = [...this.state.waitlisted]
                        newPeople.splice(index, 1);
                        console.log(newPeople)
                        this.setState({ waitlisted: newPeople });
                    } else {
                        let index = this.state.enrolled.findIndex(row => row.emailId === user)
                        console.log(index)
                        var newPeople = [...this.state.enrolled]
                        newPeople.splice(index, 1);
                        console.log(newPeople)
                        this.setState({ enrolled: newPeople });
                    }

                }

            })

    }

    async componentWillMount() {
        await this.props.getCourseHome(this.props.match.params.courseUid);
        console.log("course: " + this.props.courseHomeStateStore.result.data)
        const result = this.props.courseHomeStateStore.result.data;
        this.setState({
            course: result,
            people: [...result.enrolled, ...result.waitlisted]
        }, () => {
            console.log("course: " + this.state);
            var people = this.state.people;
            var peopleFiltered = this.state.people.filter(function (course) {
                var index = people.indexOf(course);
                return index >= 0 && index <= 1;
            }, () => {
                console.log(peopleFiltered);
            });


            this.setState({
                peopleFiltered: peopleFiltered

            });

        });



    }


    render() {
        let homePath = "/coursedetails/" + this.state.course._id + "/home";
        let courseName = this.state.course.course_term + ': ' + this.state.course.course_dept_code + ' - ' + this.state.course.course_id + ' - ' + this.state.course.course_name
        console.log(this.state.course);
        let redirectVar = null;
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
                                                this.state.peopleFiltered.map(person => {
                                                    let personProfileLink = "/coursedetails/" + this.props.match.params.courseUid + "/people/" + encodeURI(person.emailId)
                                                    let profileImg = "http://" + rooturl + ":3001/img/" + encodeURI(person.emailId)
                                                    console.log(JSON.stringify(this.state.course.enrolled) + " : " + person.emailId + " : " + this.state.course.enrolled.includes(person.emailId))
                                                    let enrollmentStatus = "Waitlist"
                                                    this.state.course.enrolled.forEach((enrollment) => { if (enrollment.emailId === person.emailId) { enrollmentStatus = "Enrolled"; } })
                                                    return (
                                                        <tr>
                                                            <td> <Avatar src={profileImg} name={person.name} size="snall" /></td>
                                                            <td><Link to={personProfileLink}>{person.name}</Link></td>
                                                            <td> {this.state.course.course_term}: {this.state.course.course_dept_code}-{this.state.course.course_id}</td>
                                                            <td>Student</td>
                                                            <td>{enrollmentStatus}</td>
                                                            <td><button type="button" class="btn btn-danger mx-2" onClick={() => this.onDrop(person.emailId, this.state.course._id, enrollmentStatus)}><IconXLine /> Remove</button></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                    {(() => {
                                        if (this.state.peopleFiltered.length !== 0) {
                                            return (
                                                <div className="row  d-flex justify-content-center">
                                                    <button className="btn btn-primary btn-md" style={{ backgroundColor: '#0055a2' }} id="prev" onClick={this.handlePagination}>Prev</button>
                                                    <button className="btn btn-primary btn-md btn-md mx-2" style={{ backgroundColor: '#0055a2' }} id="next" onClick={this.handlePagination} >Next</button>
                                                </div>
                                            );
                                        }
                                    })()
                                    }
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
                                                this.state.peopleFiltered.map(person => {
                                                    let personProfileLink = "/coursedetails/" + this.props.match.params.courseUid + "/people/" + encodeURI(person.emailId)
                                                    let profileImg = "http://" + rooturl + ":3001/img/" + encodeURI(person.emailId)
                                                    return (
                                                        <tr>
                                                            <td> <Avatar src={profileImg} name={person.name} size="snall" /></td>
                                                            <td><Link to={personProfileLink}>{person.name}</Link></td>
                                                            <td> {this.state.course.course_term}: {this.state.course.course_dept_code}-{this.state.course.course_id}</td>
                                                            <td>Student</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                    {(() => {
                                        if (this.state.peopleFiltered.length !== 0) {
                                            return (
                                                <div className="row  d-flex justify-content-center">
                                                    <button className="btn btn-primary btn-md" style={{ backgroundColor: '#0055a2' }} id="prev" onClick={this.handlePagination}>Prev</button>
                                                    <button className="btn btn-primary btn-md btn-md mx-2" style={{ backgroundColor: '#0055a2' }} id="next" onClick={this.handlePagination} >Next</button>
                                                </div>
                                            );
                                        }
                                    })()
                                    }
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
export default connect(mapStateToProps, { getCourseHome })(UserCoursePeople);