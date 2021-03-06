import React, { Component } from 'react';
import Navbar from '../../../LandingPage/Navbar';
import CourseNav from '../CourseNav';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import styled from "styled-components";
import axios from 'axios'
import {rooturl} from '../../../../config/settings';
import { Avatar, Text, Table } from '@instructure/ui-elements'
import { Breadcrumb, BreadcrumbLink } from '@instructure/ui-breadcrumb'
import Cookies from 'universal-cookie';

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

export default class UserCoursePeople extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            people: [],
            course:''
        };
    }

    componentWillMount() {
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
        axios.get('http://' + rooturl + ':3001/account/' + this.props.match.params.user)
            .then((response) => {
                console.log(response);
                //update the state with the response data
                    this.setState({
                        name: response.data.name,
                        emailId: response.data.emailId,
                        phoneNo: response.data.phoneNumber,
                        aboutMe: response.data.aboutMe,
                        city: response.data.city,
                        country: response.data.country,
                        company: response.data.company,
                        school: response.data.school,
                        hometown: response.data.hometown,
                        languages: response.data.languages,
                        gender: response.data.gender
                    })
            });

            axios.get('http://' + rooturl + ':3001/course/' + this.props.match.params.courseUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ course: response.data })
            })
    }

    render() {
        let homePath = "/coursedetails/" + this.state.course._id + "/home";
        let courseName = this.state.course.course_term + ': ' + this.state.course.course_dept_code + ' - ' + this.state.course.course_id + ' - ' + this.state.course.course_name
        let path1 = "/coursedetails/" + this.state.course._id + "/people";
        let profileImg = "http://" + rooturl + ":3001/img/" + encodeURI(this.state.emailId)
        console.log(this.state.people[0])
        let redirectVar = null;
        if (localStorage.user && localStorage.user !== undefined) {
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
                                    <BreadcrumbLink href={path1}>People</BreadcrumbLink>
                                    <BreadcrumbLink>{this.state.name}</BreadcrumbLink>
                                </Breadcrumb>
                            </Heading>
                            <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="people" />
                                </div>

                                <div className="col">
                                    <div className="row">
                                        <div className="col">
                                            <br />
                                            <Heading theme={{ borderPadding: "1rem" }} border="bottom">{this.state.name}'s Profile
                                            </Heading>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col col-sm-1">
                                            <br /><Avatar src={profileImg} size="x-large" />
                                        </div>
                                        <div className="col col-lg-5">
                                            <br /><h4>
                                                <table className="table-borderless">
                                                    <tbody>
                                                        <tr><td><label>Name: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.name} /></td></tr>
                                                        <tr><td><label>Email: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.emailId} /></td></tr>
                                                        <tr><td><label>Phone Number: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.phoneNo} /></td></tr>
                                                        <tr><td><label>About Me: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.aboutMe} /></td></tr>
                                                        <tr><td><label>City: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.city} /></td></tr>
                                                        <tr><td><label>Country: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.country} /></td></tr>
                                                        <tr><td><label>Company: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.company} /></td></tr>
                                                        <tr><td><label>School: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.school} /></td></tr>
                                                        <tr><td><label>Hometown: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.hometown} /></td></tr>
                                                        <tr><td><label>Languages: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.languages} /></td></tr>
                                                        <tr><td><label>Gender: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.gender} /></td></tr>
                                                    </tbody>
                                                </table></h4>
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
