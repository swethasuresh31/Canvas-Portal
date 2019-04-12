import React, { Component } from 'react';
import { IconAnnouncementLine, IconAssignmentLine, IconDiscussionLine, IconFolderLine } from '@instructure/ui-icons'


export default class Card extends Component {

  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      cardStyle: "card shadow-sm"
    };
  }

  render() {
    let coursePath= (this.props.item.isWaitlist) ? '#' :"/coursedetails/"+this.props.item.course_uid+"/home"
    let isWaitlist= (this.props.item.isWaitlist) ? "(waitlist)" : ""

    return (
      <div class={this.state.cardStyle}
        style={{ width: "18rem" }}
        onMouseOver={() => this.setState({ cardStyle: "card shadow-lg" })} 
        onMouseOut={() => this.setState({ cardStyle: "card shadow-sm" })}
        onClick={()=>{}}>
        <a style={{textDecoration: "none"}} href={coursePath}>
        <div class="card-header" style={{ height: "10rem", backgroundColor: "#0055a2" }}>
        </div>
        </a>
        <div class="card-body">
        <a style={{textDecoration: "none"}} href={coursePath}>
        <p class="card-title"><p class="card-link font-weight-bold">{this.props.item.course_dept_code}-{this.props.item.course_id}</p> {isWaitlist}</p>
        <p class="card-subtitle"> {this.props.item.course_name}<br />{this.props.item.course_term}</p>
        </a>
          <div class="d-flex justify-content-around pt-4" style={{ fontSize: "20px" }}>
            <a href="#" class="card-link text-dark"><IconAnnouncementLine /></a>
            <a href="#" class="card-link text-dark"><IconAssignmentLine /></a>
            <a href="#" class="card-link text-dark"><IconDiscussionLine /></a>
            <a href="#" class="card-link text-dark"><IconFolderLine /></a>
          </div>
        </div>
      </div>
    );
  }
}