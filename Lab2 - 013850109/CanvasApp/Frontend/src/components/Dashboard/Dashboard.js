import React, { Component } from 'react';
import { Grid, GridRow, GridCol } from '@instructure/ui-layout'
import theme from '@instructure/ui-themes/lib/canvas/base'
import Card from './Card';
import Navbar from '../LandingPage/Navbar';
import { Redirect } from 'react-router';
import Heading from '@instructure/ui-elements/lib/components/Heading';
import axios from 'axios';

import { getDashboardInformation } from '../../js/actions/DashboardAction';
import { connect } from 'react-redux';


class Dashboard extends Component {

  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      selectedPath: "1",
      coursework: []
    };
  }

  async componentDidMount() {

    await this.props.getDashboardInformation();
    console.log("dashboard: " + this.props.dashboardStateStore.result.data)   
    const result = this.props.dashboardStateStore.result.data;
    this.setState({
      coursework: result
    })
    console.log("coursework "+this.state.coursework);
  }

  render() {
    console.log(localStorage.userToken);
    if (localStorage.userToken && localStorage.userToken !== "undefined") {
      console.log(this.state.coursework);
      //Return faculty page
      return (
        <div>
          <div className="row">
            <div className="col pr-0 mr-0" style={{ maxWidth: "100px" }}>
              <Navbar selected="dashboard" />
            </ div>
            <div className="col">
              <div className="row">

                <div className="col pb-3">
                  <br />
                  <Heading theme={{ borderPadding: "1rem" }} border="bottom">Dashboard</ Heading>
                </ div>
              </ div>
              <div className="row" style={{ marginLeft: "15px" }}>
              <div className="card-deck d-flex flex-wrap">
              {
                this.state.coursework.map(course => {
                  return (
                    <Card course={course} />
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

const mapStateToProps = state => {
  console.log(JSON.stringify(state))
  return {
    dashboardStateStore: state.dashboard,
    profileStateStore: state.profile,
    loginStateStore: state.login
  }
}

//export default Profile;
export default connect(mapStateToProps, { getDashboardInformation })(Dashboard);