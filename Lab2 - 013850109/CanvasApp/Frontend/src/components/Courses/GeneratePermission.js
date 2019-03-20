import React, { Component } from 'react';
import Navbar from '../LandingPage/Navbar';
import CourseCard from './CourseCard';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import Cookies from 'universal-cookie';
import axios from 'axios';

import { IconSearchLine } from '@instructure/ui-icons'

const cookies = new Cookies();

export default class SearchCourse extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            courses: [],
            selectedCourse: '',
            permissionCode: ''
        }
        this.onGenerate = this.onGenerate.bind(this);
        this.onSelect = this.onSelect.bind(this);


    }

    componentWillMount() {
        let user = cookies.get('cookieF');
        axios.get('http://localhost:3001/usercourse/' + encodeURI(user) + '?role=faculty')
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({ courses: response.data })
            })
    }

    onSelect(e) {
        this.setState({ selectedCourse: e.target.value, permissionCode: '' });
    }


    onGenerate(e) {
        this.setState({ errorMsg: '' })
        //generate the permission code for the course
        axios.get('http://localhost:3001/permission/'+this.state.selectedCourse)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({
                        permissionCode: response.data.permissionCode
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
                                    <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">Generate Permission Code</ Heading></div>
                            </div>
                            <br /><br />
                            <div className="row d-flex justify-content-center">
                                <form>
                                    <div class="dropdown mb-3">
                                        <div className="row input-group mb-3">
                                            <div class="input-group-prepend">
                                                <label class="input-group-text" for="inputGroupSelect01">Course</label>
                                            </div>
                                            <select class="custom-select" id="inputGroupSelect01" onChange={this.onSelect} value={this.state.selectedCourse} >
                                                <option value="" selected></option>
                                                {
                                                    this.state.courses.map((course) => {
                                                        let courseValue = course.course_dept_code + '-' + course.course_id + ' - ' + course.course_name + ' (' + course.course_term + ')';
                                                        return (
                                                            <option value={course.course_uid}>{courseValue}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div>{this.state.errorMsg}</div><br />
                                        <div class="row input-group mb-3 justify-content-center">
                                            <button type="button" class="btn btn-primary btn-md mx-2" style={{ backgroundColor: '#0055a2' }} onClick={this.onGenerate} >Generate Permission Code</button>
                                        </div>
                                        <br/><br/>
                                        <div class="row input-group mb-3">
                                            <div class="input-group-prepend">
                                                <label class="input-group-text" for="inputGroupSelect05">Permission Code</label>
                                            </div>
                                            <input type="text" class="form-control" value={this.state.permissionCode} readonly="true" />
                                        </div>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );

    }
}