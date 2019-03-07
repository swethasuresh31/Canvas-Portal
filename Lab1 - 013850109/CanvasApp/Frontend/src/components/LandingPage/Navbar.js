import React, { Component } from 'react';
import { Navigation, NavigationItem } from '@instructure/ui-navigation'
import { Img } from '@instructure/ui-elements'
import { Avatar, Text } from '@instructure/ui-elements'
import { ScreenReaderContent } from '@instructure/ui-a11y'
import logo from '../../img/sjsu-header-logo-alt.png'
import { IconUserLine, IconDashboardLine, IconCoursesLine, IconDeactivateUserLine } from '@instructure/ui-icons'
import cookie from 'react-cookies';

export default class Card extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirectVar: ''
    };
  }

  handleLogout = () => {
    cookie.remove('cookieS', { path: '/' })
    cookie.remove('cookieF', { path: '/' })
  }

  render() {
    return (
      <div style={{ height: "100vh" }}>
        <Navigation
          label="Main navigation"
          toggleLabel={{
            expandedLabel: 'Minimize Navigation',
            minimizedLabel: 'Expand Navigation'
          }}
          theme={{
            backgroundColor: '#0055a2',
          }}
        >
        <div class="py-3" style={{backgroundColor:"#FFFFFF"}}>
          <NavigationItem
            selected={this.props.selected === "icon"}
            icon={<Img src={logo}> </Img>}
            label={<ScreenReaderContent>Home</ScreenReaderContent>}
            href="/"
            theme={{
              backgroundColor: '#FFFFFF',
              hoverBackgroundColor: '#FFFFFF'
            }}
          />
          </div>
          <NavigationItem
            selected={this.props.selected === "account"}
            // icon={<Avatar name={this.props.name} size="x-small" />}
            icon={<IconUserLine />}
            label="Account"
            href="/account"
            theme={{
              backgroundColor: '#0055a2',
              hoverBackgroundColor: '#FFFFFF'

            }}
          />
          <NavigationItem
            selected={this.props.selected === "dashboard"}
            icon={<IconDashboardLine />}
            label="Dashboard"
            href="/"
            theme={{
              backgroundColor: '#0055a2',
              hoverBackgroundColor: '#FFFFFF'

            }}
          />
          <NavigationItem
            selected={this.props.selected === "courses"}
            icon={<IconCoursesLine />}
            label="Courses"
            href="/coursehome"
            theme={{
              backgroundColor: '#0055a2',
              hoverBackgroundColor: '#FFFFFF'

            }}
          />
          <NavigationItem
            selected={this.props.selected === "logout"}
            icon={<IconDeactivateUserLine />}
            label="Logout"
            href="/login"
            theme={{
              backgroundColor: '#0055a2',
              hoverBackgroundColor: '#FFFFFF'

            }}
            onClick = {this.handleLogout} 
          />
        </Navigation>
      </div>
      
    );
  }
}