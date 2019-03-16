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


export default class CourseHome extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            course: []
        };
    }

    componentWillMount() {
        axios.get('http://localhost:3001/course/' + this.props.match.params.courseUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ course: response.data[0] })
            })
    }

    render() {
        let homePath = "/coursedetails/" + this.state.course.course_uid + "/home";

        if (cookie.load('cookieF') || cookie.load('cookieS')) {
            return (
                <div className="container-fluid md-0 p-0">
                    <div className="row">
                        <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                            <Navbar selected="courses" />
                        </div>
                        <div className="col">
                            <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom"><Link to={homePath} >{this.state.course.course_term}: {this.state.course.course_dept_code} - {this.state.course.course_id} - {this.state.course.course_name}</Link></Heading>
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
