import React, { Component } from 'react';
import Navbar from '../../../LandingPage/Navbar';
import CourseNav from '../CourseNav';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import styled from "styled-components";
import axios from 'axios';
import { Avatar, Text, Table } from '@instructure/ui-elements'
import Cookies from 'universal-cookie';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from 'react-router-dom';


const cookies = new Cookies();

export default class AddAssignment extends Component {

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
            course: []
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
        axios.post('http://localhost:3001/assignment/' + this.props.match.params.courseUid, data)
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

    componentWillMount() {
        axios.get('http://localhost:3001/course/' + this.props.match.params.courseUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ course: response.data[0] })
            })
    }

    render() {
        let homePath = "/coursedetails/" + this.state.course.course_uid + "/home";

        if (cookie.load('cookieF')) {
            return (
                <div className="container-fluid md-0 p-0">
                    {this.state.redirectVar}
                    <div className="row">
                        <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                            <Navbar selected="courses" />
                        </div>
                        <div className="col">
                            <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom"><Link to={homePath} >{this.state.course.course_term}: {this.state.course.course_dept_code} - {this.state.course.course_id} - {this.state.course.course_name}</Link></Heading>
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
        else if (cookie.load('cookieS')) {
            let announcementsPage = "/coursedetails/" + this.props.match.params.courseUid + "/announcements";
            return (<div><Redirect to={announcementsPage} /></div>);
        } else {
            return (<div><Redirect to="/login" /></div>);
        }
    }
}