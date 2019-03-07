import React, { Component } from 'react';
import { Grid, GridRow, GridCol } from '@instructure/ui-layout'
import theme from '@instructure/ui-themes/lib/canvas/base'
import Card from './Card';
import Navbar from '../LandingPage/Navbar';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();

export default class Dashboard extends Component {

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
    if (cookie.load('cookieS')) {
      role = 'student';
    } else if (cookie.load('cookieF')) {
      role = 'faculty';
    }
    if (role !== '') {
      let user = cookies.get('cookieS')
      axios.get('http://localhost:3001/usercourse/' + encodeURI(user) + '?role=' + role)
        .then((response) => {
          console.log(response);
          if (response !== undefined)
            this.setState({ coursework: response.data })
        })
    }
  }

  render() {
    let redirectVar = null;
    if (cookie.load('cookieF') || cookie.load('cookieS')) {
      //Return faculty page
      return (
        <div>
          <div className="row">
            <div className="col col-md-1">
              <Navbar selected="dashboard" />
            </ div>
            <div className="col">
              <div className="row">

                <div className="col pb-3">
                  <br />
                  <Heading theme={{ borderPadding: "1rem" }} border="bottom">Dashboard</ Heading>
                </ div>
              </ div>
              <div className="row">
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