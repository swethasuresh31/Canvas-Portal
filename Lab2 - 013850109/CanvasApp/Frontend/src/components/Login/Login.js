import React, { Component } from 'react';
import './Login.css';
import logo from '../../img/sjsu-full-logo.png'
import headerLogo from '../../img/sjsu-header-logo.png'
// import SignUp from '../Signup/Signup.js'
import axios from 'axios'
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom'


import { connect } from 'react-redux';
import { submitLogin } from '../../js/actions/index';
import { Field, reduxForm } from 'redux-form';

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
    }


    //Define component to be rendered
    renderField(field) {

        // const { meta: { touched, error } } = field;
        // const className = touched && error ? "form-control form-control-lg is-invalid" : "form-control form-control-lg";
        // const inputType = field.type;
        // const inputPlaceholder = field.placeholder;
        // //const errorMessageStyling =  touched && error ? "text-danger" : "";

        // return (
        //         <input type={inputType} placeholder={inputPlaceholder} {...field.input} />
        // );

        console.log(field);
        const { meta: { touched, error } } = field;
        console.log('filef name', field.placeholder);
        const inputType = field.type;
        const inputPlaceholder = field.placeholder;
        const errorMessageStyling = touched && error ? "text-danger" : "";
        var divClassName = "";

            return (
                <div>
                    <div data-se="o-form-fieldset" className="o-form-fieldset o-form-label-top">
                        <div data-se="o-form-input-container" className="o-form-input">
                            <span data-se="o-form-input-email" className="o-form-input-name-password-email o-form-control sjsu-form-input-field input-fix">
                                <span className="input-tooltip icon form-help-16" data-hasqtip="1"></span>
                                <span className="icon input-icon remote-lock-16"></span>
                                <input type={inputType} placeholder={inputPlaceholder} {...field.input} />

                            </span>
                        </div>
                    </div >
                    <div className={errorMessageStyling}>
                        <div>{touched ? error : ""}</div>

                    </div>
                </div>
            );
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
    onSubmit(values) {
        axios.defaults.withCredentials = true;
         var data = {
             username: values.username,
             password: values.password
         }
 
         this.props.submitLogin(data);
     }

    render() {
        //redirect based on successful login
        let redirectVar = null;        
        console.log(localStorage.userToken);
        // if (this.props.loginStateStore.result) {
        //     if(this.props.loginStateStore.result.authFlag === true){
        //         redirectVar = <Redirect to="/" />
        //     }
            
        // }
        console.log(JSON.stringify(this.props.loginStateStore))
        if (localStorage.userToken && localStorage.userToken !== "undefined") {
            redirectVar = <Redirect to="/dashboard" />
        }

        let errorPanel = null;
        if (this.props.loginStateStore.result) {
        if (this.props.loginStateStore.result.authFlag === false) {
            errorPanel = <div>
                <div className="alert alert-danger" role="alert">
                    Username and Password does not match!
                </div>
            </div>
        }
        }
        
        
        const { handleSubmit } = this.props;

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
                                        <form name="loginForm" onSubmit={handleSubmit(this.onSubmit.bind(this))} data-se="o-form" id="form18" className="primary-auth-form o-form o-form-edit-mode">
                                            <div data-se="o-form-content" className="o-form-content o-form-theme clearfix">
                                                <h2 data-se="o-form-head" className="sjsu-form-title o-form-head">Sign In</h2>
                                                <div className="o-form-error-container" data-se="o-form-error-container"></div>
                                                <div className="o-form-fieldset-container" data-se="o-form-fieldset-container">
                                                                <Field
                                                                name="username"
                                                                id="username"
                                                                type="text"
                                                                placeholder="Enter SJSU ID"
                                                                component={this.renderField}
                                                            />                                                            
                                                                <Field
                                                                name="password"
                                                                id="password"
                                                                type="password"
                                                                placeholder="Password"
                                                                component={this.renderField}
                                                            />                                                            
                                                </div>
                                            </div>
                                            {errorPanel}
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

const mapStateToProps = state => ({
    loginStateStore: state.login
});

function validate(values) {
    console.log('inside login validate');

    const errors = {};
    if (!values.username) {
        errors.username = "Enter Username";
    }
    if (!values.password) {
        errors.password = "Enter Password";
    }
    return errors;
}

export default reduxForm({
    validate,
    form: "loginForm"
})(connect(mapStateToProps, { submitLogin })(Login));