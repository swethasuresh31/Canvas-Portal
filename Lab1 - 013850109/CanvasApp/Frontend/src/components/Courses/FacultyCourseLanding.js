import React, { Component } from 'react';
import { Grid, GridRow, GridCol } from '@instructure/ui-layout'
import theme from '@instructure/ui-themes/lib/canvas/base'
import Navbar from '../LandingPage/Navbar';
import { Redirect } from 'react-router';
import { Table } from '@instructure/ui-elements';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import cookie from 'react-cookies';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { IconAddLine } from '@instructure/ui-icons'
import { Link } from 'react-router-dom';

const cookies = new Cookies();

export default class FacultyCourseLanding extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            
        };
    }

    render() {
        
            return (
                <div id="wrapper" style={{ 'margin-left': 'auto', 'margin-right': 'auto', width: '100%', position: 'fixed' }}>
                <div className="container-fluid md-0 p-0">
                    <div className="row">
                    <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                            <Navbar selected="courses" />
                        </ div>
                        <div className="col">
                            <div className="row">
                                <div className="col">
                                    <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">All Courses</ Heading></div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div class="float-right">
                                        <br /><a href="/generatePermissionCode" class="btn btn-primary btn-md active  mx-3 px-2"  style={{backgroundColor:'#0055a2'}} role="button" aria-pressed="true">Generate Permission Code</a>
                                        <a href="/createCourse" class="btn btn-primary btn-md active  mx-3 px-2"  style={{backgroundColor:'#0055a2'}} role="button" aria-pressed="true"><IconAddLine /> Create Course</a>
                                        </div>
                                </div>
                            </div>
                            <br /><br />
                            <div className="row">
                                <Table
                                    layout="fixed"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">Course</th>
                                            <th scope="col">Term</th>
                                            <th scope="col">Enrollment</th>
                                            <th scope="col">Waitlist</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.coursework.map(course => {
                                                let linkpath = '/coursedetails/' + course.course_uid;
                                                return (
                                                    <tr>
                                                        <td><Link to={linkpath} >{course.course_dept_code}-{course.course_id} - {course.course_name}</Link></td>
                                                        <td>{course.course_term}</td>
                                                        <td>{course.total_enrollment} out of {course.course_capacity}</td>
                                                        <td>{course.total_waitlist} out of {course.waitlist_capacity}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            </ div>
                        </div>
                    </div>
                </div>
                </div>

            );
        
    }
}