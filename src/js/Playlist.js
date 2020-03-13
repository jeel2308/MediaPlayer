import React from "react";
import "../css/playlist.css";
class Playlist extends React.PureComponent {
  state = {
    list: [],
    currentIndex: -1
  };
  componentDidMount() {
    window.addEventListener("readyToPlay", () => {
      this.setState(() => ({
        list: window.directoryEntry
      }));
    });
  }
  render() {
    console.log(this.state);
    return (
      <>
        <div id="playlist">
          {this.state.list.map(item => {
            return <div key={this.state.list.indexOf(item)}>{item}</div>;
          })}
        </div>
      </>
    );
  }
}

export default Playlist;
