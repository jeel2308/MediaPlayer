import React from "react";
import "../css/playlist.css";
import PlaylistItem from "./PlaylistItem";
import { connect } from "react-redux";
import { updateUrl } from "../actions/updateUrl";
import { currentIndex } from "../actions/updateList";
class Playlist extends React.PureComponent {
  state = {
    list: [],
    currentIndex: -1
  };
  componentDidMount() {
    // window.addEventListener("readyToPlay", () => {
    //   this.setState(() => ({
    //     list: window.directoryEntry,
    //     currentIndex: window.videoIndex
    //   }));
    // });
    // window.addEventListener("changedIndex", e => {
    //   const currentIndex = e.detail;
    //   this.setState(() => ({
    //     currentIndex
    //   }));
    // });
  }

  handleClick = e => {
    const index = this.props.fileList.directoryList.indexOf(
      e.target.innerHTML.trim()
    );
    const url =
      this.props.fileList.directory +
      "/" +
      this.props.fileList.directoryList[index];
    const subtitleUrl = this.props.fileList.subtitleList[index];
    // this.setState(() => ({
    //   currentIndex: index
    // }));
    this.props.dispatch(updateUrl({ url, subtitleUrl }));
    this.props.dispatch(currentIndex({ currentIndex: index }));
  };

  render() {
    return (
      <>
        <div id="playlist" onClick={this.handleClick}>
          {this.props.fileList.directoryList
            ? this.props.fileList.directoryList.map(item => (
                <PlaylistItem
                  key={this.props.fileList.directoryList.indexOf(item)}
                  src={item}
                  active={
                    this.props.fileList.currentIndex ===
                    this.props.fileList.directoryList.indexOf(item)
                  }
                />
              ))
            : undefined}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    urlState: state.urlState,
    fileList: state.fileList
  };
};
export default connect(mapStateToProps)(Playlist);
