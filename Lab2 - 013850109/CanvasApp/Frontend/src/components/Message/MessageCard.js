import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Avatar, Text, Table } from '@instructure/ui-elements'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { IconAddLine } from '@instructure/ui-icons'


const cookies = new Cookies();

export default class MessageCard extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            redirectVar: '',
        };
    }
    render() {
        //let announcementPath="/coursedetails/"+this.props.courseUid+"/announcement/"+this.props.announcement._id
        //let announcement = this.props.announcement
        let profileImg = "http://localhost:3001/img/" + encodeURI(this.props.message.sender)
        let displaytext = (this.props.message.body.length < 100) ? this.props.message.body : this.props.message.body.substring(0,100)+'...'
        return (
                <tr>
                    <td style={{verticalAlign:"middle", width:"100px", maxWidth:"100px"}}><Avatar src={profileImg} name={this.props.message.sender} size="medium" /></td>
                    <td>
                    <p><Link to="#" class="font-weight-bold">{this.props.message.subject}</Link><span class="font-weight-light float-right">{new Date(this.props.message.timestamp).toISOString().slice(0, 16).replace('T', ' ')}</span></p>
                    <p>{displaytext}</p>
                    </td>
                </tr>
        );
    }
}