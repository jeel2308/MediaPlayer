import React, { Component } from "react";
import NavBar from "./NavBar";

// import store from "../store/configStore";
// import updateUrl from "../actions/updateUrl";
import { connect } from "react-redux";
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
    playListRight: "-25%"
  };
  setPlayListRight = () => {
    this.setState(prevState => ({
      playListRight: prevState.playListRight === "-25%" ? "0%" : "-25%"
    }));
  };
  render() {
    return (
      <div id="video-player">
        <NavBar setPlayListWidth={this.setPlayListRight} />
        <VideoFrame playListRight={this.state.playListRight} />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    urlState: state.urlState
  };
};
export default connect(mapStateToProps)(App);
