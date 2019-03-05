import React, { Component } from 'react';
import { Grid, GridRow, GridCol } from '@instructure/ui-layout'
import Navbar from '../LandingPage/Navbar';
import { Avatar, Text, Table } from '@instructure/ui-elements'
import Heading from '@instructure/ui-elements/lib/components/Heading'
import { IconEditLine } from '@instructure/ui-icons'
import cookie from 'react-cookies';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router';
import axios from 'axios';

const cookies = new Cookies();


export default class Account extends Component {

  constructor(props) {
    super(props);
    // Don't call this.setState() here!

    this.state = {
      accountData: [],
      name: '',
      emailId: '',
      phoneNo: '',
      aboutMe: '',
      city: '',
      country: '',
      company: '',
      school: '',
      hometown: '',
      languages: '',
      gender: ''
    }
    //Bind the handlers to this class
    this.nameChangeHandler = this.nameChangeHandler.bind(this);
    this.phoneNoChangeHandler = this.phoneNoChangeHandler.bind(this);
    this.aboutMeChangeHandler = this.aboutMeChangeHandler.bind(this);
    this.cityChangeHandler = this.cityChangeHandler.bind(this);
    this.countryChangeHandler = this.countryChangeHandler.bind(this);
    this.companyChangeHandler = this.companyChangeHandler.bind(this);
    this.schoolChangeHandler = this.schoolChangeHandler.bind(this);
    this.hometownChangeHandler = this.hometownChangeHandler.bind(this);
    this.languagesChangeHandler = this.languagesChangeHandler.bind(this);
    this.genderChangeHandler = this.genderChangeHandler.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
  }

  //name change handler to update state variable with the text entered by the user
  nameChangeHandler = (e) => {
    this.setState({
      name: e.target.value,
      errorMsg: ''
    })
  }
  //phoneNo change handler to update state variable with the text entered by the user
  phoneNoChangeHandler = (e) => {
    this.setState({
      phoneNo: e.target.value,
      errorMsg: ''
    })
  }
  //aboutMe change handler to update state variable with the text entered by the user
  aboutMeChangeHandler = (e) => {
    this.setState({
      aboutMe: e.target.value,
      errorMsg: ''
    })
  }
  //city change handler to update state variable with the text entered by the user
  cityChangeHandler = (e) => {
    this.setState({
      city: e.target.value,
      errorMsg: ''
    })
  }
  //country change handler to update state variable with the text entered by the user
  countryChangeHandler = (e) => {
    this.setState({
      country: e.target.value,
      errorMsg: ''
    })
  }
  //company change handler to update state variable with the text entered by the user
  companyChangeHandler = (e) => {
    this.setState({
      company: e.target.value,
      errorMsg: ''
    })
  }
  //school change handler to update state variable with the text entered by the user
  schoolChangeHandler = (e) => {
    this.setState({
      school: e.target.value,
      errorMsg: ''
    })
  }
  //hometown change handler to update state variable with the text entered by the user
  hometownChangeHandler = (e) => {
    this.setState({
      hometown: e.target.value,
      errorMsg: ''
    })
  }
  //languages change handler to update state variable with the text entered by the user
  languagesChangeHandler = (e) => {
    this.setState({
      languages: e.target.value,
      errorMsg: ''
    })
  }
  //gender change handler to update state variable with the text entered by the user
  genderChangeHandler = (e) => {
    this.setState({
      gender: e.target.value,
      errorMsg: ''
    })
  }


  saveProfile(e) {
    e.preventDefault()

    const accountUpd = {
      name: this.state.name,
      username: this.state.emailId,
      phoneNo: this.state.phoneNo,
      aboutMe: this.state.aboutMe,
      city: this.state.city,
      country: this.state.country,
      company: this.state.company,
      school: this.state.school,
      hometown: this.state.hometown,
      languages: this.state.languages,
      gender: this.state.gender
    }

    //make a put request with the user data
    axios.put('http://localhost:3001/account', accountUpd)
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          this.setState({ isEditing: "false" });
          console.log("success");
        } else {
          this.setState({
            errorMsg: 'Some problem updating account information!'
          })
        }
      })
      .catch(err => {
        this.setState({
          redirectVar: '',
          errorMsg: '*Data not updated!'
        })

      })

  }

  componentDidMount() {
    let user = cookies.get('cookieS') || cookies.get('cookieF');
    console.log(user + "UserName")

    axios.get('http://localhost:3001/account/' + user)
      .then((response) => {
        console.log(response);
        //update the state with the response data
        response.data.map(data => {
          this.setState({
            name: data.name,
            emailId: data.email_id,
            phoneNo: data.phone_number,
            aboutMe: data.about_me,
            city: data.city,
            country: data.country,
            company: data.company,
            school: data.school,
            hometown: data.hometown,
            languages: data.languages,
            gender: data.gender
          })
        })
      });
  }



  render() {
    let redirectVar = null;
    if (cookie.load('cookieF') || (cookie.load('cookieS'))) {
      if (this.state.isEditing === "true") {
        return (
          <div>
            <div className="row">
              <div className="col col-sm-2">
                <Navbar selected="account" />
              </ div>
              <div className="col col-lg-8">
                <div className="row">

                  <div className="col">
                    <br />
                    <Heading theme={{ borderPadding: "1rem" }} border="bottom">{this.state.name}'s Profile
                  <span style={{ float: "right" }}><button type="button" class="btn btn-secondary btn" onClick={() => { this.setState({ isEditing: "false" }) }}><IconEditLine /> Cancel Edit</button>
                      </span>
                    </ Heading>
                  </ div>
                </ div>
                <div className="row">
                  <div className="col col-sm-2">
                    <br /><Avatar name={this.state.name} size="x-large" />
                  </ div>
                  <div className="col col-lg-5">
                    <br /><h4>
                      <table className="table-borderless"
                      ><tbody>
                          <tr><td><label>Name: </label></td><td><input type="text" class="form-control" id="name" aria-describedby="emailHelp" onChange={this.nameChangeHandler} /></td></tr>
                          <tr><td><label>Email: </label></td><td><fieldset disabled><input type="text" class="form-control" id="emailId" aria-describedby="emailHelp" value={this.state.emailId} /></fieldset></td></tr>
                          <tr><td><label>Phone Number: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.phoneNoChangeHandler} /></td></tr>
                          <tr><td><label>About Me: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.aboutMeChangeHandler} /></td></tr>
                          <tr><td><label>City: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.cityChangeHandler} /></td></tr>
                          <tr><td><label>Country: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.countryNoChangeHandler} /></td></tr>
                          <tr><td><label>Company: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.companyChangeHandler} /></td></tr>
                          <tr><td><label>School: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.schoolChangeHandler} /></td></tr>
                          <tr><td><label>Hometown: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.hometownChangeHandler} /></td></tr>
                          <tr><td><label>Languages: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.languagesChangeHandler} /></td></tr>
                          <tr><td><label>Gender: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.genderChangeHandler} /></td></tr>
                        </tbody>
                      </table></ h4>
                    <div align="center">
                      <button type="button" class="btn btn-secondary btn m-2" onClick={() => { this.setState({ isEditing: "false" }) }}>Cancel</button><button type="button" class="btn btn-primary btn m-2" onClick={this.saveProfile}>Save</button>
                    </ div>
                  </div>
                </ div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div className="row">
              <div className="col col-sm-2">
                <Navbar selected="account" />
              </ div>
              <div className="col col-lg-8">
                <div className="row">
                  <div className="col">
                    <br />
                    <Heading theme={{ borderPadding: "1rem" }} border="bottom">{this.state.name}'s Profile
                  <span style={{ float: "right" }}><button type="button" class="btn btn-secondary btn" onClick={() => { this.setState({ isEditing: "true" }) }}><IconEditLine /> Edit Profile</button>
                      </span>
                    </ Heading>
                  </ div>
                </ div>
                <div className="row">
                  <div className="col col-sm-2">
                    <br /><Avatar name={this.state.name} size="x-large" />
                  </ div>
                  <div className="col col-lg-5">
                    <br /><h4>
                      <table className="table-borderless">
                        <tbody>
                          <tr><td><label>Name: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.name} /></td></tr>
                          <tr><td><label>Email: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.emailId} /></td></tr>
                          <tr><td><label>Phone Number: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.phoneNo} /></td></tr>
                          <tr><td><label>About Me: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.aboutMe} /></td></tr>
                          <tr><td><label>City: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.city} /></td></tr>
                          <tr><td><label>Country: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.country} /></td></tr>
                          <tr><td><label>Company: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.company} /></td></tr>
                          <tr><td><label>School: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.school} /></td></tr>
                          <tr><td><label>Hometown: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.hometown} /></td></tr>
                          <tr><td><label>Languages: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.languages} /></td></tr>
                          <tr><td><label>Gender: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.gender} /></td></tr>
                        </tbody>
                      </table></ h4>
                  </ div>
                </ div>
              </div>
            </div>
          </div>
        );
      }
    } else {
      return (<div><Redirect to="/login" /></div>);
    }
  }
}