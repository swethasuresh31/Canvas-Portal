import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Avatar, Text, Table } from '@instructure/ui-elements'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { IconAssignmentLine } from '@instructure/ui-icons'


const cookies = new Cookies();

export default class StudentAssignmentLanding extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            redirectVar: '',
            assignments: []
        };
    }

    takeAssignment = (courseworkUid, e) => {
        let takeAssignmentPage = "/coursedetails/"+this.props.parentProps.match.params.courseUid+"/assignments/take/"+courseworkUid;
        this.setState({
            redirectVar: <Redirect to={takeAssignmentPage}/>
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
                                this.props.assignments.map(assignment => {
                                    let takeAssignmentPath = "/coursedetails/" + this.props.parentProps.match.params.courseUid + "/assignments/"+assignment.coursework_uid
                                    return (
                                        <button type="button" class="list-group-item list-group-item-action" onClick={(e)=>this.takeAssignment(assignment._id, e)}>
                                            <div class="row">
                                                <div class="col-sm-1 align-self-center" style={{ width: "50px", maxWidth: "50px" }}><IconAssignmentLine /></div>
                                                <div class="col">
                                                    <div class="row">
                                                        <p class="font-weight-bold m-0">{assignment.name}</p>
                                                    </div>
                                                    <div class="row">
                                                        <p class="font-weight-normal m-0 small">Due&nbsp;</p>
                                                        <p class="font-weight-light m-0 small">{new Date(assignment.due_date).toISOString().slice(0, 19).replace('T', ' ')}&nbsp;&nbsp;|&nbsp;&nbsp;</p>
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