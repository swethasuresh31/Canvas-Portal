import React, { Component } from 'react';
import { Grid, GridRow, GridCol } from '@instructure/ui-layout'
import theme from '@instructure/ui-themes/lib/canvas/base'
import Navbar from '../LandingPage/Navbar';
import { Redirect } from 'react-router';
import { Table } from '@instructure/ui-elements';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import cookie from 'react-cookies';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { IconSearchLine } from '@instructure/ui-icons'

const cookies = new Cookies();

export default class StudentCourseLanding extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            courseTerm: [],
            courses: [],
            courseId: '',
            term: '',
            courseName: '',
            searchOperand: ''
        };
    }

    //term change handler to update state variable with the text entered by the user
    termChangeHandler = (e) => {
        this.setState({
            term: e.target.value,
            errorMsg: ''
        })
    }

    //courseId change handler to update state variable with the text entered by the user
    courseIdChangeHandler = (e) => {
        this.setState({
            courseId: e.target.value,
            errorMsg: ''
        })
    }

    //course name change handler to update state variable with the text entered by the user
    courseNameChangeHandler = (e) => {
        this.setState({
            name: e.target.value,
            errorMsg: ''
        })
    }

    //search operand change handler to update state variable with the text entered by the user
    searchOperandChangeHandler = (e) => {
        this.setState({
            searchOperand: e.target.value,
            errorMsg: ''
        })
    }

    clearForm = () => {
        this.setState({
            courseId: '',
            term: '',
            courseName: '',
            searchOperand: 'EQ'
        })
    }

    componentDidMount() {
        axios.get('http://localhost:3001/searchCourse/term')
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ courseTerm: response.data })
            })

    }



    searchCourses(e) {
        e.preventDefault()
        alert("here");
        let operator = 'LT';
        // //retrieves the courses based on id entered
        // axios.get('http://localhost:3001/searchCourse/courseid', { params: { operator: operator, courseId: this.state.courseId } })
        //     .then((response) => {
        //         console.log(response);
        //         if (response !== undefined)
        //             this.setState({ courses: response.data })
        //     })

    }


    render() {

        return (
            <div className="container-fluid md-0 p-0">
                <div className="row">
                    <div className="col col-md-1">
                        <Navbar selected="courses" />
                    </ div>
                    <div className="col">
                        <div className="row">
                            <div className="col">
                                <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">Search Courses</ Heading></div>
                        </div>
                        <br /><br />
                        <div className="row">
                            <form noValidate onSubmit={this.searchCourses}>
                                <div class="dropdown .dropdown-menu-center">
                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <label class="input-group-text" for="inputGroupSelect01">Course Term</label>
                                        </div>
                                        <select class="custom-select" id="inputGroupSelect01" onChange={this.termChangeHandler} value={this.state.term} >
                                            <option value="" selected></option>
                                            {
                                                this.state.courseTerm.map(term => {
                                                    return (
                                                        <option value={term.course_term}>{term.course_term}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <label class="input-group-text" for="inputGroupSelect02">Course Number</label>
                                        </div>
                                        <select class="custom-select" id="inputGroupSelect01" onChange={this.searchOperandChangeHandler} value={this.state.searchOperand}>
                                            <option value='EQ' selected>is exactly</option>
                                            <option value='CON'>contains</option>
                                            <option value='LTE'>less than or equal to</option>
                                            <option value='GTE'>greater than or equal to</option>
                                        </select>
                                        <input type="text" class="form-control" id="inputGroupSelect02" value={this.state.courseId} onChange={this.courseIdChangeHandler} />
                                    </div>
                                    <div class="input-group mb-3">
                                        <div class="input-group-prepend">
                                            <label class="input-group-text" for="inputGroupSelect04">Course Name</label>
                                        </div>
                                        <input type="text" class="form-control" value={this.state.courseName} onChange={this.courseNameChangeHandler} />
                                    </div>
                                    <div class="input-group mb-3">
                                        <button type="button" class="btn btn-primary btn-lg" onClick={() => this.clearForm()}>Cancel</button>
                                        <button type="button" class="btn btn-primary btn-lg" onClick={this.searchCourses} >Search</button>
                                    </ div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        );

    }
}