import React from "react";
import "../css/playlist.css";
import PlaylistItem from "./PlaylistItem";
import { connect } from "react-redux";
import { updateUrl, updateSubtitleUrl } from "../actions/updateUrl";
import {
  currentIndex,
  refreshList,
  updateSubtitleList
} from "../actions/updateList";
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
    window.addEventListener("refreshUrl", e => {
      const videoFileList = e.detail;
      const currentUrl = this.props.fileList.fileEntries[
        this.props.fileList.currentIndex
      ];
      let flag1 = true;
      let flag2 = true;
      const oldFileList = this.props.fileList.fileEntries;
      for (let i = 0; i < oldFileList.length; i++) {
        const index = videoFileList.indexOf(oldFileList[i]);
        if (index === -1) {
          flag1 = false;
          break;
        }
      }
      for (let i = 0; i < videoFileList.length; i++) {
        const index = oldFileList.indexOf(videoFileList[i]);
        if (index === -1) {
          flag2 = false;
          break;
        }
      }
      if (flag1 && flag2) return;
      else {
        // update list
        this.props.dispatch(refreshList({ fileEntries: videoFileList }));
        const newIndex = videoFileList.indexOf(currentUrl);
        if (newIndex !== -1) {
          this.props.dispatch(currentIndex({ currentIndex: newIndex }));
        } else {
          this.props.dispatch(currentIndex({ currentIndex: 0 }));
          const newUrl =
            this.props.fileList.directory +
            "/" +
            this.props.fileList.fileEntries[0];
          this.props.dispatch(updateUrl({ url: newUrl, subtitleUrl: "" }));
        }
      }
    });
  }
  handleRefresh = e => {
    window.handleRefresh(this.props.fileList.directory);
  };
  handleClick = e => {
    const s = e.target.textContent || e.target.parentNode.textContent; // innerHTML will treat & as &amp; and innerText will remove extra spaces from url
    let index = s.lastIndexOf(">");
    let url = s.substr(index + 1);
    // url = url.replace(/\s/g, "%20");
    index = this.props.fileList.fileEntries.indexOf(url);
    url = this.props.fileList.directory + "/" + url;
    const subtitleUrl = this.props.fileList.subtitleList[index];
    this.props.dispatch(updateUrl({ url, subtitleUrl }));
    this.props.dispatch(currentIndex({ currentIndex: index }));
  };

  render() {
    return (
      <>
        <button id="refresh" onClick={this.handleRefresh}>
          Refresh
        </button>
        <div id="playlist" onClick={this.handleClick}>
          {this.props.fileList.fileEntries
            ? this.props.fileList.fileEntries.map(item => (
                <PlaylistItem
                  key={this.props.fileList.fileEntries.indexOf(item)}
                  directory={this.props.fileList.directory}
                  src={item.replace(/%20/g, " ")}
                  active={
                    this.props.fileList.currentIndex ===
                    this.props.fileList.fileEntries.indexOf(item)
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
