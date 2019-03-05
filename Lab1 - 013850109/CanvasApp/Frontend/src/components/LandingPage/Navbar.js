import React, { Component } from 'react';
import { Navigation, NavigationItem } from '@instructure/ui-navigation'
import { Img } from '@instructure/ui-elements'
import { Avatar, Text } from '@instructure/ui-elements'
import { ScreenReaderContent } from '@instructure/ui-a11y'
import logo from '../../img/sjsu-header-logo-alt.png'
import { IconUserLine, IconDashboardLine, IconCoursesLine } from '@instructure/ui-icons'
import cookie from 'react-cookies';

export default class Card extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirectVar: ''
    };
  }

  handleLogout = () => {
    alert("clearing cookies")
    cookie.remove('cookie', { path: '/' })
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
          <NavigationItem
            selected={this.props.selected === "icon"}
            icon={<Img src={logo}> </Img>}
            label={<ScreenReaderContent>Home</ScreenReaderContent>}
            href="/"
            theme={{
              backgroundColor: '#0055a2',
              hoverBackgroundColor: '#0055a2'
            }}
          />
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
            icon={<IconCoursesLine />}
            label="Logout"
            href="/logout"
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