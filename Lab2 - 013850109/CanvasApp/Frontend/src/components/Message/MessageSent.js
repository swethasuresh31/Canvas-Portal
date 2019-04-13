import React, { Component } from 'react';
import Navbar from '../LandingPage/Navbar';
import MessageNav from './MessageNav';
import MessageCard from './MessageCard';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import styled from "styled-components";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Breadcrumb, BreadcrumbLink } from '@instructure/ui-breadcrumb';

import { getProfileInformation } from '../../js/actions/ProfileAction';
import { connect } from 'react-redux';

import {
    AppContainer as BaseAppContainer,
    ExampleNavigation as Navigation,
    ExampleBody as Body
} from "./MessageNavStyle.js";
import { IconAddLine } from '@instructure/ui-icons';

const AppContainer = styled(BaseAppContainer)`
  height: calc(100vh - 40px);
  padding:20px;
`;

const themeCourse = {
    hoverBgColor: "#f5f5f5",
    selectionBgColor: "#f5f5f5",
    selectionIconColor: "#03A9F4"
};


class MessageSent extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            announcements: [],
            sent: []
        };
    }

    async componentWillMount() {
        await this.props.getProfileInformation();
        if(!this.props.profileStateStore.result) return;
        const result = this.props.profileStateStore.result.data;
        this.setState({
            sent: result.sent
        })
    }

    render() {
        let redirectVar = null;
        // let homePath = "/coursedetails/" + this.state.course._id + "/home";
        // let courseName = this.state.course.course_term + ': ' + this.state.course.course_dept_code + ' - ' + this.state.course.course_id + ' - ' + this.state.course.course_name
        // let addAnnouncementPath = "/coursedetails/" + this.props.match.params.courseUid + "/announcements/add"
        if (localStorage.userToken && localStorage.userToken !== "undefined") {
            return (
                <div className="container-fluid md-0 p-0">
                    {redirectVar}
                    <div className="row">
                        <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                            <Navbar selected="inbox" />
                        </div>
                        <div className="col">
                        <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">
                               Mailbox
                            </Heading>
                            <div className="row">
                                <div className="col">
                                <a href="/message/create" class="btn btn-primary btn-lg active  m-3 p-2" style={{ backgroundColor: '#0055a2' }} role="button" aria-pressed="true"><IconAddLine /> Compose Message</a>
                                </div>
                                </div>
                                <div className="row">
                                <div className="col col-sm-2">
                                    <br /> <MessageNav selected="sent" />   
                                </div>

                                <div className="col">
                                    <div className="row">
                                        <div className="col" >
                                        
                                        </div>
                                        <table className="table">
                                            <tbody>
                                                {
                                                    this.state.sent.map(message => <MessageCard message={message} type="sent"/>
                                                    )
                                                }
                                            </tbody>
                                            </table>
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
const mapStateToProps = state => {
    console.log(JSON.stringify(state))
    return {
      profileStateStore: state.profile,
      loginStateStore: state.login
    }
  }

  export default connect(mapStateToProps, { getProfileInformation})(MessageSent);