import React, { Component } from "react";
import NavBar from "./NavBar";
// import "font-awesome/css/font-awesome.min.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCoffee, faPlay } from "@fortawesome/free-solid-svg-icons";

import VideoFrame from "./VideoFrame";
import "../css/index.css";
// import ReactPlayer from "react-player";
// import * as url from "../../src/try.mkv";
// import "./a076d05399";
// import "./bootstrap.bundle.min.js";
// import "../css/bootstrap.css";

// import logo from "./logo.svg";
// import "./App.css";

// const { app } = window.require("electron").remote;

class App extends React.Component {
  state = {
    url: "",
    subtitleUrl: ""
  };
  updateUrl = url => {
    this.setState(() => ({
      url
    }));
  };
  updateSubtitleUrl = subtitleUrl => {
    this.setState(() => ({
      subtitleUrl
    }));
  };

  render() {
    return (
      <div id="video-player">
        <NavBar
          updateUrl={this.updateUrl}
          updateSubtitleUrl={this.updateSubtitleUrl}
        />
        <VideoFrame
          url={this.state.url}
          subtitleUrl={this.state.subtitleUrl}
          updateUrl={this.updateUrl}
          updateSubtitleUrl={this.updateSubtitleUrl}
        />
      </div>
    );
  }
}

// function App() {
//   return <ReactPlayer url={url} />;
// }

export default App;
