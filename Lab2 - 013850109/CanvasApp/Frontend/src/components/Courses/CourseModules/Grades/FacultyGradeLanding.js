import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Avatar, Text, Table } from '@instructure/ui-elements'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { IconAssignmentLine, IconAddLine } from '@instructure/ui-icons'

import { getCourseHome } from '../../../../js/actions/CourseHomeAction';
import { connect } from 'react-redux';


const cookies = new Cookies();

class FacultyGradeLanding extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            redirectVar: '',
            assignments: []
        };
    }

    async componentWillMount() {
        await this.props.getCourseHome(this.props.parentProps.match.params.courseUid);
            console.log("course: " + this.props.courseHomeStateStore.result.data)   
            const result = this.props.courseHomeStateStore.result.data;
            this.setState({
                course: result,
                assignments: result.assignments
            })
    }

    viewSubmissions = (courseworkUid, e) => {
        let takeAssignmentPage = "/coursedetails/"+this.props.parentProps.match.params.courseUid+"/assignments/submissions/"+encodeURI(courseworkUid);
        this.setState({
            redirectVar: <Redirect to={takeAssignmentPage}/>
        })
    }

    render() {
        return (
            <div class="col-8 border m-3 py-5" style={{ backgroundColor: "#f5f5f5" }}>
            {this.state.redirectVar}
                <div className="row">
                    <div className="col">
                        <div class="list-group">
                            {
                                this.state.assignments.map(assignment => {
                                    return (
                                        <button type="button" class="list-group-item list-group-item-action" onClick={(e)=>this.viewSubmissions(assignment.name, e)}>
                                            <div class="row">
                                                <div class="col-sm-1 align-self-center" style={{ width: "50px", maxWidth: "50px" }}><IconAssignmentLine /></div>
                                                <div class="col">
                                                    <div class="row">
                                                        <p class="font-weight-bold m-0">{assignment.name}</p>
                                                    </div>
                                                    <div class="row">
                                                        <p class="font-weight-normal m-0 small">Due&nbsp;</p>
                                                        <p class="font-weight-light m-0 small">{assignment.due_date}&nbsp;&nbsp;|&nbsp;&nbsp;</p>
                                                        <p class="font-weight-light m-0 small">{assignment.total_points} pts</p>
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
  export default connect(mapStateToProps, { getCourseHome })(FacultyGradeLanding);