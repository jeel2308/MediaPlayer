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
    this.props.updateUrl(url);
  };
  handleFolder = async () => {
    let url = await window.openDirectory();
    if (url !== "not selected") {
      url =
        window.directory.replace(/\s/g, "%20").replace(/\\/g, "\\") +
        "\\" +
        window.directoryEntry[0].replace(/\s/g, "%20").replace(/\\/g, "\\");
      this.props.updateUrl(url);
    }
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
