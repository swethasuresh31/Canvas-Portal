import React, { Component } from 'react';
import { SideNav, Nav } from "react-sidenav";
import styled from "styled-components";
import { Link } from 'react-router-dom'

import {
    AppContainer as BaseAppContainer,
    ExampleNavigation as Navigation,
    ExampleBody as Body
} from "./MessageNavStyle.js";

const AppContainer = styled(BaseAppContainer)`
  height: calc(100vh - 40px);
  padding:20px;
`;

const themeCourse = {
    selectionBgColor: "#0055a2",
    selectionColor: "#FFFFFF"
};

export default class MessageNav extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
        };
    }

    render() {
        
        return (

            <div className="col ml-0">
                <SideNav
                    defaultSelectedPath={this.props.selected}
                    theme={themeCourse}
                >
                    <a href="/message/inbox" style = {{textDecoration:'none'}}><Nav id="inbox">Inbox</Nav></a>
                    <a href="/message/sent" style = {{textDecoration:'none'}}><Nav id="sent">Sent</Nav></a>
                    
                </SideNav>
            </div>
                         

        )
    }
}