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

const cookies = new Cookies();

export default class StudentCourseLanding extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            
        };
    }

    render() {
        
            return (
                <div className="container-fluid md-0 p-0">
                    <div className="row">
                        <div className="col col-md-1">
                            <Navbar selected="courses" />
                        </ div>
                        <div className="col">
                            <div className="row">
                                <div className="col">
                                    <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">All Courses</ Heading></div>
                            </div>
                            <div className="row">
                            <div className="col">
                            <div class="text-right">
                            <br /><a href="/searchCourse" class="btn btn-primary btn-lg active" role="button" aria-pressed="true"><IconAddLine /> Search Course</a>
                            </div>
                            </div>
                            </div>
                            <div className="row">
                                <Table
                                    layout="fixed"
                                >
                                    <thead>
                                        <tr>
                                            <th scope="col">Course</th>
                                            <th scope="col">Term</th>
                                            <th scope="col">Total Enrollment</th>
                                            <th scope="col">Total Waitlist</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.coursework.map(course => {
                                                return (
                                                    <tr>
                                                        <td>{course.course_dept}-{course.course_id} - {course.course_name}</td>
                                                        <td>{course.course_term}</td>
                                                        <td>{course.total_enrollment}</td>
                                                        <td>{course.total_waitlist}</td>
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

            );
        
    }
}