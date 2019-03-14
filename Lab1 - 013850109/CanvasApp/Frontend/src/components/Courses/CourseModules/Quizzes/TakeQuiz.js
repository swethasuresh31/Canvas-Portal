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
import { IconQuizLine, IconAddLine } from '@instructure/ui-icons'
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '@instructure/ui-buttons'



const cookies = new Cookies();

export default class TakeQuiz extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            dueDate: new Date(),
            redirectVar: '',
            quizInfo: '',
            questions: []
        };
        this.addQuestion = this.addQuestion.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.dateChangeHandler = this.dateChangeHandler.bind(this);
    }

    dateChangeHandler(date) {
        this.setState({
            dueDate: date
        });
    }

    questionChangeHandler = (questionNumber, e) => {
        this.state.questions[questionNumber - 1].question = e.target.value;
        this.forceUpdate()
    }
    firstOptionChangeHandler = (questionNumber, e) => {
        this.state.questions[questionNumber - 1].firstOption = e.target.value;
        this.forceUpdate()
    }
    secondOptionChangeHandler = (questionNumber, e) => {
        this.state.questions[questionNumber - 1].secondOption = e.target.value;
        this.forceUpdate()
    }
    thirdOptionChangeHandler = (questionNumber, e) => {
        this.state.questions[questionNumber - 1].thirdOption = e.target.value;
        this.forceUpdate()
    }
    fourthOptionChangeHandler = (questionNumber, e) => {
        this.state.questions[questionNumber - 1].fourthOption = e.target.value;
        this.forceUpdate()
    }
    answerChangeHandler = (questionNumber, e) => {
        this.state.questions[questionNumber - 1].answer = this.state.questions[questionNumber - 1][e.target.value];
        this.forceUpdate()
    }

    addQuestion = (e) => {
        this.state.questions.push(
            {
                questionNumber: this.state.numQuestions + 1,
                question: '',
                firstOption: '',
                secondOption: '',
                thirdOption: '',
                fourthOption: '',
                answer: ''
            }
        )
        this.setState({
            numQuestions: this.state.numQuestions + 1,
            errorMsg: ''
        })
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
                            this.setState({ questions: response.data })
                    })
            )
    }

    onAdd(e) {
        e.preventDefault();
        console.log("validating");
        if (!this.validate()) return;
        console.log("validated");
        console.log('adding')
        let data = this.state
        console.log(data)
        let quizzesPage = "/coursedetails/" + this.props.match.params.courseUid + "/quizzes";
        //adds the quiz based on information entered
        axios.post('http://localhost:3001/quiz/' + this.props.match.params.courseUid, data)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    if (response.status === 200) {
                        this.setState({
                            redirectVar: <Redirect to={quizzesPage} />
                        })
                        console.log(this.state.redirectVar);
                    }
            })
    }


    render() {
        console.log(this.state.questions)
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
                            <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">Quiz</Heading>
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
                                            <div class="row my-2 pb-3" style={{ borderBottom: "1px solid #ccc" }}>
                                                <div class="col">
                                                    {this.state.quizInfo.instructions}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6">
                                            Questions
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