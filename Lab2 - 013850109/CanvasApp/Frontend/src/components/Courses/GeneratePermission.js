import React, { Component } from 'react';
import Navbar from '../LandingPage/Navbar';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import axios from 'axios';

import { getCourseInformation } from '../../js/actions/CourseAction';
import { connect } from 'react-redux';

class GeneratePermission extends Component {

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

    async componentWillMount() {

        await this.props.getCourseInformation();
        console.log("course: " + this.props.courseStateStore.result.data)   
        const result = this.props.courseStateStore.result.data;
        this.setState({
            courses: result
        })
        console.log("courses "+this.state.coursework);
    }
    

    onSelect(e) {
        this.setState({ selectedCourse: e.target.value, permissionCode: '' });
    }


    onGenerate(e) {
        this.setState({ errorMsg: '' })
        //generate the permission code for the course
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
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

const mapStateToProps = state => {
    console.log(JSON.stringify(state))
    return {
      courseStateStore: state.course,
      profileStateStore: state.profile,
      loginStateStore: state.login
    }
  }
  
export default connect(mapStateToProps, { getCourseInformation })(GeneratePermission);