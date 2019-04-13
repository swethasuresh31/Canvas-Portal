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
import { IconQuizLine, IconAddLine } from '@instructure/ui-icons'
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '@instructure/ui-buttons'
import { Link } from 'react-router-dom';

import { getCourseHome } from '../../../../js/actions/CourseHomeAction';
import { connect } from 'react-redux';


const cookies = new Cookies();

class AddQuiz extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            dueDate: new Date(),
            redirectVar: '',
            quizName: '',
            instructions: '',
            numQuestions: 0,
            questions: [],
            course: ''
        };
        this.quizNameChangeHandler = this.quizNameChangeHandler.bind(this);
        this.instructionsChangeHandler = this.instructionsChangeHandler.bind(this);
        this.addQuestion = this.addQuestion.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.dateChangeHandler = this.dateChangeHandler.bind(this);
    }

    dateChangeHandler(date) {
        this.setState({
            dueDate: date
        });
    }

    quizNameChangeHandler = (e) => {
        this.setState({
            quizName: e.target.value,
            errorMsg: ''
        })
    }

    instructionsChangeHandler = (e) => {
        this.setState({
            instructions: e.target.value,
            errorMsg: ''
        })
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

    validate = () => {
        if ((this.state.quizName === '')) {
            this.setState({ errorMsg: '*Please enter a quiz name' })
            return false;
        }
        if ((this.state.instructions === '')) {
            this.setState({ errorMsg: '*Please enter quiz instructions' })
            return false;
        }
        if ((this.state.questions.length === 0)) {
            this.setState({ errorMsg: '*Please enter atleast 1 question' })
            return false;
        }
        this.state.questions.forEach((question) => {
            if ((question.question === '')) {
                this.setState({ errorMsg: '*Please enter question(s)' })
                return false;
            }
            if ((question.firstOption === '')) {
                this.setState({ errorMsg: '*Please enter values for all option(s)' })
                return false;
            }
            if ((question.secondOption === '')) {
                this.setState({ errorMsg: '*Please enter values for all option(s)' })
                return false;
            }
            if ((question.thirdOption === '')) {
                this.setState({ errorMsg: '*Please enter values for all option(s)' })
                return false;
            }
            if ((question.fourthOption === '')) {
                this.setState({ errorMsg: '*PPlease enter values for all option(s)' })
                return false;
            }
        })
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
        let quizzesPage = "/coursedetails/" + this.props.match.params.courseUid + "/quizzes";
        //adds the quiz based on information entered
        axios.post('http://' + rooturl + ':3001/quiz/' + this.props.match.params.courseUid, data)
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

    async componentWillMount() {
        await this.props.getCourseHome(this.props.match.params.courseUid);
        console.log("course: " + this.props.courseHomeStateStore.result.data)   
        const result = this.props.courseHomeStateStore.result.data;
        this.setState({
            course: result
        })
    }

    render() {
        let homePath = "/coursedetails/" + this.state.course._id + "/home";
        let courseName = this.state.course.course_term + ': ' + this.state.course.course_dept_code + ' - ' + this.state.course.course_id + ' - ' + this.state.course.course_name
        let path1 = "/coursedetails/" + this.state.course._id + "/quizzes";

        
        console.log(this.state.questions)
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
                                    <BreadcrumbLink href={path1}>Quizzes</BreadcrumbLink>
                                    <BreadcrumbLink>Add Quiz</BreadcrumbLink>
                                </Breadcrumb>
                            </Heading>
                            <div className="row">

                                <div className="col col-sm-2">
                                    <br />   <CourseNav courseUid={this.props.match.params.courseUid} selected="quizzes" />
                                </div>

                                <div className="col">
                                    <br />
                                    <div class="row">
                                        <div class="col-6">
                                            <form>
                                                <div class="dropdown mb-3">
                                                    <div class="row input-group mb-3">
                                                        <div class="input-group-prepend">
                                                            <label class="input-group-text" for="inputGroupSelect05">Quiz Name</label>
                                                        </div>
                                                        <input type="text" class="form-control" value={this.state.quizName} onChange={this.quizNameChangeHandler} />
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

                                                    {
                                                        this.state.questions.map(question => {
                                                            let questionIdentifier = this.state.questions[question.questionNumber];
                                                            return (
                                                                <div class="row p-2 border mb-3" style={{ backgroundColor: "#f5f5f5" }}>
                                                                    <div class="col">
                                                                        <p class="font-weight-bold">Question {question.questionNumber}</p>
                                                                        <div class="row input-group mb-3">
                                                                            <div class="input-group-prepend">
                                                                                <label class="input-group-text" for="inputGroupSelect05">Question</label>
                                                                            </div>
                                                                            <textarea class="form-control" id="inputGroupSelect05" value={question.question} placeholder="Enter question" onChange={(e) => this.questionChangeHandler(question.questionNumber, e)} />
                                                                        </div>
                                                                        <div class="row input-group mb-3">
                                                                            <div class="input-group-prepend">
                                                                                <label class="input-group-text" for="inputGroupSelect05">Option 1</label>
                                                                            </div>
                                                                            <input type="text" class="form-control" id="inputGroupSelect05" value={question.firstOption} placeholder="Enter option 1" onChange={(e) => this.firstOptionChangeHandler(question.questionNumber, e)} />
                                                                        </div>
                                                                        <div class="row input-group mb-3">
                                                                            <div class="input-group-prepend">
                                                                                <label class="input-group-text" for="inputGroupSelect05">Option 2</label>
                                                                            </div>
                                                                            <input type="text" class="form-control" id="inputGroupSelect05" value={question.secondOption} placeholder="Enter option 2" onChange={(e) => this.secondOptionChangeHandler(question.questionNumber, e)} />
                                                                        </div>
                                                                        <div class="row input-group mb-3">
                                                                            <div class="input-group-prepend">
                                                                                <label class="input-group-text" for="inputGroupSelect05">Option 3</label>
                                                                            </div>
                                                                            <input type="text" class="form-control" id="inputGroupSelect05" value={question.thirdOption} placeholder="Enter option 3" onChange={(e) => this.thirdOptionChangeHandler(question.questionNumber, e)} />
                                                                        </div>
                                                                        <div class="row input-group mb-3">
                                                                            <div class="input-group-prepend">
                                                                                <label class="input-group-text" for="inputGroupSelect05">Option 4</label>
                                                                            </div>
                                                                            <input type="text" class="form-control" id="inputGroupSelect05" value={question.fourthOption} placeholder="Enter option 4" onChange={(e) => this.fourthOptionChangeHandler(question.questionNumber, e)} />
                                                                        </div>
                                                                        <div class="row input-group mb-3">
                                                                            <div class="input-group-prepend">
                                                                                <label class="input-group-text mr-3" for="inputGroupSelect05">Answer</label>
                                                                            </div>
                                                                            <div class="form-check form-check-inline">
                                                                                <input class="form-check-input" type="radio" name={question.questionNumber} id="inlineRadio1" onChange={e => this.answerChangeHandler(question.questionNumber, e)} value="firstOption" />
                                                                                <label class="form-check-label" for="inlineRadio1">Option 1</label>
                                                                            </div>
                                                                            <div class="form-check form-check-inline">
                                                                                <input class="form-check-input" type="radio" name={question.questionNumber} id="inlineRadio2" onChange={e => this.answerChangeHandler(question.questionNumber, e)} value="secondOption" />
                                                                                <label class="form-check-label" for="inlineRadio2">Option 2</label>
                                                                            </div>
                                                                            <div class="form-check form-check-inline">
                                                                                <input class="form-check-input" type="radio" name={question.questionNumber} id="inlineRadio3" onChange={e => this.answerChangeHandler(question.questionNumber, e)} value="thirdOption" />
                                                                                <label class="form-check-label" for="inlineRadio3">Option 3</label>
                                                                            </div>
                                                                            <div class="form-check form-check-inline">
                                                                                <input class="form-check-input" type="radio" name={question.questionNumber} id="inlineRadio4" onChange={e => this.answerChangeHandler(question.questionNumber, e)} value="fourthOption" />
                                                                                <label class="form-check-label" for="inlineRadio4">Option 4</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                    <div class="row input-group mb-3">
                                                        <Button margin="0 x-small 0 0" icon={IconAddLine} onClick={this.addQuestion}> New Question  </Button>
                                                    </div>

                                                    <div>{this.state.errorMsg}</div><br />
                                                    <div class="row input-group mb-3 justify-content-center">
                                                        <button type="button" class="btn btn-primary btn-md mx-2" style={{ backgroundColor: '#0055a2' }} onClick={this.onAdd} >Add Quiz</button>
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
        else {
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
  export default connect(mapStateToProps, { getCourseHome })(AddQuiz);