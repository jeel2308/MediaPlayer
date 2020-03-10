import React, { Component } from "react";
import "../css/navbar.css";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faWindowClose } from "@fortawesome/fontawesome-svg-core";
import { IoIosClose } from "react-icons/io";
import { IconContext } from "react-icons";
// import "../css/font-awesome.min.css";

class NavBar extends Component {
  handleFile = async () => {
    let url = await window.openFile();
    if (url === "Not selected") return;
    let subtitle = "";
    if (window.subtitleList) {
      subtitle = window.subtitleList[window.videoIndex];
      // console.log(subtitle, window.videoIndex);
    }
    this.props.updateUrl(url);
    this.props.updateSubtitleUrl(subtitle);
  };
  handleFolder = async () => {
    let url = await window.openDirectory();
    if (url !== "not selected") {
      url = window.directory + "\\" + window.directoryEntry[0];
      this.props.updateUrl(url);
    }
    this.props.updateSubtitleUrl("");
  };
  handleMinimize = () => {
    if (window.handleMinimize) window.handleMinimize();
  };
  handleMaximize = () => {
    if (window.handleMaximize) window.handleMaximize();
  };
  handleClose = () => {
    if (window.handleClose) window.handleClose();
  };
  toggleDevTools = () => {
    if (window.toggleDevTools) window.toggleDevTools();
  };
  render() {
    return (
      <>
        <ul id="navbar">
          <li className="navbar_li nav-item" onClick={this.handleFile}>
            Open File
          </li>
          <li className="navbar_li nav-item" onClick={this.handleFolder}>
            Open Folder
          </li>
          <li className="navbar_li nav-item" onClick={this.toggleDevTools}>
            DevTools
          </li>
          <li
            className="navbar_li navbar_img"
            id="navbar_right"
            onClick={this.handleMinimize}
          >
            <div id="window-minimize"></div>
          </li>
          <li className="navbar_li navbar_img" onClick={this.handleMaximize}>
            <div id="window-maximize"></div>
          </li>
          <li className="navbar_li navbar_img" onClick={this.handleClose}>
            <IconContext.Provider value={{ className: "closeBtn" }}>
              <IoIosClose />
            </IconContext.Provider>
          </li>
        </ul>
      </>
    );
  }
}

export default NavBar;
