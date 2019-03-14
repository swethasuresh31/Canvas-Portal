import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Avatar, Text, Table } from '@instructure/ui-elements'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { IconQuizLine } from '@instructure/ui-icons'


const cookies = new Cookies();

export default class StudentQuizLanding extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            redirectVar: '',
            quizzes: []
        };
    }

    componentWillMount() {
        axios.get('http://localhost:3001/quiz/' + this.props.parentProps.match.params.courseUid)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ quizzes: response.data })
            })
    }

    takeQuiz = (courseworkUid, e) => {
        let takeQuizPage = "/coursedetails/"+this.props.parentProps.match.params.courseUid+"/quizzes/take/"+courseworkUid;
        this.setState({
            redirectVar: <Redirect to={takeQuizPage}/>
        })
    }

    render() {
        return (
            <div class="col-10 border m-3 py-5" style={{ backgroundColor: "#f5f5f5" }}>
            {this.state.redirectVar}
                <div className="row">
                    <div className="col">
                        <div class="list-group">
                            {
                                this.state.quizzes.map(quiz => {
                                    let takeQuizPath = "/coursedetails/" + this.props.parentProps.match.params.courseUid + "/quizzes/"+quiz.coursework_uid
                                    return (
                                        <button type="button" class="list-group-item list-group-item-action" onClick={(e)=>this.takeQuiz(quiz.coursework_uid, e)}>
                                            <div class="row">
                                                <div class="col-sm-1 align-self-center" style={{ width: "50px", maxWidth: "50px" }}><IconQuizLine /></div>
                                                <div class="col">
                                                    <div class="row">
                                                        <p class="font-weight-bold m-0">{quiz.coursework_name}</p>
                                                    </div>
                                                    <div class="row">
                                                        <p class="font-weight-normal m-0 small">Due&nbsp;</p>
                                                        <p class="font-weight-light m-0 small">{quiz.due_date}&nbsp;&nbsp;|&nbsp;&nbsp;</p>
                                                        <p class="font-weight-light m-0 small">{quiz.total_points} pts&nbsp;&nbsp;|&nbsp;</p>
                                                        <p class="font-weight-light m-0 small">{quiz.total_points} questions</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}