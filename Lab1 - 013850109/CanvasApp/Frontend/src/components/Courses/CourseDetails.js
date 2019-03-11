import React, { Component } from 'react';
import Navbar from '../LandingPage/Navbar';
import CourseNav from '../Courses/CourseNav';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import styled from "styled-components";
import { Link } from 'react-router-dom';


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


export default class CourseDetails extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            selectedPath: "1",
            department: 'CMPE',
            id: '273',
            name: 'Ent Dist SW',
            term: 'Spring 2019'
        };
    }

    onItemSelection = arg => {
        this.setState({ selectedPath: arg.path });
    };

    render() {
        let redirectVar = null;
        if (cookie.load('cookieF')) {
            //Return faculty page
            return (
                <div className="container-fluid md-0 p-0">
                    {redirectVar}
                    <div className="row">
                    <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                            <Navbar selected="courses" />
                        </ div>
                        <div className="col">
                                <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">All Courses</ Heading>
                       <div className="row">
                       
                        <div className="col col-sm-2">
                        <br />    <CourseNav selected="home"></CourseNav>
                        </div>
                            
                        <div className="col col-lg-8">
                            <div className="row">
                                {this.state.courseComponent}
                            </ div>
                        </div>
                        </div>
                    </div>
                </div>
                </div>
            );
        } else if (cookie.load('cookieS')) {
            //Return student page
            return (
                <div className="container-fluid md-0 p-0">
                    {redirectVar}
                    <div className="row">
                        <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                            <Navbar selected="courses" />
                        </ div>
                        <div className="col">
                                <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">All Courses</ Heading>
                       <div className="row">
                       
                        <div className="col col-sm-2">
                        <br />    <CourseNav selected="home"></CourseNav>
                        </div>
                            
                        <div className="col col-lg-8">
                            <div className="row">
                                {this.state.courseComponent}
                            </ div>
                        </div>
                        </div>
                    </div>
                </div>
                </div>
            );
        } else {
            return (<div><Redirect to="/login" /></div>);
        }
    }
}