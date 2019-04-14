import React, { Component } from 'react';
import '../Login/Login.css';
import logo from '../../img/sjsu-full-logo.png'
import headerLogo from '../../img/sjsu-header-logo.png'
import { Redirect } from 'react-router';

import { connect } from 'react-redux';
import { signup } from '../../js/actions/index';
import { Field, reduxForm } from 'redux-form';

//Define a Login Component
class Signup extends Component {
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


    validation = (values) => {
        console.log("In validation")
        if (values.name === '') {
            this.setState({ errorMsg: '*Name cannot be empty' })
            return false;
        }

        if (values.emailId === '') {
            this.setState({ errorMsg: '*Email Id cannot be empty' })
            return false;
        }

        if (values.password === '') {
            this.setState({ errorMsg: '*Password cannot be empty' })
            return false;
        }

        if (values.confirmPassword === '') {
            this.setState({ errorMsg: '*Confirm password cannot be empty' })
            return false;
        }

        if (values.password !== values.confirmPassword) {
            this.setState({ errorMsg: '*Passwords did not match' })
            return false;
        }
        this.setState({ errorMsg: '' })
        return true;
    }


    //Define component to be rendered
    renderField(field) {

        // const { meta: { touched, error } } = field;
        // const inputType = field.type;
        // const inputPlaceholder = field.placeholder;
        // return (

        //     <input type={inputType} placeholder={inputPlaceholder} {...field.input} />
        // );


        console.log(field);
        const { meta: { touched, error } } = field;
        console.log('filef name', field.placeholder);
        const inputType = field.type;
        const inputPlaceholder = field.placeholder;
        const errorMessageStyling = touched && error ? "text-danger" : "";
        var divClassName = "";

        if (field.id !== 'role') {
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
        } else {
            return (
                <div>
                    <div>
                        <input type={inputType} placeholder={inputPlaceholder} {...field.input} />

                    </div >
                    <div className={errorMessageStyling}>
                        <div>{touched ? error : ""}</div>

                    </div>
                </div >
            );
        }
    }


    //submit Login handler to send a request to the node backend
    onSubmit = (values) => {
        console.log("Submitting")
        if (!this.validation(values)) return;
        const data = {
            username: values.emailId,
            password: values.password,
            name: values.name,
            role: values.role
        }
        this.props.signup(data);
    }
    //     //set the with credentials to true
    //     axios.defaults.withCredentials = true;
    //     //make a post request with the user data
    //     axios.post('http://' + rooturl + ':3001/signup', data)
    //         .then(response => {
    //             console.log("Status Code : ", response.status);
    //             if (response.status === 200) {
    //                 this.setState({
    //                     redirectVar: <Redirect to="/login" />
    //                 })
    //             } else {
    //                 this.setState({
    //                     errorMsg: 'Unable to signup! ' + response.data
    //                 })
    //             }
    //         });
    // }

    render() {
        let redirectVar = null;
        let errorPanel = null;

        if (this.props.signupStateStore.result) {
            console.log('Inside signup page', this.props.signupStateStore);
            if (this.props.signupStateStore.result.newUser === true) {
                redirectVar = <Redirect to="/login" />
            }

        }
        if (this.props.signupStateStore.existingUser === true) {
            errorPanel = <div>
                <div className="alert alert-danger" role="alert">
                    Username Already exists!
            </div>
            </div>
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
                                        <form name="signupForm" onSubmit={handleSubmit(this.onSubmit.bind(this))} method="POST" data-se="o-form" id="form18" className="primary-auth-form o-form o-form-edit-mode">
                                            <div data-se="o-form-content" className="o-form-content o-form-theme clearfix">
                                                <h2 data-se="o-form-head" className="sjsu-form-title o-form-head">Sign Up</h2>
                                                <div className="o-form-error-container" data-se="o-form-error-container"></div>
                                                <Field
                                                    name="name"
                                                    id="name"
                                                    type="text"
                                                    placeholder="Enter a Name"
                                                    component={this.renderField} />

                                                <Field
                                                    name="emailId"
                                                    id="emailId"
                                                    type="email"
                                                    placeholder="Enter Email ID"
                                                    component={this.renderField} />

                                                <Field
                                                    name="password"
                                                    id="password"
                                                    type="password"
                                                    placeholder="Enter Password"
                                                    component={this.renderField} />
                                                <Field
                                                    name="confirmPassword"
                                                    id="confirmPassword"
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    component={this.renderField} />
                                                <div>Please choose your role: <Field
                                                    name="role"
                                                    id="role"
                                                    type="radio"
                                                    value="student"
                                                    checked="checked"
                                                    component={this.renderField} /> Student 
                                                    <Field
                                                        name="role"
                                                        id="role"
                                                        type="radio"
                                                        value="faculty"
                                                        component={this.renderField} /> Faculty
                                                </div>
                                            </div>
                                            <div>{errorPanel}</div>
                                            <div className="alert alert-danger" role="alert">{this.state.errorMsg}</div>
                                            <div className="o-form-button-bar"><input className="button button-primary" type="submit" value="Sign Up" id="sjsu-signin-submit" onClick={this.submitSignup} data-type="save" /></div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        )
    }
}

//This method provides access to redux store
const mapStateToProps = state => ({
    signupStateStore: state.signup
});

function validate(values) {
    console.log('inside signup validate');
    const errors = {};
    if (!values.name) {
        errors.name = "Enter your Name";
    }
    if (!values.emailId) {
        errors.emailId = "Enter Email ID";
    }
    if (!values.password) {
        errors.password = "Enter a password";
    }
    if (!values.confirmPassword) {
        errors.confirmPassword = "Enter the password again";
    }
    if (!values.role) {
        errors.role = "Please select role";
    }
    return errors;
}

export default reduxForm({
    validate,
    form: "signupForm"
})(connect(mapStateToProps, { signup })(Signup));