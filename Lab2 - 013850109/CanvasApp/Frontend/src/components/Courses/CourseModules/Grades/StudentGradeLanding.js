import React, { Component } from 'react';
import axios from 'axios'
import {rooturl} from '../../../../config/settings';
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
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
        axios.get('http://' + rooturl + ':3001/grades/' + this.props.parentProps.match.params.courseUid)
            .then((response) => {
                console.log(response);
                let scoredMarks = 0;
                let totalMarks = 0;
                let percentScore = 0;
                if (response !== undefined)
                    console.log(response.data);
                    response.data.map(coursework => {   
                    if(coursework.score !== undefined){
                            scoredMarks += coursework.score;
                            totalMarks += coursework.total_points;
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
                                let scoredPoint = (gradeDetail.score !== undefined) ? gradeDetail.score : "-";
                                let status = (gradeDetail.score !== undefined) ? "graded" : "not yet graded";
                                return (
                                    <tr>
                                        <td>{gradeDetail.name}</td>
                                        <td>{new Date(gradeDetail.due_date).toISOString().slice(0, 10).replace('T', ' ')} by {new Date(gradeDetail.due_date).toISOString().slice(12, 16).replace('T', ' ')}</td>
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