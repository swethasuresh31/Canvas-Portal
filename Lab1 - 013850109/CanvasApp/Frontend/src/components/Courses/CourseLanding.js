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
import StudentCourseLanding from './StudentCourseLanding';
import FacultyCourseLanding from './FacultyCourseLanding';

const cookies = new Cookies();

export default class CourseDetails extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            selectedPath: "1",
            coursework: []
        };
        this.removeCourseRow = this.removeCourseRow.bind(this);
    }

    componentDidMount() {
        let role = '';
        let user = '';
        if (cookie.load('cookieS')) {
            role = 'student';
            user = cookies.get('cookieS')

        } else if (cookie.load('cookieF')) {
            role = 'faculty';
            user = cookies.get('cookieF')
        }
        if (role !== '') {
            axios.get('http://localhost:3001/usercourse/' + encodeURI(user) + '?role=' + role)
                .then((response) => {
                    console.log(response);
                    if (response !== undefined)
                        this.setState({ coursework: response.data })
                })
        }
    }

    removeCourseRow = (courseUid) => {
        let index = this.state.coursework.findIndex(row => row.course_uid === courseUid)
        var newCoursework = [...this.state.coursework]
        newCoursework.splice(index,1);
        this.setState({coursework: newCoursework});
    }

    onItemSelection = arg => {
        this.setState({ selectedPath: arg.path });
    };

    render() {
        if (cookie.load('cookieF')) {
            //Return faculty page
            return (
                <FacultyCourseLanding coursework={this.state.coursework}></FacultyCourseLanding>
            );
        } else if (cookie.load('cookieS')) {
            //Return student page
            return (
                <StudentCourseLanding coursework={this.state.coursework} removeCourseRow={this.removeCourseRow}></StudentCourseLanding>
            );
        } else {
            return (<div><Redirect to="/login" /></div>);
        }
    }
}