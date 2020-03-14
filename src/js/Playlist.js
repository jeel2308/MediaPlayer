import React from "react";
import "../css/playlist.css";
import PlaylistItem from "./PlaylistItem";
class Playlist extends React.PureComponent {
  state = {
    list: [],
    currentIndex: -1
  };
  componentDidMount() {
    window.addEventListener("readyToPlay", () => {
      this.setState(() => ({
        list: window.directoryEntry,
        currentIndex: window.videoIndex
      }));
    });
    window.addEventListener("changedIndex", e => {
      const currentIndex = e.detail;
      this.setState(() => ({
        currentIndex
      }));
    });
  }

  handleClick = e => {
    const index = this.state.list.indexOf(e.target.innerHTML.trim());
    const url = window.directory + "/" + window.directoryEntry[index];
    const subtitleUrl = window.subtitleList[index];
    this.setState(() => ({
      currentIndex: index
    }));
    this.props.updateUrl(url);
    this.props.updateSubtitleUrl(subtitleUrl);
  };

  render() {
    return (
      <>
        <div id="playlist" onClick={this.handleClick}>
          {this.state.list.map(item => (
            <PlaylistItem
              key={this.state.list.indexOf(item)}
              src={item}
              active={this.state.currentIndex === this.state.list.indexOf(item)}
            />
          ))}
        </div>
      </>
    );
  }
}

export default Playlist;
