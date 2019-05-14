import React, { Component } from 'react';

import Card from './Card';
import Navbar from '../LandingPage/Navbar';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import Cookies from 'universal-cookie';
import { courses } from '../queries/queries';
import { withApollo } from 'react-apollo';

const cookies = new Cookies();

class Dashboard extends Component {

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

  render() {
    if (localStorage.isAuthenticated) {
      //Return faculty page
      return (
        <div>
          <div className="row">
          <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
              <Navbar selected="dashboard" />
            </ div>
            <div className="col">
              <div className="row">

                <div className="col pb-3">
                  <br />
                  <Heading theme={{ borderPadding: "1rem" }} border="bottom">Dashboard</ Heading>
                </ div>
              </ div>
              <div className="row" style={{ marginLeft: "15px" }}>
                <div className="card-deck d-flex flex-wrap">
                  {
                    this.state.coursework.map(course => {
                      return (
                        <Card course={course}/>
                      )
                    })
                  }
                </ div>
              </ div>
            </ div>
          </ div>
        </ div>
      );
    } else {
      return (<div><Redirect to="/login" /></div>);
    }
  }
}
export default withApollo(Dashboard);