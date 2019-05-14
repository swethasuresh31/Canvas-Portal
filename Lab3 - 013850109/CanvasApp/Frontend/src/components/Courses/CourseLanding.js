import React, { Component } from 'react';
import { Redirect } from 'react-router';
import StudentCourseLanding from './StudentCourseLanding';
import FacultyCourseLanding from './FacultyCourseLanding';
import { courses } from '../queries/queries';
import { withApollo } from 'react-apollo';


class CourseDetails extends Component {

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
        if (localStorage.isStudent === "1") {
            console.log("Role: Student")
            role = 'student';
            
        } else if (localStorage.isStudent === "0") {
            console.log("Role: Faculty")
            role = 'faculty';
        }
        if (role !== '') {
            this.props.client.query({
                query: courses,
                variables: {
                  username: localStorage.getItem("emailId"),
                  isStudent: parseInt(localStorage.isStudent,10)
                }
              }).then((response) => {
                console.log('Response profile', response.data);
                let result = response.data.courses;
                if(result)
                this.setState({
                    coursework: result.courses
                })
          
            });
          
          
              console.log('data:', this.props.data);
            
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
        console.log(localStorage.isStudent)
        if (localStorage.isStudent === "0") {
            //Return faculty page
            return (
                <FacultyCourseLanding coursework={this.state.coursework}></FacultyCourseLanding>
            );
        } else if (localStorage.isStudent === "1") {
            //Return student page
            return (
                <StudentCourseLanding coursework={this.state.coursework} removeCourseRow={this.removeCourseRow}></StudentCourseLanding>
            );
        } else {
            console.log("Redirecting to login")
            return (<div><Redirect to="/login" /></div>);
        }
    }
}

export default withApollo(CourseDetails);