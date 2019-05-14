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
import { graphql, compose } from 'react-apollo';
import { profile } from '../queries/queries';
import { updateProfile } from '../mutations/mutations';
import { withApollo } from 'react-apollo';

const cookies = new Cookies();

class Account extends Component {

  constructor(props) {
    super(props);
    // Don't call this.setState() here!

    this.state = {
      accountData: [],
      first_name: '',
      last_name: '',
      email_id: '',
      phone_number: '',
      about_me: '',
      city: '',
      country: '',
      company: '',
      school: '',
      hometown: '',
      languages: '',
      gender: '',
      img: ''
    }
    //Bind the handlers to this class
    this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
    this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
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
    this.fileInput = React.createRef();
  }

  //name change handler to update state variable with the text entered by the user
  firstNameChangeHandler = (e) => {
    this.state.name = e.target.value
    this.state.errorMsg = ''
  }

  //name change handler to update state variable with the text entered by the user
  lastNameChangeHandler = (e) => {
    this.state.name = e.target.value
    this.state.errorMsg = ''
  }
  //phoneNo change handler to update state variable with the text entered by the user
  phoneNoChangeHandler = (e) => {
    this.state.phone_number = e.target.value,
      this.state.errorMsg = ''

  }
  //aboutMe change handler to update state variable with the text entered by the user
  aboutMeChangeHandler = (e) => {

    this.state.about_me = e.target.value,
      this.state.errorMsg = ''

  }
  //city change handler to update state variable with the text entered by the user
  cityChangeHandler = (e) => {

    this.state.city = e.target.value,
      this.state.errorMsg = ''

  }
  //country change handler to update state variable with the text entered by the user
  countryChangeHandler = (e) => {

    this.state.country = e.target.value,
      this.state.errorMsg = ''

  }
  //company change handler to update state variable with the text entered by the user
  companyChangeHandler = (e) => {

    this.state.company = e.target.value,
      this.state.errorMsg = ''

  }
  //school change handler to update state variable with the text entered by the user
  schoolChangeHandler = (e) => {

    this.state.school = e.target.value,
      this.state.errorMsg = ''

  }
  //hometown change handler to update state variable with the text entered by the user
  hometownChangeHandler = (e) => {

    this.state.hometown = e.target.value,
      this.state.errorMsg = ''

  }
  //languages change handler to update state variable with the text entered by the user
  languagesChangeHandler = (e) => {

    this.state.languages = e.target.value,
      this.state.errorMsg = ''

  }
  //gender change handler to update state variable with the text entered by the user
  genderChangeHandler = (e) => {

    this.state.gender = e.target.value,
      this.state.errorMsg = ''

  }


  saveProfile(e) {
    e.preventDefault()
    this.props.client.mutate({
      mutation: updateProfile,
      variables: {
        username: this.state.email_id,
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        phone_number: this.state.phone_number,
        about_me: this.state.about_me,
        city: this.state.city,
        country: this.state.country,
        company: this.state.company,
        school: this.state.school,
        hometown: this.state.hometown,
        languages: this.state.languages,
        gender: this.state.gender
      }
    }).then((response) => {
      console.log('Update profile', response.data);
      console.log('Success', response.data.updateProfile.success);
      let result = response.data.updateProfile.success;
      if(result === 'true') {
        this.setState({
          isEditing: "false"
        })
      }
      window.location.reload();
      console.log('state', this.state);
    });

    
  }

  componentDidMount() {
    console.log("UserName: " + localStorage.getItem("emailId"))

    this.props.client.query({
      query: profile,
      variables: {
        username: localStorage.getItem("emailId")
      }
    }).then((response) => {
      console.log('Response profile', response.data);
      let result = response.data.profile.userData;
      var keyArray = Object.keys(response.data.profile.userData);

      for (var i = 0; i < keyArray.length; i++) {
        console.log('keyArr', keyArray[i]);
        var name = keyArray[i];
        console.log('result[i]', result[name])
        this.setState({
          [name]: result[name]
        });
      }
      console.log('state', this.state);
    });


    console.log('data:', this.props.data);

  }



  render() {
    let redirectVar = null;
    console.log(this.state.img)
    if (localStorage.isAuthenticated && localStorage.isAuthenticated === 'true') {
      if (this.state.isEditing === "true") {
        return (
          <div>
            {this.state.redirectVar}
            <div className="row">
              <div className="col" style={{ maxWidth: "100px" }}>
                <Navbar selected="account" />
              </div>
              <div className="col">
                <div className="row">
                  <div className="col">
                    <br />
                    <Heading theme={{ borderPadding: "1rem" }} border="bottom">{this.state.first_name}'s Profile
                  <span style={{ float: "right" }}><button type="button" class="btn btn-secondary btn mr-3" onClick={() => { this.setState({ isEditing: "false" }) }}><IconEditLine /> Cancel Edit</button>
                      </span>
                    </Heading>
                  </div>
                </div>
                <div className="row">
                  <div className="col col-sm-2 pl-5">
                    <br /><Avatar src={this.state.img} name={this.state.name} size="x-large" />
                    <div className="row mt-2">
                      <div className="col">
                        <input type="file" name="assignmentFile" id="assignmentFile" ref={this.fileInput}></input>
                      </div>
                    </div>
                  </div>
                  <div className="col col-lg-5">
                    <br /><h4>
                      <table className="table-borderless"
                      ><tbody>
                          <tr><td><label>First Name: </label></td><td><input type="text" class="form-control" id="name" aria-describedby="emailHelp" onChange={this.firstNameChangeHandler} /></td></tr>
                          <tr><td><label>Last Name: </label></td><td><input type="text" class="form-control" id="name" aria-describedby="emailHelp" onChange={this.lastNameChangeHandler} /></td></tr>
                          <tr><td><label>Email: </label></td><td><fieldset disabled><input type="text" class="form-control" id="email_id" aria-describedby="emailHelp" value={this.state.email_id} /></fieldset></td></tr>
                          <tr><td><label>Phone Number: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.phoneNoChangeHandler} /></td></tr>
                          <tr><td><label>About Me: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.aboutMeChangeHandler} /></td></tr>
                          <tr><td><label>City: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.cityChangeHandler} /></td></tr>
                          <tr><td><label>Country: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.countryChangeHandler} /></td></tr>
                          <tr><td><label>Company: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.companyChangeHandler} /></td></tr>
                          <tr><td><label>School: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.schoolChangeHandler} /></td></tr>
                          <tr><td><label>Hometown: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.hometownChangeHandler} /></td></tr>
                          <tr><td><label>Languages: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.languagesChangeHandler} /></td></tr>
                          <tr><td><label>Gender: </label></td><td><input type="text" class="form-control" id="inputName" aria-describedby="emailHelp" onChange={this.genderChangeHandler} /></td></tr>
                        </tbody>
                      </table></h4>
                    <div align="center">
                      <button type="button" class="btn btn-secondary btn m-2" onClick={() => { this.setState({ isEditing: "false" }) }}>Cancel</button><button type="button" class="btn btn-primary btn m-2" onClick={this.saveProfile}>Save</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            {this.state.redirectVar}
            <div className="row">
              <div className="col" style={{ maxWidth: "100px" }}>
                <Navbar selected="account" />
              </div>
              <div className="col">
                <div className="row">
                  <div className="col">
                    <br />
                    <Heading theme={{ borderPadding: "1rem" }} border="bottom">{this.state.first_name}'s Profile
                  <span style={{ float: "right" }}><button type="button" class="btn btn-secondary btn" onClick={() => { this.setState({ isEditing: "true" }) }}><IconEditLine /> Edit Profile</button>
                      </span>
                    </Heading>
                  </div>
                </div>
                <div className="row">
                  <div className="col col-sm-2 pl-5">
                    <br /><Avatar src={this.state.img} name={this.state.name} size="x-large" />
                  </div>
                  <div className="col col-lg-5">
                    <br /><h4>
                      <table className="table-borderless">
                        <tbody>
                          <tr><td><label>First Name: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.first_name} /></td></tr>
                          <tr><td><label>Last Name: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.last_name} /></td></tr>
                          <tr><td><label>Email: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.email_id} /></td></tr>
                          <tr><td><label>Phone Number: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.phone_number} /></td></tr>
                          <tr><td><label>About Me: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.about_me} /></td></tr>
                          <tr><td><label>City: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.city} /></td></tr>
                          <tr><td><label>Country: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.country} /></td></tr>
                          <tr><td><label>Company: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.company} /></td></tr>
                          <tr><td><label>School: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.school} /></td></tr>
                          <tr><td><label>Hometown: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.hometown} /></td></tr>
                          <tr><td><label>Languages: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.languages} /></td></tr>
                          <tr><td><label>Gender: </label></td><td><input type="text" readonly class="form-control-plaintext" id="inputName" aria-describedby="emailHelp" value={this.state.gender} /></td></tr>
                        </tbody>
                      </table></h4>
                  </div>
                </div>
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

export default withApollo(Account);