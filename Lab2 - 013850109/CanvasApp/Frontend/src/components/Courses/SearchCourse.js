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
import axios from 'axios'
import { rooturl } from '../../config/settings';

import { searchCourse } from '../../js/actions/SearchCourseAction';
import { connect } from 'react-redux';


import { IconSearchLine } from '@instructure/ui-icons'

const cookies = new Cookies();

class SearchCourse extends Component {

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
            searchResult: [],
            currentPage: 1,
            loadPage: 0,
            startIndex: 0,
            pagesPerPage: 2,
            searchResultFiltered: [],

        }
        //Bind the handlers to this class
        this.termChangeHandler = this.termChangeHandler.bind(this);
        this.departmentChangeHandler = this.departmentChangeHandler.bind(this);
        this.courseIdChangeHandler = this.courseIdChangeHandler.bind(this);
        this.courseNameChangeHandler = this.courseNameChangeHandler.bind(this);
        this.searchOperandChangeHandler = this.searchOperandChangeHandler.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.handlePagination = this.handlePagination.bind(this);

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
        axios.get('http://' + rooturl + ':3001/coursemetadata')
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    this.setState({
                        courseTerm: response.data.terms,
                        courseDepartment: response.data.departments
                    })
            })


    }

    handlePagination(event) {

        var target = event.target;
        var id = target.id;
        var flag = true;
        if (id === "prev") {
            console.log('SI', this.state.startIndex);
            if (this.state.startIndex > 0) {
                var startIndex = this.state.startIndex - this.state.pagesPerPage;
            }
            else {
                flag = false;
            }
        }
        else {
            var startIndex = this.state.startIndex + this.state.pagesPerPage;
            if (startIndex > this.state.searchResult.length) {
                flag = false;
            }
        }


        if (flag === true) {


            var endIndex = startIndex + this.state.pagesPerPage - 1;
            var searchResult = this.state.searchResult;
            var searchResultFiltered = this.state.searchResult.filter(function (course) {
                var index = searchResult.indexOf(course);
                return index >= startIndex && index <= endIndex;
            });
            console.log('startomdex: ', startIndex);
            console.log('endomdex: ', endIndex);
            this.setState({
                searchResultFiltered: <CourseCard courses={searchResultFiltered} />,
                startIndex: startIndex
            });
        }
    }


    validate = () => {
        if ((this.state.term === '') && (this.state.department === '') && (this.state.courseId === '') && (this.state.courseName === '')) {
            this.setState({ errorMsg: '*Select atleast one search criteria to proceed' })
            return false;
        }
        return true;
    }


    async onSearch(e) {
        e.preventDefault();
        console.log("validating");
        if (!this.validate()) return;
        console.log("validated");
        this.setState({ errorMsg: '' })
        var data = {
            term: this.state.term,
            name: this.state.courseName,
            department: this.state.department,
            courseId: this.state.courseId,
            operator: this.state.searchOperand
        }
        //retrieves the courses based on information entered
        await this.props.searchCourse(data);
        console.log("search results: " + this.props.searchCourseStateStore.result)
        const result = this.props.searchCourseStateStore.result;
        if (result !== undefined)
            // this.setState({
            //     searchResult: <CourseCard courses={result.data} />
            // })
            // console.log("searchResult " + this.state.searchResult);

            var searchResult = result.data;
        var searchResultFiltered = searchResult.filter(function (course) {
            var index = searchResult.indexOf(course);
            return index >= 0 && index <= 1;
        }, () => {
            console.log("############################Came here###################333");
            console.log(searchResultFiltered);
        });


        this.setState({
            searchResult: result.data,
            searchResultFiltered: <CourseCard courses={searchResultFiltered} />,

        });



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
                                {this.state.searchResultFiltered}
                            </div>
                            {(() => {
                                if (this.state.searchResultFiltered.length !== 0) {
                                    return (
                                        <div className="row  d-flex justify-content-center">
                                            <button className="btn btn-primary btn-md" style={{ backgroundColor: '#0055a2' }} id="prev" onClick={this.handlePagination}>Prev</button>
                                            <button className="btn btn-primary btn-md btn-md mx-2" style={{ backgroundColor: '#0055a2' }} id="next" onClick={this.handlePagination} >Next</button>
                                        </div>
                                    );
                                }
                            })()
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
        searchCourseStateStore: state.searchCourse,
        courseStateStore: state.course,
        profileStateStore: state.profile,
        loginStateStore: state.login
    }
}

//export default Profile;
export default connect(mapStateToProps, { searchCourse })(SearchCourse);