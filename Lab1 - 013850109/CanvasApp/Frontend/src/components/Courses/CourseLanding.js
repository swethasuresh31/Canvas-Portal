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
    }

    componentDidMount() {
        let role = '';
        if (cookie.load('cookieS')) {
            role = 'student';
        } else if (cookie.load('cookieS')) {
            role = 'faculty';
        }
        if (role !== '') {
            let user = cookies.get('cookieS')
            axios.get('http://localhost:3001/usercourse/' + encodeURI(user) + '?role=' + role)
                .then((response) => {
                    console.log(response);
                    if (response !== undefined)
                        this.setState({ coursework: response.data })
                })
        }
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
                <StudentCourseLanding coursework={this.state.coursework}></StudentCourseLanding>
            );
        } else {
            return (<div><Redirect to="/login" /></div>);
        }
    }
}