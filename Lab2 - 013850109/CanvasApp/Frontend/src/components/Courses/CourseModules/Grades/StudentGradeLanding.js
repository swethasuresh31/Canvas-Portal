import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { Avatar, Text, Table } from '@instructure/ui-elements'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom';
import { IconAssignmentLine } from '@instructure/ui-icons'


const cookies = new Cookies();

export default class StudentGradeLanding extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            redirectVar: '',
            gradeDetails: [],
            scoredMarks: '',
            totalMarks: '',
            percentScore: ''
        };
    }

    componentWillMount() {
        let user;
        if (cookie.load('cookieS')){
            user = cookies.get('cookieS');
        }
        axios.get('http://localhost:3001/grades/' + this.props.parentProps.match.params.courseUid + '/'+encodeURI(user))
            .then((response) => {
                console.log(response);
                let scoredMarks = 0;
                let totalMarks = 0;
                let percentScore = 0;
                if (response !== undefined)
                    response.data.forEach(score => {
                        if(score.scored_points !== null){
                            scoredMarks += score.scored_points;
                            totalMarks += score.total_points;
                        }
                    });
                    if(totalMarks !== 0){
                        percentScore = Math.trunc(100 * (scoredMarks/totalMarks));
                    }
                    this.setState({ 
                        gradeDetails: response.data,
                        scoredMarks: scoredMarks,
                        totalMarks: totalMarks,
                        percentScore: percentScore
                     })
            })
    }

    

    render() {
        return (
            <div class="col-12 m-3 py-5">
            {this.state.redirectVar}
                <div className="row">
                    <div className="col">
                    <Table caption="" size="small">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Due</th>
                            <th>Status</th>
                            <th>Score</th>
                            <th>Out Of</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            
                            this.state.gradeDetails.map(gradeDetail => {
                                let scoredPoint = (gradeDetail.scored_points !== null) ? gradeDetail.scored_points : "-";
                                let status = (gradeDetail.scored_points !== null) ? "graded" : "not yet graded";
                                return (
                                    <tr>
                                        <td>{gradeDetail.coursework_name}</td>
                                        <td>{gradeDetail.due_date}</td>
                                        <td><br />{status}<br /><br /></td>
                                        <td>{scoredPoint}</td>
                                        <td>{gradeDetail.total_points}</td>
                                    </tr>
                                )
                            })
                        }
                        <tr class="h4">
                        <td colspan="3"><br />Total<br /><br /></td>
                        <td>{this.state.percentScore}%</td>
                        <td>{this.state.scoredMarks}/{this.state.totalMarks}</td>
                        </tr>
                    </tbody>
                </Table>  
                    </div>
                </div>
            </div>
        );
    }
}