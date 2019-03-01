import React, { Component } from 'react';
import logo from './logo.svg';
import './Content.css';
import {getData} from "./utils"

class Content extends Component {
  render() {
    return (
      <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Hello world
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            {getData()}
          </a>
        </header>
    );
  }
}

export default Content;