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
        this.onAdd = this.onAdd.bind(this);
    }

    onAdd(courseId, courseTerm, courseNumber, courseDept, courseName) {

        this.setState({
            redirectVar: <Redirect to={{
                pathname: '/enrollCourse',
                course: {
                    course_uid: courseId,
                    course_term: courseTerm,
                    course_dept_code: courseDept,
                    course_id: courseNumber,
                    course_name: courseName
                }
            }}
            />
        })

    }

    render() {
        let announcementPath="/coursedetails/"+this.props.announcement.course_uid+"/announcement/"+this.props.announcement.announcement_uid
        let announcement = this.props.announcement
        let displaytext = (this.props.announcement.body.length < 100) ? this.props.announcement.body : this.props.announcement.body.substring(0,100)+'...'
        return (
                <tr>
                    <td style={{verticalAlign:"middle", width:"100px", maxWidth:"100px"}}><Avatar name={this.props.announcement.created_by} size="medium" /></td>
                    <td>
                    <p><Link to={announcementPath} class="font-weight-bold">{this.props.announcement.header}</Link></p>
                    <p class="font-weight-light">{this.props.announcement.announcement_TS}</p>
                    <p>{displaytext}</p>
                    </td>
                </tr>
        );
    }
}