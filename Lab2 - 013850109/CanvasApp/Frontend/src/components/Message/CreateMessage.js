import React, { Component } from 'react';
import Navbar from '../LandingPage/Navbar';
import MessageNav from './MessageNav';
import MessageCard from './MessageCard';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import styled from "styled-components";
import axios from 'axios'
import {rooturl} from '../../config/settings';
import { Link } from 'react-router-dom';

import { Breadcrumb, BreadcrumbLink } from '@instructure/ui-breadcrumb';

import { getProfileInformation } from '../../js/actions/ProfileAction';
import { getCourseHome } from '../../js/actions/CourseHomeAction';
import { getCourseInformation } from '../../js/actions/CourseAction';
import { connect } from 'react-redux';

import {
    AppContainer as BaseAppContainer,
    ExampleNavigation as Navigation,
    ExampleBody as Body
} from "./MessageNavStyle.js";
import { IconAddLine } from '@instructure/ui-icons';

const AppContainer = styled(BaseAppContainer)`
  height: calc(100vh - 40px);
  padding:20px;
`;

const themeCourse = {
    hoverBgColor: "#f5f5f5",
    selectionBgColor: "#f5f5f5",
    selectionIconColor: "#03A9F4"
};


class MessageInbox extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        var preFilled = (this.props.location.message !== undefined);
        this.state = {
            errorMsg: '',
            subject: '',
            body: '',
            sender: '',
            recipient: '',
            courseId: '',
            redirectVar: '',
            course: [],
            people:[]
        };
        if (preFilled) {
            this.state = {
                errorMsg: '',
                subject: 'RE: ' + this.props.location.message.subject,
                body: '',
                sender: '',
                recipient: this.props.location.message.recipient,
                course: [],
                courseId:'',
                redirectVar: '',
                people:[],
                prefilled: true
            }
        }

        this.onSend = this.onSend.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.subjectChangeHandler = this.subjectChangeHandler.bind(this);
        this.bodyChangeHandler = this.bodyChangeHandler.bind(this);
        this.recipientChangeHandler = this.recipientChangeHandler.bind(this);
        this.courseChangeHandler = this.courseChangeHandler.bind(this);

    }

    async componentWillMount() {
        await this.props.getCourseInformation();
        console.log("course: " + this.props.courseStateStore.result.data)
        const result = this.props.courseStateStore.result.data;
        this.setState({
            course: result
        }, () =>{
            console.log(this.state.course);
        })
    }

    clearForm = () => {
        this.setState({
            redirectVar: <Redirect to='/message/inbox' />
        })
    }

    subjectChangeHandler = (e) => {
        this.setState({
            subject: e.target.value,
            errorMsg: ''
        })
    }

    bodyChangeHandler = (e) => {
        this.setState({
            body: e.target.value,
            errorMsg: ''
        })
    }
    senderChangeHandler = (e) => {
        this.setState({
            sender: e.target.value,
            errorMsg: ''
        })
    }
    recipientChangeHandler = (e) => {
        const val = e.target.value
        this.setState({
            recipient: val,
            errorMsg: ''
        })
    }

    courseChangeHandler = async (e) => {
        const val = e.target.value
        console.log(val)
        if(e.target.value !== "novalue"){
        await this.props.getCourseHome(val)
        
                console.log("course: " + this.props.courseHomeStateStore.result.data)   
                const result1 = this.props.courseHomeStateStore.result.data;
                var created = [  { emailId: result1.created_by, name: 'Faculty' } ]
                this.setState({
                    people: [...result1.enrolled,...created],
                    courseId: val,
                    errorMsg: ''
        }, () => {
            console.log(this.state.people);
        })
    }
}


    validate = () => {
        if ((this.state.subject === '')) {
            this.setState({ errorMsg: '*Please enter message subject' })
            return false;
        }
        if ((this.state.body === '')) {
            this.setState({ errorMsg: '*Please enter message body' })
            return false;
        }
        if ((this.state.recipient === '')) {
            this.setState({ errorMsg: '*Please enter a valid recipient address' })
            return false;
        }

        return true;
    }

    onSend(e) {
        e.preventDefault();
        console.log("validating");
        if (!this.validate()) return;
        console.log("validated");
        console.log('adding')
        let data = {
            subject: this.state.subject,
            body: this.state.body,
            recipient: this.state.recipient
        }
        let inboxPage = "/message/inbox";
        //sends message to the recipient
        axios.defaults.headers.common['Authorization'] = 'jwt ' + localStorage.getItem('userToken');
        axios.post('http://' + rooturl + ':3001/message/', data)
            .then((response) => {
                console.log(response);
                if (response !== undefined)
                    if (response.status === 200) {
                        this.setState({
                            redirectVar: <Redirect to={inboxPage} />
                        })
                        console.log(this.state.redirectVar);
                    }
            })
    }

    render() {
        
        let senderAddress = localStorage.user;
        if (localStorage.userToken && localStorage.userToken !== "undefined") {
            if (this.state.prefilled) {
                return (
                    <div className="container-fluid md-0 p-0">
                        {this.state.redirectVar}
                        <div className="row">
                            <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                                <Navbar selected="inbox" />
                            </div>
                            <div className="col">
                                <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">
                                    Mailbox
                            </Heading>
                                <div className="row">
                                    <div className="col">
                                        <a href="/message/create" class="btn btn-primary btn-lg active  m-3 p-2" style={{ backgroundColor: '#0055a2' }} role="button" aria-pressed="true"><IconAddLine /> Compose Message</a>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col col-sm-2">
                                        <br /> <MessageNav selected="inbox" />
                                    </div>

                                    <div className="col">
                                        <div className="row">


                                            <div className="col">
                                                <br />
                                                <div class="row justify-content-md-center">
                                                    <div class="col">
                                                        <form>
                                                            <div class="dropdown mb-3">
                                                                <div className="row input-group mb-3">
                                                                    <div class="input-group-prepend">
                                                                        <label class="input-group-text" for="inputGroupSelect05">Course:</label>
                                                                    </div>
                                                                    <select class="custom-select" onChange={this.courseChangeHandler} disabled >
                                                                        <option value="" selected>select course..</option>
                                                                        {
                                                                            this.state.course.map(course1 => {
                                                                                return (
                                                                                    <option value={course1.course_uid}>{course1.course_dept_code + ' - ' + course1.course_id + ' - ' + course1.course_name}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <div class="row input-group mb-3">
                                                                    <div class="input-group-prepend">
                                                                        <label class="input-group-text" for="inputGroupSelect05">From:</label>
                                                                    </div>
                                                                    <input type="text" class="form-control" value={senderAddress} readonly />
                                                                </div>
                                                                <div class="row input-group mb-3">
                                                                    <div class="input-group-prepend">
                                                                        <label class="input-group-text" for="inputGroupSelect05">To:</label>
                                                                    </div>
                                                                    <input type="text" class="form-control" value={this.state.recipient} readonly />
                                                                </div>
                                                                <div class="row input-group mb-3">
                                                                    <div class="input-group-prepend">
                                                                        <label class="input-group-text" for="inputGroupSelect05">Subject:</label>
                                                                    </div>
                                                                    <input type="text" class="form-control" value={this.state.subject} readonly />
                                                                </div>
                                                                <div class="row input-group mb-3">
                                                                    <textarea class="form-control" id="inputGroupSelect05" rows="5" value={this.state.body} onChange={this.bodyChangeHandler} placeholder="Enter the message here..." />
                                                                </div>
                                                                <div>{this.state.errorMsg}</div><br />
                                                                <div class="row input-group mb-3 justify-content-center">
                                                                    <button type="button" class="btn btn-secondary btn-md mx-2" onClick={() => this.clearForm()}>Discard</button>
                                                                    <button type="button" class="btn btn-primary btn-md mx-2" style={{ backgroundColor: '#0055a2' }} onClick={this.onSend} >Send</button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="container-fluid md-0 p-0">
                        {this.state.redirectVar}
                        <div className="row">
                            <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
                                <Navbar selected="inbox" />
                            </div>
                            <div className="col">
                                <br /><Heading theme={{ borderPadding: "1rem" }} border="bottom">
                                    Mailbox
                            </Heading>
                                <div className="row">
                                    <div className="col">
                                        <a href="/message/create" class="btn btn-primary btn-lg active  m-3 p-2" style={{ backgroundColor: '#0055a2' }} role="button" aria-pressed="true"><IconAddLine /> Compose Message</a>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col col-sm-2">
                                        <br /> <MessageNav selected="inbox" />
                                    </div>

                                    <div className="col">
                                        <div className="row">


                                            <div className="col">
                                                <br />
                                                <div class="row justify-content-md-center">
                                                    <div class="col">
                                                        <form>
                                                            <div class="dropdown mb-3">
                                                                <div className="row input-group mb-3">
                                                                    <div class="input-group-prepend">
                                                                        <label class="input-group-text" for="inputGroupSelect05">Course:</label>
                                                                    </div>
                                                                    <select class="custom-select" onChange={this.courseChangeHandler} value={this.state.courseId}>
                                                                    <option value="novalue">Select Course..</option>
                                                                        {
                                                                            this.state.course.map(course1 => {
                                                                                return (
                                                                                    <option value={course1.course_uid}>{course1.course_dept_code + ' - ' + course1.course_id + ' - ' + course1.course_name}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <div class="row input-group mb-3">
                                                                    <div class="input-group-prepend">
                                                                        <label class="input-group-text" for="inputGroupSelect05">To:</label>
                                                                    </div>
                                                                    <select class="custom-select" onChange={this.recipientChangeHandler} value={this.state.recipient} placeholder="Select Recipient">
                                                                        <option value="novalue" selected>Select Recipient...</option>
                                                                        {
                                                                            this.state.people.map(user => {
                                                                                return (
                                                                                    <option value={user.emailId}>{user.emailId}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <div class="row input-group mb-3">
                                                                    <div class="input-group-prepend">
                                                                        <label class="input-group-text" for="inputGroupSelect05">Subject:</label>
                                                                    </div>
                                                                    <input type="text" class="form-control" value={this.state.subject} onChange={this.subjectChangeHandler} />
                                                                </div>
                                                                <div class="row input-group mb-3">
                                                                    <textarea class="form-control" id="inputGroupSelect05" rows="5" value={this.state.body} onChange={this.bodyChangeHandler} placeholder="Enter the message here..." />
                                                                </div>
                                                                <div>{this.state.errorMsg}</div><br />
                                                                <div class="row input-group mb-3 justify-content-center">
                                                                    <button type="button" class="btn btn-secondary btn-md mx-2" onClick={() => this.clearForm()}>Discard</button>
                                                                    <button type="button" class="btn btn-primary btn-md mx-2" style={{ backgroundColor: '#0055a2' }} onClick={this.onSend} >Send</button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }
        else {
            return (<div><Redirect to="/login" /></div>);
        }

    }
}
const mapStateToProps = state => {
    console.log(JSON.stringify(state))
    return {
        courseStateStore: state.course,
        courseHomeStateStore: state.courseHome,
        profileStateStore: state.profile,
        loginStateStore: state.login
    }
}

export default connect(mapStateToProps, { getProfileInformation, getCourseInformation, getCourseHome })(MessageInbox);