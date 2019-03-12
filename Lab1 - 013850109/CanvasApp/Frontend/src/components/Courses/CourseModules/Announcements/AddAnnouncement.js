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


const cookies = new Cookies();

export default class AddAnnouncement extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            redirectVar: '',
            subject: '',
            body: ''
        };
        this.onAdd = this.onAdd.bind(this);
    }

    onAdd(courseId, courseTerm, courseNumber, courseDept, courseName) {

        this.setState({
            redirectVar: <Redirect to={{
                pathname: '/enrollCourse',
                course: {
                    course_uid: courseId,
                    course_term: courseTerm,
                    course_dept_code: courseDept,
                    course_id: courseNumber,
                    course_name: courseName
                }
            }}
            />
        })
        this.subjectChangeHandler = this.subjectChangeHandler.bind(this);
        this.bodyChangeHandler = this.bodyChangeHandler.bind(this);
    }

    clearForm = () => {
        this.setState({
            subject: '',
            body: ''
        })
    }

    subjectChangeHandler = (e) => {
        this.setState({
            subject: e.target.value,
            errorMsg: ''
        })
    }

    bodyChangeHandler = (e) => {
        this.setState({
            body: e.target.value,
            errorMsg: ''
        })
    }

    validate = () => {
        if ((this.state.subject === '')) {
            this.setState({ errorMsg: '*Please enter a subject' })
            return false;
        }
        if ((this.state.body === '')) {
            this.setState({ errorMsg: '*Please enter message body' })
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
        let data = {
            subject: this.state.subject,
            body: this.state.body
        }
        let announcementsPage = "/coursedetails/" + this.props.match.params.courseUid + "/announcements";
        //retrieves the courses based on information entered
        axios.post('http://localhost:3001/announcement/' + this.props.match.params.courseUid, data)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    if (response.status === 200) {
                        this.setState({
                            redirectVar: <Redirect to={announcementsPage} />
                        })
                        console.log(this.state.redirectVar);
                    }
            })
    }


    render() {
        if (cookie.load('cookieF')) {
            return (
                <div className="container-fluid md-0 p-0">
                    {this.state.redirectVar}
                    <div className="row">
                        <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                            <Navbar selected="courses" />
                        </div>
                        <div className="col">
                            <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">Add Announcement</Heading>
                            <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="announcements" />
                                </div>

                                <div className="col">
                                    <br />
                                    <div class="row justify-content-md-center">
                                        <div class="col-6">
                                            <form>
                                                <div class="dropdown mb-3">
                                                    <div class="row input-group mb-3">
                                                        <div class="input-group-prepend">
                                                            <label class="input-group-text" for="inputGroupSelect05">Subject</label>
                                                        </div>
                                                        <input type="text" class="form-control" value={this.state.subject} onChange={this.subjectChangeHandler} />
                                                    </div>
                                                    <div class="row input-group mb-3">
                                                        <textarea class="form-control" id="inputGroupSelect05" rows="5" value={this.state.body} onChange={this.bodyChangeHandler} />
                                                    </div>
                                                    <div>{this.state.errorMsg}</div><br />
                                                    <div class="row input-group mb-3 justify-content-center">
                                                        <button type="button" class="btn btn-secondary btn-md mx-2" onClick={() => this.clearForm()}>Clear</button>
                                                        <button type="button" class="btn btn-primary btn-md mx-2" style={{ backgroundColor: '#0055a2' }} onClick={this.onAdd} >Add</button>
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
        else  if (cookie.load('cookieS')) {
            let announcementsPage = "/coursedetails/" + this.props.match.params.courseUid + "/announcements";
            return (<div><Redirect to={announcementsPage} /></div>);
        } else {
            return (<div><Redirect to="/login" /></div>);
        }
    }
}