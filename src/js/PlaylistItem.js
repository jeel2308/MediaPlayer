import React from "react";
import "../css/playListItem.css";
import * as url from "../images/Video-Icon.jpg";
class playListItem extends React.PureComponent {
  render() {
    return (
      <div
        className={this.props.active ? "playListItem active" : "playListItem"}
      >
        <img src={url.default} className="thumbnail" />
        {this.props.src}
      </div>
    );
  }
}
export default playListItem;
