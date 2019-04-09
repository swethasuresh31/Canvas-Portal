import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Avatar, Text, Table } from '@instructure/ui-elements'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { IconAddLine } from '@instructure/ui-icons'


const cookies = new Cookies();

export default class AnnouncementCard extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            redirectVar: '',
        };
    }
    render() {
        let announcementPath="/coursedetails/"+this.props.courseUid+"/announcement/"+this.props.announcement._id
        //let announcement = this.props.announcement
        let profileImg = "http://localhost:3001/img/" + encodeURI(this.props.announcement.created_by)
        let displaytext = (this.props.announcement.body.length < 100) ? this.props.announcement.body : this.props.announcement.body.substring(0,100)+'...'
        return (
                <tr>
                    <td style={{verticalAlign:"middle", width:"100px", maxWidth:"100px"}}><Avatar src={profileImg} name={this.props.announcement.created_by} size="medium" /></td>
                    <td>
                    <p><Link to={announcementPath} class="font-weight-bold">{this.props.announcement.header}</Link></p>
                    <p class="font-weight-light">{this.props.announcement.timestamp}</p>
                    <p>{displaytext}</p>
                    </td>
                </tr>
        );
    }
}