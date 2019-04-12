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
import { Button } from '@instructure/ui-buttons'
import { Document, Page, pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;



const cookies = new Cookies();

export default class TakeAssignment extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            dueDate: new Date(),
            redirectVar: '',
            assignmentInfo: '',
            file: '',
            numPages: null,
            onDocumentLoadSuccess: null,
            shouldUpdate: true,
            totalPoints: 0,
            course: ''
        };
        this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
        this.onDocumentLoadError = this.onDocumentLoadError.bind(this);
        this.pointsOnChangeHandler = this.pointsOnChangeHandler.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    shouldComponentUpdate() {
        return this.state.shouldUpdate; // Will cause component to never re-render.
    }

    onDocumentLoadSuccess = (document) => {
        const { numPages } = document;
        if (this.state.numPages !== numPages)
            this.setState({
                numPages: numPages,
                errorMessage: ''
            });
    };

    onDocumentLoadError = (document) => {
            this.setState({
                errorMessage: 'No submission found for student: '
            });
    };

    pointsOnChangeHandler = (e) => {
        this.state.totalPoints = e.target.value
    }

    componentWillMount() {
        let fileURL = 'http://localhost:3001/studentassignment/file/' + this.props.match.params.courseUid + '/' + this.props.match.params.assignmentUid + '/' + encodeURI(this.props.match.params.user);
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
        axios.get('http://localhost:3001/studentassignment/' + this.props.match.params.courseUid + '/' + this.props.match.params.assignmentUid + '/' + encodeURI(this.props.match.params.user))
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({
                        assignmentInfo: response.data[0],
                        file: fileURL
                    })
            })
            axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
        axios.get('http://localhost:3001/course/' + this.props.match.params.courseUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ course: response.data })
            })
    }

    onSubmit(e) {
        e.preventDefault();
        let data = {
            scoredPoints: this.state.totalPoints,
            assignmentInfo: this.state.assignmentInfo
        }
        console.log(data)
        let assignmentsPage = "/coursedetails/" + this.props.match.params.courseUid + "/assignments/submissions/" + this.props.match.params.assignmentUid;
        //adds the assignment based on information entered
        axios.post('http://localhost:3001/studentassignment/' + this.props.match.params.courseUid + '/' + this.props.match.params.assignmentUid + '/' + encodeURI(this.state.assignmentInfo.student_emailId), data)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    if (response.status === 200) {
                        this.setState({
                            redirectVar: <Redirect to={assignmentsPage} />
                        })
                    }
            })
    }


    render() {
        let homePath = "/coursedetails/" + this.props.match.params.courseUid + "/home";
        let path1 = "/coursedetails/" + this.props.match.params.courseUid + "/grades";
        let path2 = "/coursedetails/" + this.props.match.params.courseUid + "/assignments/submissions/" + this.props.match.params.assignmentUid;
        let courseName = this.state.course.course_term + ': ' + this.state.course.course_dept_code + ' - ' + this.state.course.course_id + ' - ' + this.state.course.course_name

        if (localStorage.role === 'student') {
            let announcementsPage = "/coursedetails/" + this.props.match.params.courseUid + "/assignments";
            return (<div><Redirect to={announcementsPage} /></div>);
        }
        else if (localStorage.role === 'faculty') {
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
                                    <BreadcrumbLink href={path1}>Grades</BreadcrumbLink>
                                    <BreadcrumbLink href={path2}>{this.state.assignmentInfo.assignment_name}</BreadcrumbLink>
                                    <BreadcrumbLink>{this.props.match.params.user}</BreadcrumbLink>
                                </Breadcrumb>
                            </Heading>
                            <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="grades" />
                                </div>
                                <div className="col">
                                    <br />
                                    <div class="row">
                                        <div class="col">
                                            <Document
                                                file={{ url: this.state.file }}
                                                onLoadSuccess={this.onDocumentLoadSuccess}
                                                onLoadError = {this.onDocumentLoadError}
                                            >
                                                {Array.from(
                                                    new Array(this.state.numPages),
                                                    (el, index) => (
                                                        <Page
                                                            pageNumber={index + 1}
                                                        />
                                                    ),
                                                )}
                                            </Document>
                                            {this.state.errorMessage}
                                        </div>
                                        <div class="col-3 border-left">
                                            <form>
                                                <p class="font-weight-bold">Assessment</p>
                                                <p class="font-weight-normal">Grade out of {this.state.assignmentInfo.assignment_total}</p>
                                                <input type="number" onChange={this.pointsOnChangeHandler} />
                                                <div>{this.state.errorMsg}</div><br />
                                                <button type="button" class="btn btn-primary btn-md mx-2" style={{ backgroundColor: '#0055a2' }} onClick={this.onSubmit} >Submit</button>
                                            </form>
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