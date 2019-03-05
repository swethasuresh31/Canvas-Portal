import React, { Component } from 'react';
import '../Login/Login.css';
import logo from '../../img/sjsu-full-logo.png'
import headerLogo from '../../img/sjsu-header-logo.png'
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';

//Define a Login Component
class Login extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            name: "",
            emailId: "",
            password: "",
            role: "student",
            confirmPassword: "",
            authFlag: false,
            redirectVar: ""
        }
        //Bind the handlers to this class
        this.nameChangeHandler = this.nameChangeHandler.bind(this);
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
    //username change handler to update state variable with the text entered by the user
    nameChangeHandler = (e) => {
        this.setState({
            name: e.target.value,
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
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        console.log("validating");
        if (!this.validate()) return;
        console.log("validated");

        this.setState({ errorMsg: '' })

        const data = {
            username: this.state.emailId,
            password: this.state.password,
            name: this.state.name,
            role: this.state.role
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/signup', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        redirectVar: <Redirect to="/login" />
                    })
                } else {
                    this.setState({
                        errorMsg: 'Unable to signup! ' + response.data
                    })
                }
            });
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
                <div class="content">
                    <div class="applogin-banner">
                        <div class="applogin-background"></div>
                        <div class="applogin-container">
                            <h1>
                                Connecting to<div class="applogin-app-logo">
                                    <img src={headerLogo} alt="SJSU Single Sign-on" class="logo sanjosestateuniversity_devshibbolethsp_1" /></div>
                            </h1>
                            <p>Sign-up for your San Jose State University account to access SJSU Single Sign-on</p>
                        </div>
                    </div>
                    <div id="signin-container">
                        <div data-se="auth-container" id="sjsu-sign-in" class="auth-container main-container no-beacon">
                            <div class="sjsu-sign-in-header auth-header">
                                <img src={logo} class="auth-org-logo" alt="San Jose State University" />
                                <div data-type="beacon-container" class="beacon-container"></div>
                            </div>
                            <div class="auth-content">
                                <div class="auth-content-inner">
                                    <div class="primary-auth">
                                        <form method="POST" data-se="o-form" id="form18" class="primary-auth-form o-form o-form-edit-mode">
                                            <div data-se="o-form-content" class="o-form-content o-form-theme clearfix">
                                                <h2 data-se="o-form-head" class="sjsu-form-title o-form-head">Sign Up</h2>
                                                <div class="o-form-error-container" data-se="o-form-error-container"></div>
                                                <div class="o-form-fieldset-container" data-se="o-form-fieldset-container">
                                                    <div data-se="o-form-fieldset" class="o-form-fieldset o-form-label-top">
                                                        <div data-se="o-form-input-container" class="o-form-input">
                                                            <span data-se="o-form-input-username" class="o-form-input-name-username o-form-control sjsu-form-input-field input-fix focused-input">
                                                                <span class="input-tooltip icon form-help-16" data-hasqtip="0"></span>
                                                                <span class="icon input-icon person-16-gray"></span>
                                                                <input type="text" placeholder="Name" name="username" id="sjsu-signin-username" onChange={this.nameChangeHandler} aria-label="Name" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div data-se="o-form-fieldset" class="o-form-fieldset o-form-label-top">
                                                        <div data-se="o-form-input-container" class="o-form-input">
                                                            <span data-se="o-form-input-email" class="o-form-input-name-password-email o-form-control sjsu-form-input-field input-fix">
                                                                <span class="input-tooltip icon form-help-16" data-hasqtip="1"></span>
                                                                <span class="icon input-icon remote-lock-16"></span>
                                                                <input type="email" placeholder="Email ID" name="emailId" id="sjsu-signin-email" onChange={this.emailIdChangeHandler} aria-label="Email ID" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div data-se="o-form-fieldset" class="o-form-fieldset o-form-label-top">
                                                        <div data-se="o-form-input-container" class="o-form-input">
                                                            <span data-se="o-form-input-password" class="o-form-input-name-password o-form-control sjsu-form-input-field input-fix">
                                                                <span class="input-tooltip icon form-help-16" data-hasqtip="1"></span>
                                                                <span class="icon input-icon remote-lock-16"></span>
                                                                <input type="password" placeholder="Enter Password" name="password" id="sjsu-signin-password" onChange={this.passwordChangeHandler} aria-label="Password" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div data-se="o-form-fieldset" class="o-form-fieldset o-form-label-top">
                                                        <div data-se="o-form-input-container" class="o-form-input">
                                                            <span data-se="o-form-input-password" class="o-form-input-name-password o-form-control sjsu-form-input-field input-fix">
                                                                <span class="input-tooltip icon form-help-16" data-hasqtip="1"></span>
                                                                <span class="icon input-icon remote-lock-16"></span>
                                                                <input type="password" placeholder="Confirm Password" name="confirmPassword" id="sjsu-signin-confirm-password" onChange={this.confirmPasswordChangeHandler} aria-label="Password" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>I am a <input type="radio" name="role" id="sjsu-signin-radio" onChange={this.roleChangeHandler} value="student" aria-label="student" checked="checked"/> Student <input type="radio" name="role" id="sjsu-signin-radio" onChange={this.roleChangeHandler} value="faculty" aria-label="faculty" /> Faculty</div>
                                                </div>
                                            </div>
                                            <div clasName="errorMsg">{this.state.errorMsg}</div>
                                            <div class="o-form-button-bar"><input class="button button-primary" type="submit" value="Sign Up" id="sjsu-signin-submit" onClick={this.submitSignup} data-type="save" /></div>
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
export default Login;