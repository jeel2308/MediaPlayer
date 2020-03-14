import React from "react";
import "../css/playListItem.css";

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
        {this.props.src}
      </div>
    );
  }
}
export default playListItem;
