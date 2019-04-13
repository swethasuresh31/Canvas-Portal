import React, { Component } from 'react';
import axios from 'axios'
import cookie from 'react-cookies';
import { Avatar, Text, Table } from '@instructure/ui-elements'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { IconQuizLine } from '@instructure/ui-icons'

import { getCourseHome } from '../../../../js/actions/CourseHomeAction';
import { connect } from 'react-redux';

const cookies = new Cookies();

class StudentQuizLanding extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            redirectVar: '',
            quizzes: []
        };
    }

    async componentWillMount() {
        await this.props.getCourseHome(this.props.parentProps.match.params.courseUid);
        console.log("course: " + this.props.courseHomeStateStore.result.data)   
        const result = this.props.courseHomeStateStore.result.data;
        this.setState({
            quizzes: result.quizzes
        },console.log("quizzes "+this.state.quizzes));
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
                                    let takeQuizPath = "/coursedetails/" + this.props.parentProps.match.params.courseUid + "/quizzes/"+quiz._id
                                    return (
                                        <button type="button" class="list-group-item list-group-item-action" onClick={(e)=>this.takeQuiz(quiz._id, e)}>
                                            <div class="row">
                                                <div class="col-sm-1 align-self-center" style={{ width: "50px", maxWidth: "50px" }}><IconQuizLine /></div>
                                                <div class="col">
                                                    <div class="row">
                                                        <p class="font-weight-bold m-0">{quiz.name}</p>
                                                    </div>
                                                    <div class="row">
                                                        <p class="font-weight-normal m-0 small">Due&nbsp;</p>
                                                        <p class="font-weight-light m-0 small">{new Date(quiz.due_date).toISOString().slice(0, 19).replace('T', ' ')}&nbsp;&nbsp;|&nbsp;&nbsp;</p>
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
  export default connect(mapStateToProps, { getCourseHome })(StudentQuizLanding);