import React, { Component } from 'react';

export default class Card extends Component {

  constructor(props) {
  super(props);
  // Don't call this.setState() here!
  this.state = { };
}

  render() {
    return (
      <div class="card" style={{ width: "18rem" }}>
        <div class="card-body">
          <p class="card-title">{this.props.course}</p>
          <p class="card-text">Components Related to {this.props.course}</p>
        </div>
      </div>
    );
  }
}