import React, { Component } from 'react';
import Navbar from '../../../LandingPage/Navbar';
import CourseNav from '../CourseNav';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
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


export default class UserCoursePeople extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            people: [],
            course: []
        };
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
        let redirectVar = null;
        if (cookie.load('cookieF') || cookie.load('cookieS')) {
            return (
                <div className="container-fluid md-0 p-0">
                    {redirectVar}
                    <div className="row">
                        <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                            <Navbar selected="courses" />
                        </div>
                        <div className="col">
                        <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom"><Link to={homePath} >{this.state.course.course_term}: {this.state.course.course_dept_code} - {this.state.course.course_id} - {this.state.course.course_name}</Link></Heading>
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
                                                    return (
                                                        <tr>
                                                            <td> <Avatar name={person.name} size="snall" /></td>
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
