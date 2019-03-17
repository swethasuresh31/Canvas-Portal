import React, { Component } from 'react';
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
    selectionBgColor: "#0055a2",
    selectionColor: "#FFFFFF"
};

export default class CourseNav extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
        };
    }

    render() {
        let coursePrefix = "/coursedetails/"+this.props.courseUid
        let homePath = coursePrefix+"/home"
        let assignmentsPath = coursePrefix+"/assignments"
        let announcementsPath = coursePrefix+"/announcements"
        let gradesPath = coursePrefix+"/grades"
        let peoplePath = coursePrefix+"/people"
        let filesPath = coursePrefix+"/files"
        let quizzesPath = coursePrefix+"/quizzes"
        return (

            <div className="col ml-0">
                <SideNav
                    defaultSelectedPath={this.props.selected}
                    theme={themeCourse}
                >
                    <a href={homePath} style = {{textDecoration:'none'}}><Nav id="home">Home</Nav></a>
                    <a href={assignmentsPath} style = {{textDecoration:'none'}}><Nav id="assignments">Assignments</Nav></a>
                    <a href={announcementsPath} style = {{textDecoration:'none'}}><Nav id="announcements">Announcements</Nav></a>
                    <a href={gradesPath} style = {{textDecoration:'none'}}><Nav id="grades">Grades</Nav></a>
                    <a href={peoplePath} style = {{textDecoration:'none'}}><Nav id="people">People</Nav></a>
                    <a href={filesPath} style = {{textDecoration:'none'}}><Nav id="files">Files</Nav></a>
                    <a href={quizzesPath} style = {{textDecoration:'none'}}><Nav id="quizzes">Quizzes</Nav></a>
                </SideNav>
            </div>
                         

        )
    }
}