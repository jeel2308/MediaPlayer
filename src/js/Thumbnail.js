import React from "react";
import "../css/thumbnail.css";
class Thumbnail extends React.PureComponent {
  handleMetadata = e => {
    window.thumbnail = document.getElementById("thumbnail");
    e.target.pause();
  };

  render() {
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
        >
          <source src="C:\\Users\\vatsal\\Desktop\\project2\\src\\try.mkv" />
        </video>
      </div>
    );
  }
}

export default Thumbnail;
