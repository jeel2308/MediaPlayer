import React from "react";
import "../css/playListItem.css";
import * as url from "../images/Video-Icon.jpg";
class playListItem extends React.PureComponent {
  handleMetaData = e => {
    e.target.pause();
    e.target.currentTime = 10;
  };
  render() {
    return (
      <div
        className={this.props.active ? "playListItem active" : "playListItem"}
      >
        {/*<img src={url.default}  />*/}
        {/*<video
          className="thumbnail"
          preload="metadata"
          onLoadedMetadata={e => {
            e.target.pause();
          }}
        >
          <source src={this.props.directory + "/" + this.props.src + "#t=10"} />
        </video>*/}
        {this.props.src}
      </div>
    );
  }
}
export default playListItem;
