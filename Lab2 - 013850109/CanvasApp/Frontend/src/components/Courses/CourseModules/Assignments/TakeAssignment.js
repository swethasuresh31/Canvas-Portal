import React, { Component } from 'react';
import Navbar from '../../../LandingPage/Navbar';
import CourseNav from '../CourseNav';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import styled from "styled-components";
import axios from 'axios';
import { Breadcrumb, BreadcrumbLink } from '@instructure/ui-breadcrumb'
import Cookies from 'universal-cookie';
import DatePicker from "react-datepicker";
import { IconAssignmentLine, IconAddLine } from '@instructure/ui-icons'
import "react-datepicker/dist/react-datepicker.css";
import FormData from 'form-data'
import { Button } from '@instructure/ui-buttons'

import { getCourseHome } from '../../../../js/actions/CourseHomeAction';
import { connect } from 'react-redux';


const cookies = new Cookies();

class TakeAssignment extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            dueDate: new Date(),
            redirectVar: '',
            assignmentInfo: '',
            assignmentFile: null,
            errorMsg: '',
            questions: [],
            answers: [],
            course: ''
        };
        this.fileInput = React.createRef();
        this.onSubmit = this.onSubmit.bind(this);
    }

    async componentWillMount() {
        await this.props.getCourseHome(this.props.match.params.courseUid);
        console.log("course: " + this.props.courseHomeStateStore.result.data)
        const result = this.props.courseHomeStateStore.result.data;
        this.setState({
            course: result
        })
        this.state.course.assignments.map(assignment => {
            if (assignment._id === this.props.match.params.assignmentUid) {
                this.setState({
                    assignmentInfo: assignment,
                })

            }
        })
    }

    evaluatePoints = () => {
        let points = 0;
        let i = 0;
        for (; i < this.state.questions.length; i++) {
            if (this.state.questions[i].answer === this.state.answers[i]) points++;
        }
        return points;
    }


    onSubmit(e) {
        e.preventDefault();
        console.log(this.fileInput.current.files[0])
        if (this.fileInput.current.files[0] !== undefined) {
            console.log(this.fileInput.current.files[0])
            let filename = this.props.match.params.courseUid + '-' + this.state.assignmentInfo.name + '-' + localStorage.user + '-' + this.fileInput.current.files[0].name
            console.log(filename)
            let data = new FormData();
            data.append('file', this.fileInput.current.files[0], filename)
            console.log(data)
            let assignmentsPage = "/coursedetails/" + this.props.match.params.courseUid + "/assignments";
            //adds the assignment based on information entered
            axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
            axios.post('http://localhost:3001/assignment/' + this.props.match.params.courseUid + '/' + this.state.assignmentInfo.name, data)
                .then((response) => {
                    console.log(response);
                    if (response !== undefined)
                        if (response.status === 200) {
                            this.setState({
                                redirectVar: <Redirect to={assignmentsPage} />
                            })
                        }
                })
        } else {
            this.setState({
                errorMsg: 'Please select file to submit'
            })
        }
    }


    render() {
        let homePath = "/coursedetails/" + this.state.course._id + "/home";
        let path1 = "/coursedetails/" + this.state.course._id + "/assignments";
        let courseName = this.state.course.course_term + ': ' + this.state.course.course_dept_code + ' - ' + this.state.course.course_id + ' - ' + this.state.course.course_name

        if (localStorage.role === 'faculty') {
            let announcementsPage = "/coursedetails/" + this.props.match.params.courseUid + "/assignments";
            return (<div><Redirect to={announcementsPage} /></div>);
        }
        else if (localStorage.role === 'student') {
            return (
                <div className="container-fluid md-0 p-0">
                    {this.state.redirectVar}
                    <div className="row">
                        <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                            <Navbar selected="courses" />
                        </div>
                        <div className="col">
                            <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">
                                <Breadcrumb size="large">
                                    <BreadcrumbLink href={homePath}>{courseName}</BreadcrumbLink>
                                    <BreadcrumbLink href={path1}>Assignments</BreadcrumbLink>
                                    <BreadcrumbLink>{this.state.assignmentInfo.name}</BreadcrumbLink>
                                </Breadcrumb>
                            </Heading>
                            <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="assignments" />
                                </div>

                                <div className="col">
                                    <br />
                                    <div class="row">
                                        <div class="col">
                                            <div class="row">
                                                <div class="col">
                                                    <br /><Heading theme={{ borderPadding: "1rem", h2FontWeight: "700" }} border="bottom">{this.state.assignmentInfo.name}</Heading>
                                                </div>
                                            </div>
                                            <div class="row m-1 p-1" style={{ borderBottom: "1px solid #ccc" }}>
                                                <p class="font-weight-bold pr-2">Due&nbsp;</p>
                                                <p class="font-weight-normal pr-5">{this.state.assignmentInfo.due_date}</p>
                                                <p class="font-weight-bold pr-2">Points&nbsp;</p>
                                                <p class="font-weight-normal pr-5">{this.state.assignmentInfo.total_points}</p>
                                            </div>
                                            <div class="row mt-2 ml-1 pb-3" style={{ borderBottom: "1px solid #ccc" }}>
                                                <div class="col">
                                                    <pre style={{ fontFamily: "inherit" }}>{this.state.assignmentInfo.instructions}</pre>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <form>
                                        <div class="row m-1">
                                            <div class="col-8">
                                                <input type="file" name="assignmentFile" id="assignmentFile" ref={this.fileInput}></input>
                                                <div>{this.state.errorMsg}</div><br />
                                                <div class="row input-group mb-3 justify-content-center">
                                                    <button type="button" class="btn btn-primary btn-md mx-2" style={{ backgroundColor: '#0055a2' }} onClick={this.onSubmit} >Submit Assignment</button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
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
const mapStateToProps = state => {
    console.log(JSON.stringify(state))
    return {
      courseHomeStateStore: state.courseHome,
      courseStateStore: state.course,
      profileStateStore: state.profile,
      loginStateStore: state.login
    }
  }
  
  //export default Profile;
  export default connect(mapStateToProps, { getCourseHome })(TakeAssignment);