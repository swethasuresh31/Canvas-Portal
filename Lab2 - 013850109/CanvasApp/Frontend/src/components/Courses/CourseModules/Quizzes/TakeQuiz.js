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
import { IconQuizLine, IconAddLine } from '@instructure/ui-icons'
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '@instructure/ui-buttons';
import { Link } from 'react-router-dom';


const cookies = new Cookies();

export default class TakeQuiz extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            dueDate: new Date(),
            redirectVar: '',
            quizInfo: '',
            questions: [],
            answers: [],
            course: ''
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    answerChangeHandler = (questionNumber, e) => {
        this.state.answers[questionNumber - 1] = this.state.questions[questionNumber - 1][e.target.value];
        this.forceUpdate()
    }

    componentWillMount() {
        axios.get('http://localhost:3001/quiz/' + this.props.match.params.courseUid + '/' + this.props.match.params.quizUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ quizInfo: response.data[0] })
            })
            .then(
                axios.get('http://localhost:3001/quiz/' + this.props.match.params.courseUid + '/questions/' + this.props.match.params.quizUid)
                    .then((response) => {
                        console.log(response);
                        if (response !== undefined)
                            this.setState({ questions: response.data, answers: new Array(response.data.length) }, () => this.state.answers.fill(''));
                    })
            )
            axios.get('http://localhost:3001/course/' + this.props.match.params.courseUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ course: response.data[0] })
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
        let points = this.evaluatePoints();
        let data = {
            user: cookies.get('cookieS'),
            totalPoints: points
        }
        console.log(data)
        let quizzesPage = "/coursedetails/" + this.props.match.params.courseUid + "/quizzes";
        //adds the quiz based on information entered
        axios.post('http://localhost:3001/quiz/' + this.props.match.params.courseUid + '/' + this.state.quizInfo.coursework_uid, data)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    if (response.status === 200) {
                        this.setState({
                            redirectVar: <Redirect to={quizzesPage} />
                        })
                    }
            })
    }


    render() {
        console.log(this.state.questions)
        let homePath = "/coursedetails/" + this.state.course.course_uid + "/home";
        let courseName = this.state.course.course_term + ': ' + this.state.course.course_dept_code + ' - ' + this.state.course.course_id + ' - ' + this.state.course.course_name
        let path1 = "/coursedetails/" + this.state.course.course_uid + "/quizzes";

        if (cookie.load('cookieF')) {
            let announcementsPage = "/coursedetails/" + this.props.match.params.courseUid + "/quizzes";
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
                        <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">
                                <Breadcrumb size="large">
                                    <BreadcrumbLink href={homePath}>{courseName}</BreadcrumbLink>
                                    <BreadcrumbLink href={path1}>Quizzes</BreadcrumbLink>
                                    <BreadcrumbLink>{this.state.quizInfo.coursework_name}</BreadcrumbLink>
                                </Breadcrumb>
                            </Heading>
                            <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="quizzes" />
                                </div>

                                <div className="col">
                                    <br />
                                    <div class="row">
                                        <div class="col">
                                            <div class="row">
                                                <div class="col">
                                                    <br /><Heading theme={{ borderPadding: "1rem", h2FontWeight: "700" }} border="bottom">{this.state.quizInfo.coursework_name}</Heading>
                                                </div>
                                            </div>
                                            <div class="row m-1 p-1" style={{ borderBottom: "1px solid #ccc" }}>
                                                <p class="font-weight-bold pr-2">Due&nbsp;</p>
                                                <p class="font-weight-normal pr-5">{this.state.quizInfo.due_date}</p>
                                                <p class="font-weight-bold pr-2">Points&nbsp;</p>
                                                <p class="font-weight-normal pr-5">{this.state.quizInfo.total_points}</p>
                                                <p class="font-weight-bold pr-2">Questions&nbsp;</p>
                                                <p class="font-weight-normal pr-5">{this.state.quizInfo.total_points}</p>
                                            </div>
                                            <div class="row">
                                                <div class="col">
                                                    <br /><Heading theme={{ borderPadding: "1rem", h2FontWeight: "700" }} border="bottom">Quiz Instructions</Heading>
                                                </div>
                                            </div>
                                            <div class="row mt-2 ml-1 pb-3" style={{ borderBottom: "1px solid #ccc" }}>
                                                <div class="col">
                                                    <pre style={{ fontFamily: "inherit" }}>{this.state.quizInfo.instructions}</pre>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <form>
                                        <div class="row m-1">
                                            <div class="col-8">
                                                {
                                                    this.state.questions.map(question => {
                                                        return (
                                                            <div class="card mt-4" style={{ width: "50rem" }}>
                                                                <div class="card-header p-3 font-weight-bold">
                                                                    Question {question.question_number}
                                                                    <span class="float-right"> 1 pts </span>
                                                                </div>
                                                                <div class="card-body">
                                                                    <div class="row">
                                                                        <div class="col mb-5 mt-2 ml-3">
                                                                            {question.question}
                                                                        </div>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="col" >
                                                                            <ul class="list-group list-group-flush">
                                                                                <li class="list-group-item">
                                                                                    <input class="form-check-input" type="radio" name={question.question_number} id="inlineRadio1" onChange={e => this.answerChangeHandler(question.question_number, e)} value="first_option" />
                                                                                    <label class="form-check-label ml-4" for="inlineRadio1">{question.first_option}</label>
                                                                                </li>
                                                                                <li class="list-group-item">
                                                                                    <input class="form-check-input" type="radio" name={question.question_number} id="inlineRadio2" onChange={e => this.answerChangeHandler(question.question_number, e)} value="second_option" />
                                                                                    <label class="form-check-label ml-4" for="inlineRadio2">{question.second_option}</label>
                                                                                </li>
                                                                                <li class="list-group-item">
                                                                                    <input class="form-check-input" type="radio" name={question.question_number} id="inlineRadio2" onChange={e => this.answerChangeHandler(question.question_number, e)} value="third_option" />
                                                                                    <label class="form-check-label ml-4" for="inlineRadio2">{question.third_option}</label>
                                                                                </li>
                                                                                <li class="list-group-item">
                                                                                    <input class="form-check-input" type="radio" name={question.question_number} id="inlineRadio2" onChange={e => this.answerChangeHandler(question.question_number, e)} value="fourth_option" />
                                                                                    <label class="form-check-label ml-4" for="inlineRadio2">{question.fourth_option}</label>
                                                                                </li>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                                <div>{this.state.errorMsg}</div><br />
                                                <div class="row input-group mb-3 justify-content-center">
                                                    <button type="button" class="btn btn-primary btn-md mx-2" style={{ backgroundColor: '#0055a2' }} onClick={this.onSubmit} >Submit Quiz</button>
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