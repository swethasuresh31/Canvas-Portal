import React, { Component } from 'react';
import { Grid, GridRow, GridCol } from '@instructure/ui-layout'
import theme from '@instructure/ui-themes/lib/canvas/base'
import Navbar from '../LandingPage/Navbar';
import CourseCard from './CourseCard';
import { Redirect } from 'react-router';
import { Table } from '@instructure/ui-elements';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import cookie from 'react-cookies';
import Cookies from 'universal-cookie';
import axios from 'axios';

import { IconSearchLine } from '@instructure/ui-icons'

const cookies = new Cookies();

export default class SearchCourse extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            courseTerm: [],
            courseDepartment: [],
            courses: [],
            courseId: '',
            term: '',
            department: '',
            courseName: '',
            searchOperand: 'EQ',
            errorMsg: '',
            searchResult: ''
        }
        //Bind the handlers to this class
        this.termChangeHandler = this.termChangeHandler.bind(this);
        this.departmentChangeHandler = this.departmentChangeHandler.bind(this);
        this.courseIdChangeHandler = this.courseIdChangeHandler.bind(this);
        this.courseNameChangeHandler = this.courseNameChangeHandler.bind(this);
        this.searchOperandChangeHandler = this.searchOperandChangeHandler.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.clearForm = this.clearForm.bind(this);

    }

    //term change handler to update state variable with the text entered by the user
    termChangeHandler = (e) => {
        this.setState({
            term: e.target.value,
            errorMsg: ''
        })
    }

    //department change handler to update state variable with the text entered by the user
    departmentChangeHandler = (e) => {
        this.setState({
            department: e.target.value,
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
            courseName: e.target.value,
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
            searchOperand: 'EQ',
            department: ''
        })
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
        axios.get('http://localhost:3001/coursemetadata')
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({
                        courseTerm: response.data.terms,
                        courseDepartment: response.data.departments
                    })
            })

    }

    validate = () => {
        if ((this.state.term === '') && (this.state.department === '') && (this.state.courseId === '') && (this.state.courseName === '')) {
            this.setState({ errorMsg: '*Select atleast one search criteria to proceed' })
            return false;
        }
        return true;
    }


    onSearch(e) {
        e.preventDefault();
        console.log("validating");
        if (!this.validate()) return;
        console.log("validated");
        console.log(this.state.searchOperand);
        this.setState({ errorMsg: '' })
        //retrieves the courses based on information entered
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
        axios.get('http://localhost:3001/course?term=' + this.state.term + '&name=' + this.state.courseName + '&department=' +
            this.state.department + '&courseId=' + this.state.courseId + '&operator=' + this.state.searchOperand)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({
                        searchResult: <CourseCard courses={response.data} />
                    })

            })

    }


    render() {

        return (
            <div id="wrapper" style={{ 'margin-left': 'auto', 'margin-right': 'auto', width: '100%', position: 'fixed' }}>
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
                            <div className="row d-flex justify-content-center">
                                <form>
                                    <div class="dropdown mb-3">
                                        <div className="row input-group mb-3">
                                            <div class="input-group-prepend">
                                                <label class="input-group-text" for="inputGroupSelect01">Course Term</label>
                                            </div>
                                            <select class="custom-select" id="inputGroupSelect01" onChange={this.termChangeHandler} value={this.state.term} >
                                                <option value="" selected></option>
                                                {
                                                    this.state.courseTerm.map(term => {
                                                        return (
                                                            <option value={term}>{term}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="row input-group mb-3">
                                            <div class="input-group-prepend">
                                                <label class="input-group-text" for="inputGroupSelect02">Department Code</label>
                                            </div>
                                            <select class="custom-select" id="inputGroupSelect02" onChange={this.departmentChangeHandler} value={this.state.department} >
                                                <option value="" selected></option>
                                                {
                                                    this.state.courseDepartment.map(department => {
                                                        return (
                                                            <option value={department}>{department}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div class="row input-group mb-3">
                                            <div class="input-group-prepend">
                                                <label class="input-group-text" for="inputGroupSelect03">Course Number</label>
                                            </div>
                                            <select class="custom-select" id="inputGroupSelect03" onChange={this.searchOperandChangeHandler} value={this.state.searchOperand}>
                                                <option value='EQ' selected>is exactly</option>
                                                <option value='CON'>contains</option>
                                                <option value='LTE'>less than or equal to</option>
                                                <option value='GTE'>greater than or equal to</option>
                                            </select>
                                            <input type="text" class="form-control" id="inputGroupSelect04" value={this.state.courseId} onChange={this.courseIdChangeHandler} />
                                        </div>
                                        <div class="row input-group mb-3">
                                            <div class="input-group-prepend">
                                                <label class="input-group-text" for="inputGroupSelect05">Course Name</label>
                                            </div>
                                            <input type="text" class="form-control" value={this.state.courseName} onChange={this.courseNameChangeHandler} />
                                        </div>
                                        <div>{this.state.errorMsg}</div><br />
                                        <div class="row input-group mb-3 justify-content-center">
                                            <button type="button" class="btn btn-secondary btn-md mx-2" onClick={() => this.clearForm()}>Clear</button>
                                            <button type="button" class="btn btn-primary btn-md mx-2" style={{ backgroundColor: '#0055a2' }} onClick={this.onSearch} >Search</button>
                                        </ div>
                                    </div>
                                </form>

                            </div>
                            <div className="row">
                                {this.state.searchResult}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );

    }
}