import React, { Component } from 'react';
import Navbar from '../LandingPage/Navbar';
import { Table } from '@instructure/ui-elements';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { IconSearchLine, IconAddLine, IconTrashLine } from '@instructure/ui-icons';

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

    onDrop(courseUid, enrollmentStatus) {
        console.log("validated");
        console.log(this.state.searchOperand);
        this.setState({ errorMsg: '' })
        //drops the courses based on information entered
        axios.delete('http://localhost:3001/usercourse?user=' + encodeURI(this.state.user) + '&courseUid=' + courseUid + '&status=' + enrollmentStatus)
            .then((response) => {
                console.log(response);
                if (response !== undefined && response.status === 200)
                    this.props.removeCourseRow(courseUid)
            })

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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.coursework.map(course => {
                                                console.log("Waitlist status" + course.is_waitlist)
                                                let enrollmentStatus = (course.is_waitlist !== false) ? "Waitlist" : "Enrolled";
                                                let linkpath = (course.is_waitlist !== false) ? '#' : '/coursedetails/' + course.course_uid;
                                                return (
                                                    <tr>
                                                        <td>{course.course_dept_code}-{course.course_id} - {course.course_name}</td>
                                                        <td>{course.course_term}</td>
                                                        <td>{enrollmentStatus}</td>
                                                        
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