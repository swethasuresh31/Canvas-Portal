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
            selectedPath: ''
        };
    }

    onItemSelection = arg => {
        this.setState({ selectedPath: arg.path });
    };

    render() {

        return (

            <div className="col ml-0">
                <SideNav
                    defaultSelectedPath="1"
                    theme={themeCourse}
                    onItemSelection={this.onItemSelection}
                >
                    <Link to="/coursehome" selected={this.props.selected === "home"} style = {{textDecoration:'none'}}><Nav id="1">Home</Nav></Link>
                    <Link to="/cassignments" selected={this.props.selected === "home"} style = {{textDecoration:'none'}}><Nav id="2">Assignments</Nav></Link>
                    <Link to="/cannouncements" selected={this.props.selected === "home"} style = {{textDecoration:'none'}}><Nav id="3">Announcements</Nav></Link>
                    <Link to="/cgrades" selected={this.props.selected === "home"} style = {{textDecoration:'none'}}><Nav id="4">Grades</Nav></Link>
                    <Link to="/cpeople" selected={this.props.selected === "home"} style = {{textDecoration:'none'}}><Nav id="5">People</Nav></Link>
                    <Link to="/cfiles" selected={this.props.selected === "home"} style = {{textDecoration:'none'}}><Nav id="6">Files</Nav></Link>
                    <Link to="/cquizzes" selected={this.props.selected === "home"} style = {{textDecoration:'none'}}><Nav id="7">Quizzes</Nav></Link>
                </SideNav>
            </div>
                         

        )
    }
}