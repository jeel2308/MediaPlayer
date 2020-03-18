import React, { Component } from "react";
import "../css/navbar.css";
import { IoIosClose } from "react-icons/io";
import { IconContext } from "react-icons";
import { connect } from "react-redux";
import { updateUrl } from "../actions/updateUrl";
import { currentIndex } from "../actions/updateList";
// import "../css/font-awesome.min.css";

class NavBar extends Component {
  state = {
    display: "none"
  };
  handleFile = async () => {
    const { url, index } = await window.openFile(
      this.props.fileList.directory,
      this.props.fileList.fileEntries
    );
    if (url === "Not selected") return;
    let subtitleUrl = "";
    if (index !== -1) {
      subtitleUrl = this.props.fileList.subtitleList[index];
      // if (subtitleUrl)
      //   subtitleUrl = this.props.fileList.directory + "/" + subtitleUrl;
      this.props.dispatch(currentIndex({ currentIndex: index }));
    }
    this.props.dispatch(updateUrl({ url, subtitleUrl }));
  };
  handleFolder = () => {
    window.openDirectory(this.props.fileList.directory);
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
  toggleDropDown = e => {
    const type = e.type;
    if (type === "mouseenter")
      this.setState(() => ({
        display: "inline-block"
      }));
    else
      this.setState(() => ({
        display: "none"
      }));
  };
  render() {
    return (
      <ul id="navbar">
        <li className="dropdownContainer">
          <div
            className="dropdown"
            onMouseEnter={this.toggleDropDown}
            onMouseLeave={this.toggleDropDown}
          >
            <div className="dropdownTitle navbar_li">Open</div>
            <div
              className="dropdownItems"
              style={{ display: this.state.display }}
            >
              <div onClick={this.handleFile}>Open File</div>
              <div onClick={this.handleFolder}>Open Folder</div>
            </div>
          </div>
        </li>
        <li className="navbar_li nav-item" onClick={this.toggleDevTools}>
          DevTools
        </li>
        <li
          className="navbar_li new-item"
          onClick={this.props.setPlayListWidth}
        >
          PlayList
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
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    urlState: state.urlState,
    fileList: state.fileList
  };
};
export default connect(mapStateToProps)(NavBar);
