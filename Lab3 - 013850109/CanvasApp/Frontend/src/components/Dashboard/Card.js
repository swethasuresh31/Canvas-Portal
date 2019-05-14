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
    console.log("Waitlist status : " + this.props.course.is_waitlist)
    let coursePath= (this.props.course.is_waitlist === true) ? '#' :"/coursedetails/"+this.props.course.course_uid+"/home"
    let isWaitlist= (this.props.course.is_waitlist === true) ? "(waitlist)" : ""

    return (
      <div class={this.state.cardStyle}
        style={{ width: "18rem" }}
        onMouseOver={() => this.setState({ cardStyle: "card shadow-lg" })} 
        onMouseOut={() => this.setState({ cardStyle: "card shadow-sm" })}
        onClick={()=>{}}>
        <div class="card-header" style={{ height: "10rem", backgroundColor: "#0055a2" }}>
        </div>
        <div class="card-body">
          <p class="card-title">{this.props.course.course_dept_code}-{this.props.course.course_id} {isWaitlist}</p>
          <p class="card-subtitle"> {this.props.course.course_name}<br />{this.props.course.course_term}</p>
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