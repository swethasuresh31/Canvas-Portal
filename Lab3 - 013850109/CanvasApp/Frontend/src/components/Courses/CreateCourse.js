import React, { Component } from 'react';
import Navbar from '../LandingPage/Navbar';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import { createCourse } from '../mutations/mutations';
import { graphql } from 'react-apollo';



class CreateCourse extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            courseInstructor: localStorage.firstName + " " + localStorage.lastName,
            courseDeptCode: '',
            courseId: '',
            courseName: '',
            courseDept: '',
            courseDesc: '',
            courseRoom: '',
            courseCapacity: '',
            waitlistCapacity: '',
            courseTerm: '',
            courseSyllabus: '',
            courseDayAndTime: ''

        };
        //Bind the handlers to this class
        this.courseDeptCodeChangeHandler = this.courseDeptCodeChangeHandler.bind(this);
        this.courseDeptChangeHandler = this.courseDeptChangeHandler.bind(this);
        this.courseIdChangeHandler = this.courseIdChangeHandler.bind(this);
        this.courseNameChangeHandler = this.courseNameChangeHandler.bind(this);
        this.courseDescChangeHandler = this.courseDescChangeHandler.bind(this);
        this.courseRoomChangeHandler = this.courseRoomChangeHandler.bind(this);
        this.courseCapacityChangeHandler = this.courseCapacityChangeHandler.bind(this);
        this.waitlistCapacityChangeHandler = this.waitlistCapacityChangeHandler.bind(this);
        this.courseTermChangeHandler = this.courseTermChangeHandler.bind(this);
        this.courseSyllabusChangeHandler = this.courseSyllabusChangeHandler.bind(this);
        this.courseDayAndTimeChangeHandler = this.courseDayAndTimeChangeHandler.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.clearForm = this.clearForm.bind(this);
    }
    //course dept code change handler to update state variable with the text entered by the user
    courseDeptCodeChangeHandler = (e) => {
        this.setState({
            courseDeptCode: e.target.value,
            errorMsg: ''
        })
    }

    //department change handler to update state variable with the text entered by the user
    courseDeptChangeHandler = (e) => {
        this.setState({
            courseDept: e.target.value,
            errorMsg: ''
        })
    }

    //courseId change handler to update state variable with the text entered by the user
    courseIdChangeHandler = (e) => {
        this.setState({
            courseId: e.target.value,
            errorMsg: ''
        })
    }

    //course name change handler to update state variable with the text entered by the user
    courseNameChangeHandler = (e) => {
        this.setState({
            courseName: e.target.value,
            errorMsg: ''
        })
    }

    //course description change handler to update state variable with the text entered by the user
    courseDescChangeHandler = (e) => {
        this.setState({
            courseDesc: e.target.value,
            errorMsg: ''
        })
    }

    //course room change handler to update state variable with the text entered by the user
    courseRoomChangeHandler = (e) => {
        this.setState({
            courseRoom: e.target.value,
            errorMsg: ''
        })
    }

    //course capacity change handler to update state variable with the text entered by the user
    courseCapacityChangeHandler = (e) => {
        this.setState({
            courseCapacity: e.target.value,
            errorMsg: ''
        })
    }

    //waitlist capacity change handler to update state variable with the text entered by the user
    waitlistCapacityChangeHandler = (e) => {
        this.setState({
            waitlistCapacity: e.target.value,
            errorMsg: ''
        })
    }

    //course term change handler to update state variable with the text entered by the user
    courseTermChangeHandler = (e) => {
        this.setState({
            courseTerm: e.target.value,
            errorMsg: ''
        })
    }

    //course syllabus change handler to update state variable with the text entered by the user
    courseSyllabusChangeHandler = (e) => {
        this.setState({
            courseSyllabus: e.target.value,
            errorMsg: ''
        })
    }

    //course day and time change handler to update state variable with the text entered by the user
    courseDayAndTimeChangeHandler = (e) => {
        this.setState({
            courseDayAndTime: e.target.value,
            errorMsg: ''
        })
    }

    clearForm = () => {
        this.setState({
            courseDeptCode: '',
            courseId: '',
            courseName: '',
            courseDept: '',
            courseDesc: '',
            courseRoom: '',
            courseCapacity: '',
            waitlistCapacity: '',
            courseTerm: '',
            courseSyllabus: '',
            courseDayAndTime: ''
        })
    }

    componentWillMount() {
    }

    validate = () => {
        if (this.state.courseDeptCode === '') {
            this.setState({ errorMsg: '*Please enter a department code' })
            return false;
        }

        if (this.state.courseDept === '') {
            this.setState({ errorMsg: '*Please enter a department' })
            return false;
        }

        if (this.state.courseId === '') {
            this.setState({ errorMsg: '*Please enter a course id' })
            return false;
        }

        if (this.state.courseName === '') {
            this.setState({ errorMsg: '*Please enter a course name' })
            return false;
        }

        if (this.state.courseDesc === '') {
            this.setState({ errorMsg: '*Please enter a course description' })
            return false;
        }

        if (this.state.courseRoom === '') {
            this.setState({ errorMsg: '*Please enter a course room' })
            return false;
        }
        if (this.state.courseDayAndTime === '') {
            this.setState({ errorMsg: '*Please enter day and time for course' })
            return false;
        }

        if (this.state.courseCapacity === '') {
            this.setState({ errorMsg: '*Please enter a course capacity' })
            return false;
        }

        if (this.state.waitlistCapacity === '') {
            this.setState({ errorMsg: '*Please enter a waitlist capacity' })
            return false;
        }

        if (this.state.courseTerm === '') {
            this.setState({ errorMsg: '*Please enter a course term' })
            return false;
        }

        if (this.state.courseSyllabus === '') {
            this.setState({ errorMsg: '*Please enter a course syllabus' })
            return false;
        }

        return true;
    }


    onCreate(e) {
        e.preventDefault();
        console.log("validating");
        if (!this.validate()) return;
        console.log("validated");

        this.setState({ errorMsg: '' })

        if (localStorage.isStudent === "0") {
            this.props.createCourse({
                variables: {
                    username: localStorage.emailId,
                    course_instructor: this.state.courseInstructor,
                    course_dept_code: this.state.courseDeptCode,
                    course_id: parseInt(this.state.courseId, 10),
                    course_name: this.state.courseName,
                    course_dept: this.state.courseDept,
                    course_desc: this.state.courseDesc,
                    course_room: this.state.courseRoom,
                    course_capacity: parseInt(this.state.courseCapacity, 10),
                    waitlist_capacity: parseInt(this.state.waitlistCapacity, 10),
                    course_term: this.state.courseTerm,
                    course_syllabus: this.state.courseSyllabus,
                    course_dayandtime: this.state.courseDayAndTime
                }
            }).then((response) => {
                console.log('Response', response.data);
                if (response.data.createCourse.success === true) {
                    this.setState({
                        errorMsg: '',
                        redirectVar: <Redirect to="/coursehome" />
                    });
                } else {
                    this.setState({
                        errorMsg: 'Course Already exists'
                    })
                }
            });
        }
    
    }

    render() {

        return (

            <div className="container-fluid md-0 p-0">
                {this.state.redirectVar}
                <div className="row">
                    <div className="col col-md-1">
                        <Navbar selected="courses" />
                    </ div>
                    <div className="col">
                        <div className="row">
                            <div className="col">
                                <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">Create Course</ Heading></div>
                        </div>
                        <br /><br />
                        <div className="row d-flex justify-content-center">
                            <form>
                                <div class="row input-group mb-3 px-3">
                                    <div class="input-group-prepend" >
                                        <label class="input-group-text" for="inputGroupSelect05">Course Instructor</label>
                                    </div>
                                    <input type="text" class="form-control" value={this.state.courseInstructor} readOnly />
                                </div>
                                <div class="row input-group mb-3 px-3">
                                    <div class="input-group-prepend">
                                        <label class="input-group-text" for="inputGroupSelect05">Course Department Code</label>
                                    </div>
                                    <input type="text" class="form-control" value={this.state.courseDeptCode} onChange={this.courseDeptCodeChangeHandler} />
                                    <div class="input-group-prepend">
                                        <label class="input-group-text" for="inputGroupSelect05">Course Id</label>
                                    </div>
                                    <input type="text" class="form-control" value={this.state.courseId} onChange={this.courseIdChangeHandler} />
                                </div>
                                <div class="row input-group mb-3 px-3">
                                    <div class="input-group-prepend">
                                        <label class="input-group-text" for="inputGroupSelect05">Course Name</label>
                                    </div>
                                    <input type="text" class="form-control" value={this.state.courseName} onChange={this.courseNameChangeHandler} />
                                </div>
                                <div class="row input-group mb-3 px-3">
                                    <div class="input-group-prepend">
                                        <label class="input-group-text" for="inputGroupSelect05">Course Department</label>
                                    </div>
                                    <input type="text" class="form-control" value={this.state.courseDept} onChange={this.courseDeptChangeHandler} />
                                </div>
                                <div class="row input-group mb-3 px-3">
                                    <label class="input-group-text" for="exampleFormControlTextarea1">Course Description</label>
                                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={this.state.courseDesc} onChange={this.courseDescChangeHandler}></textarea>
                                </div>
                                <div class="row input-group mb-3 px-3">
                                    <div class="input-group-prepend">
                                        <label class="input-group-text" for="inputGroupSelect05">Course Room</label>
                                    </div>
                                    <input type="text" class="form-control" value={this.state.courseRoom} onChange={this.courseRoomChangeHandler} />
                                </div>
                                <div class="row input-group mb-3 px-3">
                                    <div class="input-group-prepend">
                                        <label class="input-group-text" for="inputGroupSelect05">Course Day/Time</label>
                                    </div>
                                    <input type="text" class="form-control" value={this.state.courseDayAndTime} onChange={this.courseDayAndTimeChangeHandler} />
                                </div>
                                <div class="row input-group mb-3 px-3">
                                    <div class="input-group-prepend">
                                        <label class="input-group-text" for="inputGroupSelect05">Course Capacity</label>
                                    </div>
                                    <input type="number" class="form-control" value={this.state.courseCapacity} onChange={this.courseCapacityChangeHandler} />
                                    <div class="input-group-prepend">
                                        <label class="input-group-text" for="inputGroupSelect05">Waitlist Capacity</label>
                                    </div>
                                    <input type="number" class="form-control" value={this.state.waitlistCapacity} onChange={this.waitlistCapacityChangeHandler} />
                                </div>
                                <div class="row input-group mb-3 px-3">
                                    <div class="input-group-prepend">
                                        <label class="input-group-text" for="inputGroupSelect05">Course Term</label>
                                    </div>
                                    <input type="text" class="form-control" value={this.state.courseTerm} onChange={this.courseTermChangeHandler} />
                                </div>
                                <div class="row input-group mb-3 px-3">
                                    <label class="input-group-text" for="exampleFormControlTextarea1">Course Syllabus</label>
                                    <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" value={this.state.courseSyllabus} onChange={this.courseSyllabusChangeHandler}></textarea>
                                </div>
                                <div>{this.state.errorMsg}</div><br />
                                <div class="row input-group mb-3 justify-content-center">
                                    <button type="button" class="btn btn-secondary btn-md mx-2" onClick={() => this.clearForm()}>Cancel</button>
                                    <button type="button" class="btn btn-primary btn-md mx-2" style={{ backgroundColor: '#0055a2' }} onClick={this.onCreate} >Create Course</button>
                                </ div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>

        );
    }
}

export default graphql(createCourse, { name: "createCourse" })(CreateCourse);
