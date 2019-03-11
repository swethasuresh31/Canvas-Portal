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
        var preFilled = (this.props.location.course !== undefined);
        this.state = {
            courseTerm: [],
            courseDepartment: [],
            courses: [],
            courseUid: '',
            courseId: '',
            term: '',
            department: '',
            courseName: '',
            searchOperand: 'EQ',
            errorMsg: '',
            redirectVar: '',
            permissionNumber: '',
            prefilled: false
        }
        if (preFilled) {
            this.state = {
                courseTerm: [],
                courseDepartment: [],
                courses: [],
                courseUid: this.props.location.course.course_uid,
                courseId: this.props.location.course.course_id,
                term: this.props.location.course.course_term,
                department: this.props.location.course.course_dept_code,
                courseName: this.props.location.course.course_name,
                searchOperand: 'EQ',
                errorMsg: '',
                redirectVar: '',
                permissionNumber: '',
                prefilled: true
            }
        }
        //Bind the handlers to this class
        this.termChangeHandler = this.termChangeHandler.bind(this);
        this.departmentChangeHandler = this.departmentChangeHandler.bind(this);
        this.permissionChangeHandler = this.permissionChangeHandler.bind(this);
        this.courseIdChangeHandler = this.courseIdChangeHandler.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.updateNameAndCourseId = this.updateNameAndCourseId.bind(this);
        this.clearForm = this.clearForm.bind(this);

    }

    //term change handler to update state variable with the text entered by the user
    termChangeHandler = (e) => {
        this.setState({
            term: e.target.value,
            errorMsg: ''
        }, this.updateNameAndCourseId)
    }

    //department change handler to update state variable with the text entered by the user
    departmentChangeHandler = (e) => {
        this.setState({
            department: e.target.value,
            errorMsg: ''
        }, this.updateNameAndCourseId)
    }

    permissionChangeHandler = (e) => {
        this.setState({
            permissionNumber: e.target.value,
            errorMsg: ''
        })
    }

    //courseId change handler to update state variable with the text entered by the user
    courseIdChangeHandler = (e) => {
        this.setState({
            courseId: e.target.value,
            errorMsg: ''
        }, this.updateNameAndCourseId)
    }

    updateNameAndCourseId = () => {
        console.log('Calling : ' + this.state.term + ' ' + this.state.department + ' ' + this.state.courseId)
        if (this.state.term !== '' && this.state.department !== '' && this.state.courseId !== '') {
            axios.get('http://localhost:3001/course?term=' + this.state.term + '&name=&department=' +
                this.state.department + '&courseId=' + this.state.courseId + '&operator=' + this.state.searchOperand)
                .then((response) => {
                    console.log(response);
                    if (response !== undefined && response.status === 200 && response.data.length !== 0) {
                        this.setState({
                            courseName: response.data[0].course_name,
                            courseUid: response.data[0].course_uid
                        })
                    } else {
                        this.setState({
                            courseName: '',
                            courseUid: ''
                        })
                    }
                })
        }
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
        axios.get('http://localhost:3001/searchcourse')
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({
                        courseTerm: response.data[0],
                        courseDepartment: response.data[1]
                    })
            })

    }

    validate = () => {
        if ((this.state.courseUid === '')) {
            this.setState({ errorMsg: '*Please select a course to proceed' })
            return false;
        }
        return true;
    }


    onAdd(e) {
        e.preventDefault();
        console.log("validating");
        if (!this.validate()) return;
        console.log("validated");
        console.log('adding')
        let data = {
            userId: cookies.get('cookieS'),
            courseUid: this.state.courseUid,
            permissionNumber: this.state.permissionNumber
        }
        //retrieves the courses based on information entered
        axios.put('http://localhost:3001/usercourse', data)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    if (response.status === 200) {
                        this.setState({
                            redirectVar: <Redirect to="/coursehome" />
                        })
                        console.log(this.state.redirectVar);
                    }
            })
    }


    render() {

        if (this.state.prefilled) {
            return (
                <div id="wrapper" style={{ 'margin-left': 'auto', 'margin-right': 'auto', width: '100%', position: 'fixed' }}>
                    {this.state.redirectVar}
                    <div className="container-fluid md-0 p-0">
                        <div className="row">
                        <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                                <Navbar selected="courses" />
                            </ div>
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">Add Course</ Heading></div>
                                </div>
                                <br /><br />
                                <div className="row d-flex justify-content-center">
                                    <form>
                                        <div class="dropdown mb-3">
                                            <div className="row input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <label class="input-group-text" for="inputGroupSelect01">Course Term</label>
                                                </div>
                                                <input type="text" class="form-control" value={this.state.term} readonly="true" />
                                            </div>
                                            <div className="row input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <label class="input-group-text" for="inputGroupSelect02">Department Code</label>
                                                </div>
                                                <input type="text" class="form-control" value={this.state.department} readonly="true" />
                                            </div>
                                            <div class="row input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <label class="input-group-text" for="inputGroupSelect03">Course Number</label>
                                                </div>
                                                <input type="text" class="form-control" value={this.state.courseId} readonly="true" />
                                            </div>
                                            <div class="row input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <label class="input-group-text" for="inputGroupSelect05">Course Name</label>
                                                </div>
                                                <input type="text" class="form-control" value={this.state.courseName} readonly="true" />
                                            </div>
                                            <div class="row input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <label class="input-group-text" for="inputGroupSelect05">Permission Number</label>
                                                </div>
                                                <input type="text" class="form-control" id="inputGroupSelect05" value={this.state.permissionNumber} onChange={this.permissionChangeHandler} />
                                            </div>
                                            <div>{this.state.errorMsg}</div><br />
                                            <div class="row input-group mb-3 justify-content-center">
                                                <button type="button" class="btn btn-secondary btn-md mx-2 disabled" >Cancel</button>
                                                <button type="button" class="btn btn-primary btn-md mx-2" style={{ backgroundColor: '#0055a2' }} onClick={this.onAdd} >Add</button>
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
        } else {

            return (
                <div id="wrapper" style={{ 'margin-left': 'auto', 'margin-right': 'auto', width: '100%', position: 'fixed' }}>
                    {this.state.redirectVar}
                    <div className="container-fluid md-0 p-0">
                        <div className="row">
                        <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                                <Navbar selected="courses" />
                            </ div>
                            <div className="col">
                                <div className="row">
                                    <div className="col">
                                        <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">Add Course</ Heading></div>
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
                                                                <option value={term.course_term}>{term.course_term}</option>
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
                                                                <option value={department.course_dept_code}>{department.course_dept_code}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div class="row input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <label class="input-group-text" for="inputGroupSelect03">Course Number</label>
                                                </div>
                                                <input type="text" class="form-control" id="inputGroupSelect03" value={this.state.courseId} onChange={this.courseIdChangeHandler} />
                                            </div>
                                            <div class="row input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <label class="input-group-text" for="inputGroupSelect04">Course Name</label>
                                                </div>
                                                <input type="text" class="form-control" value={this.state.courseName} readonly="true" />
                                            </div>
                                            <div class="row input-group mb-3">
                                                <div class="input-group-prepend">
                                                    <label class="input-group-text" for="inputGroupSelect05">Permission Number</label>
                                                </div>
                                                <input type="text" class="form-control" id="inputGroupSelect05" value={this.state.permissionNumber} onChange={this.permissionChangeHandler} />
                                            </div>
                                            <div>{this.state.errorMsg}</div><br />
                                            <div class="row input-group mb-3 justify-content-center">
                                                <button type="button" class="btn btn-secondary btn-md mx-2" onClick={() => this.clearForm()}>Clear</button>
                                                <button type="button" class="btn btn-primary btn-md mx-2" style={{ backgroundColor: '#0055a2' }} onClick={this.onAdd} >Add</button>
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
}