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
import Cookies from 'universal-cookie';
import StudentQuizLanding from './StudentQuizLanding'
import FacultyQuizLanding from './FacultyQuizLanding'

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

export default class UserCourseQuizzes extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            people: []
        };
    }

    componentWillMount() {
        // axios.get('http://localhost:3001/user/id/' + this.props.match.params.user)
        //     .then((response) => {
        //         console.log(response);
        //         //update the state with the response data
        //         response.data.map(data => {
        //             this.setState({
        //                 name: data.name,
        //                 emailId: data.email_id,
        //                 phoneNo: data.phone_number,
        //                 aboutMe: data.about_me,
        //                 city: data.city,
        //                 country: data.country,
        //                 company: data.company,
        //                 school: data.school,
        //                 hometown: data.hometown,
        //                 languages: data.languages,
        //                 gender: data.gender
        //             })
        //         })
        //     });
    }

    render() {
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
                            <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">Quizzes</Heading>
                            <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="quizzes" />
                                </div>
                                    <FacultyQuizLanding parentProps={this.props}/>
                                <div className="col">
                                    <div className="row">
                                        
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
                                <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">Quizzes</Heading>
                                <div className="row">
    
                                    <div className="col col-sm-2">
                                        <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="quizzes" />
                                    </div>
    
                                    <div className="col">
                                        <div className="row">
                                            <StudentQuizLanding parentProps={this.props}/>
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
