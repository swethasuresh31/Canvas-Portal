import React, { Component } from 'react';
import { Table } from '@instructure/ui-elements'
import axios from 'axios';
import cookie from 'react-cookies';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default class CourseCard extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {

        };
        this.onAdd = this.onAdd.bind(this);
    }

    onAdd(courseId) {
        let data = {
            userId: cookies.get('cookieS'),
            courseId: courseId
        }
        //retrieves the courses based on information entered
        axios.put('http://localhost:3001/usercourse',data)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    if(response.status === 200) {
                        //Redirect to all courses
                    }
            })

    }

    render() {
        this.props.courses.map(course =>
           console.log(course.course_term) 
          )
        return (
            <div className="col">
            {this.props.courses.map(course => {course.course_term})}
                <Table caption="" >
                    <thead>
                        <tr>
                            <th>Course</th>
                            <th>Course Term</th>
                            <th>Days & Times</th>
                            <th>Room</th>
                            <th>Instructor</th>
                            <th>Enrolled</th>
                            <th>Waitlist</th>
                            <th>Add Course</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.courses.map(course => {
                                return (
                                    <tr>
                                        <td>{course.course_dept_code}-{course.course_id} - {course.course_name}</td>
                                        <td>{course.course_term}</td>
                                        <td>{course.course_dayandtime}</td>
                                        <td>{course.course_room}</td>
                                        <td>{course.course_instructor}</td>
                                        <td>{course.total_enrollment} out of {course.course_capacity}</td>
                                        <td>{course.total_waitlist} out of {course.waitlist_capacity}</td>
                                        <td><div class="row input-group mb-3 justify-content-center">
                                        <button type="button" class="btn btn-primary btn-lg mx-2" onClick={this.onAdd(course.course_uid)} >Add</button>
                                    </ div></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </Table>
            </div>
        );
    }
}