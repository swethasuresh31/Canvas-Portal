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

const cookies = new Cookies();

export default class CourseDetails extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            selectedPath: "1",
            coursework: []
        };
    }

    componentDidMount() {
        let user = cookies.get('cookieS') || cookies.get('cookieF');
        console.log(user + "UserName")

        axios.get('http://localhost:3001/coursehome/' + user)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ coursework: response.data })
            })

    }

    onItemSelection = arg => {
        this.setState({ selectedPath: arg.path });
    };

    render() {
        let redirectVar = null;
        if (cookie.load('cookieF')) {
            //Return faculty page
            return (
                <div>
                    {redirectVar}

                </div>
            );
        } else if (cookie.load('cookieS')) {
            //Return student page
            return (
                <div className="container-fluid md-0 p-0">
                    {redirectVar}
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
                                            this.state.coursework.map(course => {
                                                let enrollmentStatus = (course.isWaitlist !== 0) ? "Waitlist" : "Enrolled";
                                                return (
                                                    <tr>
                                                        <td>{course.course_dept}-{course.course_id} - {course.course_name}</td>
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

            );
        } else {
            return (<div><Redirect to="/login" /></div>);
        }
    }
}