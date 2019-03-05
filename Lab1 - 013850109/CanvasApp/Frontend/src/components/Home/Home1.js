import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import { Navigation, NavigationItem } from '@instructure/ui-navigation'
import logo from '../../img/sjsu-header-logo-alt.png'
import { Avatar, Img, Badge, Text } from '@instructure/ui-elements'
import { ScreenReaderContent } from '@instructure/ui-a11y'
import { IconUserSolid, IconDashboardLine, IconCoursesLine, IconXLine } from '@instructure/ui-icons'
import { Tray } from '@instructure/ui-overlays'
import { Flex, FlexItem, View } from '@instructure/ui-layout'
import { Button } from '@instructure/ui-buttons'
import Heading from '@instructure/ui-elements/lib/components/Heading'


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: true,
            size: 'large',
            placement: 'start',
            books: []
        }
        this.onClick = this.onClick.bind(this);
    }

    onClick = (e) => {

    }

    hideTray = () => {
        this.setState({
            open: false
        })
    }

    renderCloseButton() {
        if (this.state.placement === 'end') {
            return (
                <Flex>
                    <FlexItem margin="0 small 0 0">
                        <Button
                            variant="icon"
                            icon={IconXLine}
                            onClick={this.hideTray}
                        >
                            <ScreenReaderContent>Close</ScreenReaderContent>
                        </Button>
                    </FlexItem>
                    <FlexItem grow shrink>
                        <Heading ellipsis>Hello</Heading>
                    </FlexItem>
                </Flex>
            )
        } else {
            return (
                <Flex>
                    <FlexItem grow shrink>
                        <Heading>Hello</Heading>
                    </FlexItem>
                    <FlexItem>
                        <Button
                            variant="icon"
                            icon={IconXLine}
                            onClick={this.hideTray}
                        >
                            <ScreenReaderContent>Close</ScreenReaderContent>
                        </Button>
                    </FlexItem>
                </Flex>
            )
        }
    }

    render() {

        //iterate over books to create a table row
        // let details = this.state.books.map(book => {
        //     return(
        //         <tr>
        //             <td>{book.id}</td>
        //             <td>{book.title}</td>
        //             <td>{book.author}</td>
        //         </tr>
        //     )
        // })
        //if not logged in go to login page

        var myNavTheme = {
            backgroundColor: "#0055a2"
        }
        var myTheme = {
            backgroundColor: "#0055a2",
            fontColor: "#FFFFFF",
            iconColor: "#FFFFFF",
            selectedFontColor: "#0055a2",
            selectedIconColor: "#0055a2",
            selectedBackgroundColor: "#FFFFFF",
            hoverBackgroundColor: "#1048a3",
            contentPadding: "0.375rem",

        }
        let redirectVar = null;
        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }
        return (
            <div>
            <div style={{height: '35rem'}}>
    <Navigation
      label="Main navigation"
      toggleLabel={{
        expandedLabel: 'Minimize Navigation',
        minimizedLabel: 'Expand Navigation'
      }}
    >
      <NavigationItem
        icon={<Img src={placeholderLogo(85, 85)} constrain="cover" />}
        label={<ScreenReaderContent>Home</ScreenReaderContent>}
        href="#"
        theme={{
          backgroundColor: 'red',
          hoverBackgroundColor: 'blue'
        }}
      />
      <NavigationItem
        icon={<Avatar name="Ziggy Marley" size="x-small"/>}
        label="Account"
        onClick={() => { this.loadSubNav('account') }}
      />
      <NavigationItem
        icon={<IconUser.Solid />}
        label="Admin"
        href="#"
      />
      <NavigationItem selected
        icon={<IconUser.Solid />}
        label="Dashboard"
        href="#"
      />
      <NavigationItem
        icon={<Badge count={99}><IconUser.Solid /></Badge>}
        label="Inbox"
        href="#"
      />
      <NavigationItem
        icon={<IconUser.Solid />}
        label="Supercalifragilistic"
        href="#"
      />
    </Navigation>
  </div>
                
            </div>
        )
    }
}
//export Home Component
export default Home;