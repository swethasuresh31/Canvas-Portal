import React, { Component } from 'react';
import { Grid, GridRow, GridCol } from '@instructure/ui-layout'
import theme from '@instructure/ui-themes/lib/canvas/base'
import Card from './Card';
import Navbar from '../LandingPage/Navbar';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

export default class Dashboard extends Component {

  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {};
  }

  render() {
    let redirectVar = null;
    if (cookie.load('cookieF')) {
      //Return faculty page
      return (
        <div>
          {redirectVar}
          <Grid>
            <GridRow>
              <GridCol width={1}style={{ height: '100vh' }}>
                <Navbar selected="dashboard" />
              </GridCol>
              <GridCol width={9}>
                FACULTY DASHBOARD
                <div className="card-deck">
                  <Card course="CMPE-273" />
                  <Card course="CMPE-202" />
                  <Card course="CMPE-272" />
                </ div>
              </GridCol>
            </GridRow>
          </Grid>
        </ div>
      );
    } else if (cookie.load('cookieS')) {
      //Return student page
      return (
        <div>
          {redirectVar}
          <Grid>
            <GridRow>
              <GridCol  width={1} style={{ height: '100vh' }}>
                <Navbar selected="dashboard" />
              </GridCol>
              <GridCol  width={10}>
                STUDENT DASHBOARD
                <div className="card-deck">
                  <Card course="CMPE-273" />
                  <Card course="CMPE-202" />
                  <Card course="CMPE-272" />
                </ div>
              </GridCol>
            </GridRow>
          </Grid>
        </ div>
      );
    } else {
      return (<div><Redirect to="/login" /></div>);
    }
  }
}