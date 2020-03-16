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
    const s = e.target.innerText || e.target.parentNode.innerText; // innerHTML will treat & as &amp;
    let index = s.lastIndexOf(">");
    let url = s.substr(index + 1);
    console.log(url);
    index = this.props.fileList.fileEntries.indexOf(url);
    url = this.props.fileList.directory + "/" + url;
    console.log(url);
    const subtitleUrl = this.props.fileList.subtitleList[index];
    // url = url.replace(/\s/, "%20");
    this.props.dispatch(updateUrl({ url, subtitleUrl }));
    this.props.dispatch(currentIndex({ currentIndex: index }));
  };

  render() {
    return (
      <>
        <div id="playlist" onClick={this.handleClick}>
          {this.props.fileList.fileEntries
            ? this.props.fileList.fileEntries.map(item => (
                <PlaylistItem
                  key={this.props.fileList.fileEntries.indexOf(item)}
                  directory={this.props.fileList.directory}
                  src={item}
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
