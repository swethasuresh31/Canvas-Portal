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
import { IconSearchLine, IconAddLine, IconTrashLine } from '@instructure/ui-icons'

const cookies = new Cookies();

export default class StudentCourseLanding extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            user: cookies.get('cookieS')
        };
        this.onDrop = this.onDrop.bind(this);

    }

    onDrop(courseUid) {
        console.log("validated");
        console.log(this.state.searchOperand);
        this.setState({ errorMsg: '' })
        //drops the courses based on information entered
        axios.delete('http://localhost:3001/usercourse?user=' + encodeURI(this.state.user) + '&courseUid=' + courseUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({
                        searchResult: <CourseCard courses={response.data} />
                    })

            })

    }

    render() {

        return (
            <div id="wrapper" style={{ 'margin-left': 'auto', 'margin-right': 'auto', width: '100%', position: 'fixed' }}>
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
                                    <div class="float-right">
                                        <br /><a href="/enrollCourse" class="btn btn-primary btn-lg active  mx-3 px-2"  style={{backgroundColor:'#0055a2'}} role="button" aria-pressed="true"><IconAddLine /> Add Course</a>
                                        <a href="/searchCourse" class="btn btn-primary btn-lg active  mx-3 px-2"  style={{backgroundColor:'#0055a2'}} role="button" aria-pressed="true"><IconSearchLine /> Search Course</a>
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
                                            <th scope="col">Enrollment Status</th>
                                            <th scope="col">Drop</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.coursework.map(course => {
                                                let enrollmentStatus = (course.isWaitlist !== 0) ? "Waitlist" : "Enrolled";
                                                return (
                                                    <tr>
                                                        <td>{course.course_dept_code}-{course.course_id} - {course.course_name}</td>
                                                        <td>{course.course_term}</td>
                                                        <td>{enrollmentStatus}</td>
                                                        <td>
                                            <button type="button" class="btn btn-danger mx-2" onClick={() => this.onDrop(course.course_uid)} ><IconTrashLine /> Drop</button>
                                        </td>
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