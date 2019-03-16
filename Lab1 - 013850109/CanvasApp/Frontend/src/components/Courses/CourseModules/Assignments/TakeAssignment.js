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
import { IconAssignmentLine, IconAddLine } from '@instructure/ui-icons'
import "react-datepicker/dist/react-datepicker.css";
import FormData from 'form-data'
import { Button } from '@instructure/ui-buttons'


const cookies = new Cookies();

export default class TakeAssignment extends Component {

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
            answers: []
        };
        this.fileInput=React.createRef();
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        axios.get('http://localhost:3001/assignment/' + this.props.match.params.courseUid + '/' + this.props.match.params.assignmentUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ assignmentInfo: response.data[0], errorMsg: '' })
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
        if(this.fileInput.current.files[0] !== undefined) {
            console.log(this.fileInput.current.files[0])
        let filename=this.props.match.params.courseUid + '-' + this.state.assignmentInfo.coursework_uid + '-' + encodeURI(cookies.get('cookieS')) + '.' + this.fileInput.current.files[0].name.split('.').pop();
        console.log(filename)
        let data = new FormData();
        data.append('file', this.fileInput.current.files[0], filename)
        console.log(data)
        let assignmentsPage = "/coursedetails/" + this.props.match.params.courseUid + "/assignments";
        //adds the assignment based on information entered
        axios.post('http://localhost:3001/assignment/' + this.props.match.params.courseUid + '/' + this.state.assignmentInfo.coursework_uid + '/' + cookies.get('cookieS'), data)
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
        if (cookie.load('cookieF')) {
            let announcementsPage = "/coursedetails/" + this.props.match.params.courseUid + "/assignments";
            return (<div><Redirect to={announcementsPage} /></div>);
        }
        else if (cookie.load('cookieS')) {
            return (
                <div className="container-fluid md-0 p-0">
                    {this.state.redirectVar}
                    <div className="row">
                        <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                            <Navbar selected="courses" />
                        </div>
                        <div className="col">
                            <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">Assignment</Heading>
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
                                                    <br /><Heading theme={{ borderPadding: "1rem", h2FontWeight: "700" }} border="bottom">{this.state.assignmentInfo.coursework_name}</Heading>
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