import React, { Component } from 'react';
import Navbar from '../../LandingPage/Navbar';
import CourseNav from './CourseNav';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import styled from "styled-components";
import { Link } from 'react-router-dom';
import axios from 'axios';


import {
    AppContainer as BaseAppContainer,
    ExampleNavigation as Navigation,
    ExampleBody as Body
} from "./CourseNavStyle.js";

const AppContainer = styled(BaseAppContainer)`
  height: calc(100vh - 40px);
  padding:20px;
`;

const themeCourse = {
    hoverBgColor: "#f5f5f5",
    selectionBgColor: "#f5f5f5",
    selectionIconColor: "#03A9F4"
};


export default class UserCourseAnnouncements extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
        };
    }

    componentWillMount() {
        axios.get('http://localhost:3001/course/' + this.props.match.params.courseUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ course: response.data })
            })
    }

    render() {
        let redirectVar = null;
        let assignmentsModule = ''
        if (cookie.load('cookieF')) {
            return (
                <div className="container-fluid md-0 p-0">
                    {redirectVar}
                    <div className="row">
                        <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                            <Navbar selected="courses" />
                        </div>
                        <div className="col">
                            <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">Announcements</Heading>
                            <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="announcements" />
                                </div>

                                <div className="col col-lg-8">
                                    <div className="row">
                                        Faculty announcements
                                </div>
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
                            <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">Assignments</Heading>
                            <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="announcements" />
                                </div>

                                <div className="col col-lg-8">
                                    <div className="row">
                                        Student announcements
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
