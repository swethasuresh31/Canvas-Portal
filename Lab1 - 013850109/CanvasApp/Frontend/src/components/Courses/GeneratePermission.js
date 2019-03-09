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
            
        }
        

    }

    

    onGenerate(e) {
        e.preventDefault();
        console.log("validating");
        if (!this.validate()) return;
        console.log("validated");
        console.log(this.state.searchOperand);
        this.setState({ errorMsg: '' })
        //retrieves the courses based on information entered
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
                                    <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">Generate Permission Code</ Heading></div>
                            </div>
                            <br /><br />
                            <div className="row d-flex justify-content-center">
                                <form>
                                <fieldset disabled>
                                <div class="form-group">
                                  <label for="disabledTextInput">Disabled input</label>
                                  <input type="text" id="disabledTextInput" class="form-control" placeholder="Disabled input" />
                                </div>
                                <div class="form-check">
                                <button type="submit" class="btn btn-primary">Generate Permission Code</button>
                                </div>
                              </fieldset>   
                                </form>

                            </div>
                           
                        </div>
                    </div>

                </div>
            </div>
        );

    }
}