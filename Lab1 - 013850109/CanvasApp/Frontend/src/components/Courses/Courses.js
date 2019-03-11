import React, { Component } from 'react';
import { Grid, GridRow, GridCol } from '@instructure/ui-layout'
import theme from '@instructure/ui-themes/lib/canvas/base'
import Navbar from '../LandingPage/Navbar';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Table } from '@instructure/ui-elements';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import { SideNav, Nav } from "react-sidenav";
import styled from "styled-components";
import { Link } from 'react-router-dom'

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


export default class Courses extends Component {

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
                <div>
                    {redirectVar}
                    <div className="row">
                        <div className="col col-sm-2">
                            <Navbar selected="account" />
                        </ div>
                        <div className="col col-lg-8">
                            <div className="row">
                                <div className="col">
                                    <SideNav
                                        defaultSelectedPath="1"
                                        theme={themeCourse}
                                        onItemSelection={this.onItemSelection}
                                    >
                                        <Nav id="1"><Link to="/courseHome">Course List</Link></Nav>
                                        <Nav id="2"><Link to="/courseCreate">Create Course</Link></Nav>
                                        <Nav id="2"><Link to="/coursePC">Generate Permission Code</Link></Nav>
                                    </SideNav>
                                </div>
                                <div className="col">
                                    <br />
                                    <Heading theme={{ borderPadding: "1rem" }} border="bottom">Faculty Courses</ Heading>
                                </ div>
                            </ div>
                            <div className="row">

                            </ div>
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
                        <div className="col col-sm-1">
                            <Navbar selected="courses" />
                        </ div>
                        <div className="col col-sm-2">
                            <SideNav
                                defaultSelectedPath="1"
                                theme={themeCourse}
                                onItemSelection={this.onItemSelection}
                            >
                                <Nav id="1"><Link to="/courseHome">Enrolled Courses</Link></Nav>
                                <Nav id="2"><Link to="/courseSearch">Search Courses</Link></Nav>
                                <Nav id="3"><Link to="/courseEnroll">Enroll Course</Link></Nav>
                            </SideNav>
                        </div>
                        <div className="col col-lg-8">
                            <div className="row">
                                <div className="col">
                                    <br />
                                    <Heading theme={{ borderPadding: "1rem" }} border="bottom">Faculty Courses</ Heading>
                                </ div>
                            </ div>
                            <div className="row">
                                {this.state.courseComponent}
                            </ div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (<div><Redirect to="/login" /></div>);
        }
    }
}