import React, { Component } from 'react';
import './Login.css';
import logo from '../../img/sjsu-full-logo.png'
import headerLogo from '../../img/sjsu-header-logo.png'
// import SignUp from '../Signup/Signup.js'
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom'

//Define a Login Component
class Login extends Component {
    //call the constructor method
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            username: "",
            password: "",
            authFlag: false
        }
        //Bind the handlers to this class
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount() {
        this.setState({
            authFlag: false
        })
    }
    //username change handler to update state variable with the text entered by the user
    usernameChangeHandler = (e) => {
        this.setState({
            username: e.target.value,
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

    validate = () => {
        if (this.state.username === '') {
            this.setState({ errorMsg: '*Username cannot be empty' })
            return false;
        }

        if (this.state.password === '') {
            this.setState({ errorMsg: '*Password cannot be empty' })
            return false;
        }

        return true;
    }

    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();

        if (!this.validate()) return;

        this.setState({ errorMsg: '' })

        const data = {
            username: this.state.username,
            password: this.state.password
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/login', data)
            .then(response => {
                console.log("Login response : ", response);
                if (response.status === 200) {
                    localStorage.setItem('userToken', response.data.token)
                    this.setState({
                        authFlag: true
                    })
                } else {
                    this.setState({
                        authFlag: false
                    })
                }
            });
    }

    render() {
        //redirect based on successful login
        let redirectVar = null;
        if(this.state.authFlag) {
            redirectVar = <Redirect to="/account" />
        }
        return (
            <div>
                {redirectVar}
                <div className="content">
                    <div className="applogin-banner">
                        <div className="applogin-background"></div>
                        <div className="applogin-container">
                            <h1>
                                Connecting to<div className="applogin-app-logo">
                                    <img src={headerLogo} alt="SJSU Single Sign-on" className="logo sanjosestateuniversity_devshibbolethsp_1" /></div>
                            </h1>
                            <p>Sign-in with your San Jose State University account to access SJSU Single Sign-on</p>
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
                                        <form data-se="o-form" id="form18" className="primary-auth-form o-form o-form-edit-mode">
                                            <div data-se="o-form-content" className="o-form-content o-form-theme clearfix">
                                                <h2 data-se="o-form-head" className="sjsu-form-title o-form-head">Sign In</h2>
                                                <div className="o-form-error-container" data-se="o-form-error-container"></div>
                                                <div className="o-form-fieldset-container" data-se="o-form-fieldset-container">
                                                    <div data-se="o-form-fieldset" className="o-form-fieldset o-form-label-top">
                                                        <div data-se="o-form-input-container" className="o-form-input">
                                                            <span data-se="o-form-input-username" className="o-form-input-name-username o-form-control sjsu-form-input-field input-fix focused-input">
                                                                <span className="input-tooltip icon form-help-16" data-hasqtip="0"></span>
                                                                <span className="icon input-icon person-16-gray"></span>
                                                                <input type="text" placeholder="SJSU ID" name="username" id="sjsu-signin-username" aria-label="SJSU ID Number" onChange={this.usernameChangeHandler} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div data-se="o-form-fieldset" className="o-form-fieldset o-form-label-top">
                                                        <div data-se="o-form-input-container" className="o-form-input">
                                                            <span data-se="o-form-input-password" className="o-form-input-name-password o-form-control sjsu-form-input-field input-fix">
                                                                <span className="input-tooltip icon form-help-16" data-hasqtip="1"></span>
                                                                <span className="icon input-icon remote-lock-16"></span>
                                                                <input type="password" placeholder="Password" name="password" id="sjsu-signin-password" aria-label="Password" onChange={this.passwordChangeHandler} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="errorMsg">{this.state.errorMsg}</div>
                                            <div className="o-form-button-bar"><button className="button button-primary" value="Sign In" id="sjsu-signin-submit" data-type="save" onClick={this.submitLogin}>Sign In</button></div>
                                        </form>
                                        <div className="auth-footer">
                                            <a href="/signup">Signup for an account</a>

                                        </div>
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