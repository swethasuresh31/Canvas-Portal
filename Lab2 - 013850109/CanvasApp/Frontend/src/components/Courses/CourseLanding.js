import React, { Component } from 'react';
import { Redirect } from 'react-router';
import StudentCourseLanding from './StudentCourseLanding';
import FacultyCourseLanding from './FacultyCourseLanding';

import { getCourseInformation } from '../../js/actions/CourseAction';
import { connect } from 'react-redux';


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

    async componentDidMount() {

        await this.props.getCourseInformation();
        console.log("course: " + this.props.courseStateStore.result.data)   
        const result = this.props.courseStateStore.result.data;
        this.setState({
          coursework: result
        })
        console.log("coursework "+this.state.coursework);
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
        if (localStorage.userToken && localStorage.userToken !== "undefined") {
            if (localStorage.role === 'faculty') {
            //Return faculty page
            return (
                <FacultyCourseLanding coursework={this.state.coursework}></FacultyCourseLanding>
            );
        } else if (localStorage.role === 'student') {
            //Return student page
            return (
                <StudentCourseLanding coursework={this.state.coursework} removeCourseRow={this.removeCourseRow}></StudentCourseLanding>
            );
        } else {
            return (<div><Redirect to="/login" /></div>);
        }
    }else{
        return (<div><Redirect to="/login" /></div>);
    }
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
  
  //export default Profile;
  export default connect(mapStateToProps, { getCourseInformation })(CourseDetails);