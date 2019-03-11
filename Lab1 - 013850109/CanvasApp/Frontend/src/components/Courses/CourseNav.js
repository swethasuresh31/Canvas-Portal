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
    hoverBgColor: "#f5f5f5",
    selectionBgColor: "#f5f5f5",
    selectionIconColor: "#03A9F4"
};

export default class CourseNav extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            selectedPath: ''
        };
    }

    onItemSelection = arg => {
        this.setState({ selectedPath: arg.path });
    };

    render() {

        return (

            <div className="col">
                <SideNav
                    defaultSelectedPath="1"
                    theme={themeCourse}
                    onItemSelection={this.onItemSelection}
                >
                    <Nav id="1"><Link to="/coursehome" selected={this.props.selected === "home"}>Home</Link></Nav>
                    <Nav id="2"><Link to="/cassignments">Assignments</Link></Nav>
                    <Nav id="2"><Link to="/cannouncements">Announcements</Link></Nav>
                    <Nav id="3"><Link to="/cgrades">Grades</Link></Nav>
                    <Nav id="3"><Link to="/cpeople">People</Link></Nav>
                    <Nav id="3"><Link to="/cfiles">Files</Link></Nav>
                    <Nav id="3"><Link to="/cquizzes">Quizzes</Link></Nav>

                </SideNav>
            </div>
                         

        )
    }
}