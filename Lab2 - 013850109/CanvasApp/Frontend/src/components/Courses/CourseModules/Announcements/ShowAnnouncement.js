import React, { Component } from 'react';
import Navbar from '../../../LandingPage/Navbar';
import CourseNav from '../CourseNav';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import styled from "styled-components";
import axios from 'axios';
import { Breadcrumb, BreadcrumbLink } from '@instructure/ui-breadcrumb'
import { Avatar, Text, Table } from '@instructure/ui-elements';
import { Link } from 'react-router-dom';



import {
    AppContainer as BaseAppContainer,
    ExampleNavigation as Navigation,
    ExampleBody as Body
} from "../CourseNavStyle.js";
import SearchBar from '../SearchBar';
import AnnouncementCard from './AnnouncementCard';

const AppContainer = styled(BaseAppContainer)`
  height: calc(100vh - 40px);
  padding:20px;
`;

const themeCourse = {
    hoverBgColor: "#f5f5f5",
    selectionBgColor: "#f5f5f5",
    selectionIconColor: "#03A9F4"
};


export default class ShowAnnouncement extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            announcement: '',
            course: ''
        };
    }

    componentWillMount() {
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
    axios.get('http://localhost:3001/course/' + this.props.match.params.courseUid)
        .then((response) => {
            console.log(response);
            if (response !== undefined)
                this.setState({ course: response.data })
        })
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
        axios.get('http://localhost:3001/announcement/'+ this.props.match.params.courseUid +'/id/' + this.props.match.params.announcementUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ announcement: response.data })
            })
    }

    render() {
        let redirectVar = null;
        let homePath = "/coursedetails/" + this.state.course._id + "/home";
        let path1 = "/coursedetails/" + this.state.course._id + "/announcements";
        let courseName = this.state.course.course_term + ': ' + this.state.course.course_dept_code + ' - ' + this.state.course.course_id + ' - ' + this.state.course.course_name
        
        if (localStorage.user) {
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
                                    <BreadcrumbLink href={path1}>Announcements</BreadcrumbLink>
                                    <BreadcrumbLink>Announcement</BreadcrumbLink>
                                </Breadcrumb>
                            </Heading>
                            <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="announcements" />
                                </div>

                                <div className="col">
                                    <br />
                                    <div class="card" style={{ width: "50rem" }}>
                                        <div class="card-header"><br /><br />
                                        </div>
                                        <div class="card-body">
                                            <div class="row">
                                                <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                                                    <Avatar name={this.state.announcement.created_by} size="medium" />
                                                </div>
                                                <div class="col">
                                                    <div class="row"><h5 class="card-title">{this.state.announcement.header}</h5></div>
                                                    <div class="row">{this.state.announcement.created_by}</div>
                                                    <div class="row">{this.state.announcement.timestamp}</div>
                                                </div>
                                            </div>
                                            <br />
                                            <p class="card-text"><pre style={{ fontFamily: "inherit" }}>{this.state.announcement.body}</pre></p>
                                        </div>
                                        <div class="card-footer"><br /><br />
                                        </div>
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
