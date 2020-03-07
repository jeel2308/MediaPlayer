import React from "react";
import "../css/thumbnail.css";
class Thumbnail extends React.PureComponent {
  handleMetadata = e => {
    window.thumbnail = document.getElementById("thumbnail");
    e.target.pause();
  };
  handleCurrentTime = element => {};
  ref = React.createRef();

  render() {
    window.thumbnail.currentTime = 5;
    return (
      <div
        id="thumbnailContainer"
        left={this.props.left}
        right={this.props.right}
      >
        <video
          id="thumbnail"
          onLoadedMetadata={this.handleMetadata}
          controls={false}
          ref={this}
        >
          <source src="C:\\Users\\vatsal\\Desktop\\project2\\src\\try.mkv" />
        </video>
      </div>
    );
  }
}

export default Thumbnail;
