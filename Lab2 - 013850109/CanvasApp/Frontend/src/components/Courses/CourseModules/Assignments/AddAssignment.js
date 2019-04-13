import React, { Component } from 'react';
import Navbar from '../../../LandingPage/Navbar';
import CourseNav from '../CourseNav';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import styled from "styled-components";
import axios from 'axios'
import {rooturl} from '../../../../config/settings';
import { Breadcrumb, BreadcrumbLink } from '@instructure/ui-breadcrumb'
import Cookies from 'universal-cookie';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';

import { getCourseHome } from '../../../../js/actions/CourseHomeAction';
import { connect } from 'react-redux';


const cookies = new Cookies();

class AddAssignment extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            dueDate: new Date(),
            redirectVar: '',
            assignmentName: '',
            instructions: '',
            points: '',
            numQuestions: 0,
            questions: [],
            course: ''
        };
        this.assignmentNameChangeHandler = this.assignmentNameChangeHandler.bind(this);
        this.instructionsChangeHandler = this.instructionsChangeHandler.bind(this);
        this.pointsChangeHandler = this.pointsChangeHandler.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.dateChangeHandler = this.dateChangeHandler.bind(this);
    }

    dateChangeHandler(date) {
        this.setState({
            dueDate: date
        });
    }

    assignmentNameChangeHandler = (e) => {
        this.setState({
            assignmentName: e.target.value,
            errorMsg: ''
        })
    }

    pointsChangeHandler = (e) => {
        this.setState({
            points: e.target.value,
            errorMsg: ''
        })
    }

    instructionsChangeHandler = (e) => {
        this.setState({
            instructions: e.target.value,
            errorMsg: ''
        })
    }

    validate = () => {
        if ((this.state.assignmentName === '')) {
            this.setState({ errorMsg: '*Please enter a assignment name' })
            return false;
        }
        if ((this.state.instructions === '')) {
            this.setState({ errorMsg: '*Please enter assignment instructions' })
            return false;
        }
        return true;
    }

    onAdd(e) {
        e.preventDefault();
        console.log("validating");
        if (!this.validate()) return;
        console.log("validated");
        console.log('adding')
        let data = this.state
        console.log(data)
        let assignmentsPage = "/coursedetails/" + this.props.match.params.courseUid + "/assignments";
        //adds the assignment based on information entered
        axios.post('http://' + rooturl + ':3001/assignment/' + this.props.match.params.courseUid, data)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    if (response.status === 200) {
                        this.setState({
                            redirectVar: <Redirect to={assignmentsPage} />
                        })
                        console.log(this.state.redirectVar);
                    }
            })
    }

    async componentWillMount() {
        await this.props.getCourseHome(this.props.match.params.courseUid);
            console.log("course: " + this.props.courseHomeStateStore.result.data)   
            const result = this.props.courseHomeStateStore.result.data;
            this.setState({
                course: result,
            })
    }

    render() {
        let homePath = "/coursedetails/" + this.state.course._id + "/home";
        let path1 = "/coursedetails/" + this.state.course._id + "/assignments";
        let courseName = this.state.course.course_term + ': ' + this.state.course.course_dept_code + ' - ' + this.state.course.course_id + ' - ' + this.state.course.course_name
        
        if (localStorage.role === 'faculty') {
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
                                    <BreadcrumbLink>Add Assignment</BreadcrumbLink>
                                </Breadcrumb>
                            </Heading>
                             <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="assignments" />
                                </div>

                                <div className="col">
                                    <br />
                                    <div class="row">
                                        <div class="col-6">
                                            <form>
                                                <div class="dropdown mb-3">
                                                    <div class="row input-group mb-3">
                                                        <div class="input-group-prepend">
                                                            <label class="input-group-text" for="inputGroupSelect05">Assignment Name</label>
                                                        </div>
                                                        <input type="text" class="form-control" value={this.state.assignmentName} onChange={this.assignmentNameChangeHandler} />
                                                    </div>
                                                    <div class="row input-group mb-3">
                                                        <div class="input-group-prepend">
                                                            <label class="input-group-text" for="inputGroupSelect05">Points</label>
                                                        </div>
                                                        <input type="number" class="form-control" value={this.state.points} onChange={this.pointsChangeHandler} />
                                                    </div>
                                                    <div class="row input-group mb-3">
                                                        <div class="input-group-prepend">
                                                            <label class="input-group-text" for="inputGroupSelect05">Instructions</label>
                                                        </div>
                                                        <textarea class="form-control" id="inputGroupSelect05" rows="5" value={this.state.instructions} onChange={this.instructionsChangeHandler} />
                                                    </div>
                                                    <div class="row input-group mb-3">
                                                        <div class="input-group-prepend">
                                                            <label class="input-group-text" for="inputGroupSelect05">Due</label>
                                                        </div>
                                                        <DatePicker inline selected={this.state.dueDate} onChange={this.dateChangeHandler} />
                                                    </div>
                                                    <div>{this.state.errorMsg}</div><br />
                                                    <div class="row input-group mb-3 justify-content-center">
                                                        <button type="button" class="btn btn-primary btn-md mx-2" style={{ backgroundColor: '#0055a2' }} onClick={this.onAdd} >Add Assignment</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        else if (localStorage.role === 'student') { 
            let announcementsPage = "/coursedetails/" + this.props.match.params.courseUid + "/assignments";
            return (<div><Redirect to={announcementsPage} /></div>);
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
  export default connect(mapStateToProps, { getCourseHome })(AddAssignment);