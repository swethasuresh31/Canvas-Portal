import React, { Component } from 'react';
import Navbar from '../../LandingPage/Navbar';
import CourseNav from './CourseNav';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import styled from "styled-components";
import { Link } from 'react-router-dom';
import axios from 'axios';


import {
    AppContainer as BaseAppContainer,
    ExampleNavigation as Navigation,
    ExampleBody as Body
} from "./CourseNavStyle.js";

const AppContainer = styled(BaseAppContainer)`
  height: calc(100vh - 40px);
  padding:20px;
`;

const themeCourse = {
    hoverBgColor: "#f5f5f5",
    selectionBgColor: "#f5f5f5",
    selectionIconColor: "#03A9F4"
};


export default class UserCourseHome extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
        };
    }

    componentWillMount() {
        axios.get('http://localhost:3001/course/' + this.props.match.params.courseUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ course: response.data })
            })
    }

    render() {
        let redirectVar = null;
        if (cookie.load('cookieF') || cookie.load('cookieS')) {
            //Return faculty page
            return (
                <div className="container-fluid md-0 p-0">
                    {redirectVar}
                    <div className="row">
                        <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                            <Navbar selected="courses" />
                        </div>
                        <div className="col">
                            <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">Home</Heading>
                            <div className="row">
                                <div className="col col-sm-2">
                                    <br />    <CourseNav courseUid={this.props.match.params.courseUid} selected="home" />
                                </div>

                                <div className="col">
                                <br />
                                <div className="row">
                                <div className="col">
                                <br /><Heading theme={{ borderPadding: "0.5rem" }} border="bottom">Course Details</Heading>
                                </div>
                                </div>
                                <div className="row">
                                
                                        <div class="container">
                                            <h2>{JSON.stringify(this.state.course)}</h2>
                                            <div class="panel panel-default">
                                                <div class="panel-heading">Panel Heading</div>
                                                <div class="panel-body">Panel Content</div>
                                            </div>
                                        </div>
                                        <div className="row d-flex justify-content-center">
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
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                   
            );
        } else {
            return (<div><Redirect to="/login" /></div>);
        }
    }
}