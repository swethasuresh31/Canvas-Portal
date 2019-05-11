import React, { Component } from 'react';
import '../Login/Login.css';
import logo from '../../img/sjsu-full-logo.png'
import headerLogo from '../../img/sjsu-header-logo.png'
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import {signup} from '../mutations/mutations';
import { graphql } from 'react-apollo';

//Define a Login Component
class Signup extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            firstName: "",
            lastName: "",
            emailId: "",
            password: "",
            role: "student",
            confirmPassword: "",
            authFlag: false,
            redirectVar: ""
        }
        //Bind the handlers to this class
        this.fnameChangeHandler = this.fnameChangeHandler.bind(this);
        this.lnameChangeHandler = this.lnameChangeHandler.bind(this);
        this.emailIdChangeHandler = this.emailIdChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.confirmPasswordChangeHandler = this.confirmPasswordChangeHandler.bind(this);
        this.roleChangeHandler = this.roleChangeHandler.bind(this);
        this.submitSignup = this.submitSignup.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }
    //first name change handler to update state variable with the text entered by the user
    fnameChangeHandler = (e) => {
        this.setState({
            firstName: e.target.value,
            errorMsg: ''
        })
    }
    //username change handler to update state variable with the text entered by the user
    lnameChangeHandler = (e) => {
        this.setState({
            lastName: e.target.value,
            errorMsg: ''
        })
    }
    //username change handler to update state variable with the text entered by the user
    emailIdChangeHandler = (e) => {
        this.setState({
            emailId: e.target.value,
            errorMsg: ''
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value,
            errorMsg: ''
        })
    }
    confirmPasswordChangeHandler = (e) => {
        this.setState({
            confirmPassword: e.target.value,
            errorMsg: ''
        })
    }

    roleChangeHandler = (e) => {
        this.setState({
            role: e.target.value,
            errorMsg: ''
        })
    }


    validate = () => {
        if (this.state.name === '') {
            this.setState({ errorMsg: '*Name cannot be empty' })
            return false;
        }

        if (this.state.emailId === '') {
            this.setState({ errorMsg: '*Email Id cannot be empty' })
            return false;
        }

        if (this.state.password === '') {
            this.setState({ errorMsg: '*Password cannot be empty' })
            return false;
        }

        if (this.state.confirmPassword === '') {
            this.setState({ errorMsg: '*Confirm password cannot be empty' })
            return false;
        }

        if (this.state.password !== this.state.confirmPassword) {
            this.setState({ errorMsg: '*Passwords did not match' })
            return false;
        }

        return true;
    }

    //submit Login handler to send a request to the node backend
    submitSignup = (e) => {
        // var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        console.log("validating");
        if (!this.validate()) return;
        console.log("validated");

        this.setState({ errorMsg: '' })

        // const data = {
        //     firstName: this.state.firstName,
        //     lastName: this.state.lastName,
        //     emailId: this.state.emailId,
        //     password: this.state.password,
        //     role: this.state.role
        // }

        this.props.signup({
            variables: {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                emailId: this.state.emailId,
                password: this.state.password,
                role: this.state.role
            }
        }).then((response)=>{
            console.log('Response', response.data);
            if(response.data.signup.success === true){
                this.setState({
                    errorMsg : '',
                    redirectVar: <Redirect to="/login" />
                });
            }
            if(response.data.signup.duplicateUser === true){
                this.setState({
                    errorMsg : "User already exists"
                });
            }
        });
        // //set the with credentials to true
        // axios.defaults.withCredentials = true;
        // //make a post request with the user data
        // axios.post('http://localhost:3001/signup', data)
        //     .then(response => {
        //         console.log("Status Code : ", response.status);
        //         if (response.status === 200) {
        //             this.setState({
        //                 redirectVar: <Redirect to="/login" />
        //             })
        //         } else {
        //             this.setState({
        //                 errorMsg: 'Unable to signup! ' + response.data
        //             })
        //         }
        //     });
    }

    render() {
        //redirect based on successful login
        // let redirectVar = null;
        // if (cookie.load('cookie')) {
        //     redirectVar = <Redirect to="/home" />
        // }
        return (
            <div>
                {this.state.redirectVar}
                <div className="content">
                    <div className="applogin-banner">
                        <div className="applogin-background"></div>
                        <div className="applogin-container">
                            <h1>
                                Connecting to<div className="applogin-app-logo">
                                    <img src={headerLogo} alt="SJSU Single Sign-on" className="logo sanjosestateuniversity_devshibbolethsp_1" /></div>
                            </h1>
                            <p>Sign-up for your San Jose State University account to access SJSU Single Sign-on</p>
                        </div>
                    </div>
                    <div id="signin-container">
                        <div data-se="auth-container" id="sjsu-sign-in" className="auth-container main-container no-beacon">
                            <div className="sjsu-sign-in-header auth-header">
                                <img src={logo} className="auth-org-logo" alt="San Jose State University" />
                                <div data-type="beacon-container" className="beacon-container"></div>
                            </div>
                            <div className="auth-content">
                                <div className="auth-content-inner">
                                    <div className="primary-auth">
                                        <form method="POST" data-se="o-form" id="form18" className="primary-auth-form o-form o-form-edit-mode">
                                            <div data-se="o-form-content" className="o-form-content o-form-theme clearfix">
                                                <h2 data-se="o-form-head" className="sjsu-form-title o-form-head">Sign Up</h2>
                                                <div className="o-form-error-container" data-se="o-form-error-container"></div>
                                                <div className="o-form-fieldset-container" data-se="o-form-fieldset-container">
                                                    <div data-se="o-form-fieldset" className="o-form-fieldset o-form-label-top">
                                                        <div data-se="o-form-input-container" className="o-form-input">
                                                            <span data-se="o-form-input-username" className="o-form-input-name-username o-form-control sjsu-form-input-field input-fix focused-input">
                                                                <span className="input-tooltip icon form-help-16" data-hasqtip="0"></span>
                                                                <span className="icon input-icon person-16-gray"></span>
                                                                <input type="text" placeholder="First Name" name="fname" id="sjsu-signin-first-name" onChange={this.fnameChangeHandler} aria-label="Name" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div data-se="o-form-fieldset" className="o-form-fieldset o-form-label-top">
                                                        <div data-se="o-form-input-container" className="o-form-input">
                                                            <span data-se="o-form-input-username" className="o-form-input-name-username o-form-control sjsu-form-input-field input-fix focused-input">
                                                                <span className="input-tooltip icon form-help-16" data-hasqtip="0"></span>
                                                                <span className="icon input-icon person-16-gray"></span>
                                                                <input type="text" placeholder="Last Name" name="lname" id="sjsu-signin-last-name" onChange={this.lnameChangeHandler} aria-label="Name" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div data-se="o-form-fieldset" className="o-form-fieldset o-form-label-top">
                                                        <div data-se="o-form-input-container" className="o-form-input">
                                                            <span data-se="o-form-input-email" className="o-form-input-name-password-email o-form-control sjsu-form-input-field input-fix">
                                                                <span className="input-tooltip icon form-help-16" data-hasqtip="1"></span>
                                                                <span className="icon input-icon remote-lock-16"></span>
                                                                <input type="email" placeholder="Email ID" name="emailId" id="sjsu-signin-email" onChange={this.emailIdChangeHandler} aria-label="Email ID" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div data-se="o-form-fieldset" className="o-form-fieldset o-form-label-top">
                                                        <div data-se="o-form-input-container" className="o-form-input">
                                                            <span data-se="o-form-input-password" className="o-form-input-name-password o-form-control sjsu-form-input-field input-fix">
                                                                <span className="input-tooltip icon form-help-16" data-hasqtip="1"></span>
                                                                <span className="icon input-icon remote-lock-16"></span>
                                                                <input type="password" placeholder="Enter Password" name="password" id="sjsu-signin-password" onChange={this.passwordChangeHandler} aria-label="Password" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div data-se="o-form-fieldset" className="o-form-fieldset o-form-label-top">
                                                        <div data-se="o-form-input-container" className="o-form-input">
                                                            <span data-se="o-form-input-password" className="o-form-input-name-password o-form-control sjsu-form-input-field input-fix">
                                                                <span className="input-tooltip icon form-help-16" data-hasqtip="1"></span>
                                                                <span className="icon input-icon remote-lock-16"></span>
                                                                <input type="password" placeholder="Confirm Password" name="confirmPassword" id="sjsu-signin-confirm-password" onChange={this.confirmPasswordChangeHandler} aria-label="Password" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>I am a <input type="radio" name="role" id="sjsu-signin-radio" onChange={this.roleChangeHandler} value="student" aria-label="student" checked="checked"/> Student <input type="radio" name="role" id="sjsu-signin-radio" onChange={this.roleChangeHandler} value="faculty" aria-label="faculty" /> Faculty</div>
                                                </div>
                                            </div>
                                            <div className="errorMsg">{this.state.errorMsg}</div>
                                            <div className="o-form-button-bar"><input className="button button-primary" type="submit" value="Sign Up" id="sjsu-signin-submit" onClick={this.submitSignup} data-type="save" /></div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
//export Login Component
export default graphql(signup, { name: "signup" })(Signup);
