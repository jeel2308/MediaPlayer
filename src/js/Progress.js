import React from "react";
import "../css/videoProgress.css";
// import Thumbnail from "./Thumbnail";
class Progress extends React.PureComponent {
  state = {
    left: "0px",
    visible: false,
    display: "none",
    thumbnailCurrentTime: 0
  };
  ref = React.createRef();
  setDuration = e => {
    const left = e.target.getBoundingClientRect().left;
    let width = 0;
    if (e.target.id === "progress") width = e.target.offsetWidth;
    else width = e.target.parentNode.offsetWidth;
    let duration = ((e.pageX - left) * this.props.duration) / width;
    return duration;
  };
  handleClick = e => {
    const duration = this.setDuration(e);
    this.props.handleCurrentTime(duration);
  };
  handleMetadata = e => {
    e.target.pause();
    const ratio = e.target.videoWidth / e.target.videoHeight;
    if (ratio < 1) e.target.style.width = `${180 * ratio}px`;
    else e.target.style.height = `${180 / ratio}px`;
  };

  handleThumbnailDuration = e => {
    const duration = this.setDuration(e);
    let left = 0;
    let progressBarRight = "";
    let progressBarLeft = e.target.getBoundingClientRect().left;
    if (e.target.id === "progressbar") {
      progressBarRight = e.target.parentNode.getBoundingClientRect().right;
      //  progressBarLeft=e.target.parentNode.getBoundingClientRect().left;
    } else {
      progressBarRight = e.target.getBoundingClientRect().right;
      //  progressBarLeft=e.target.getBoundingClientRect().left;
    }

    // progressBarLeft = e.target.getBoundingClientRect().left;
    if (e.pageX + 90 >= progressBarRight) left = progressBarRight - 180;
    else if (e.pageX - 90 <= progressBarLeft) left = progressBarLeft;
    else left = e.pageX - 90;
    this.setState(() => ({
      thumbnailCurrentTime: duration,
      left: `${left}px`
    }));
    this.ref.current.currentTime = duration;
  };
  handleThumbnail = flag => {
    if (flag) {
      this.setState(() => ({
        display: "inline-block"
      }));
    } else {
      this.setState(() => ({
        display: "none"
      }));
    }
  };
  showTime = () => {
    const Time = this.state.thumbnailCurrentTime;
    const currentTime = Math.floor(Time);
    const seconds = currentTime % 60;
    let minutes = Math.floor(currentTime / 60);
    minutes = minutes % 60;
    const hour = Math.floor(currentTime / 3600);
    const time = hour + ":" + minutes + ":" + seconds;
    return time;
  };
  render() {
    return (
      <>
        <div
          id="thumbnailContainer"
          style={{
            left: this.state.left,
            display: this.state.display
          }}
        >
          <video
            id="thumbnail"
            onLoadedMetadata={this.handleMetadata}
            controls={false}
            ref={this.ref}
            src={this.props.url}
          ></video>
          <div id="thumbnailTime">{this.showTime()}</div>
        </div>

        <div
          id="progress"
          onClick={this.handleClick}
          onMouseOver={e => {
            this.handleThumbnailDuration(e);
            this.handleThumbnail(1);
          }}
          onMouseMove={this.handleThumbnailDuration}
          onMouseOut={() => {
            this.handleThumbnail(0);
          }}
        >
          <div
            id="progressbar"
            style={{
              width: `${(this.props.currentTime / this.props.duration) * 100}%`
            }}
          ></div>
        </div>
      </>
    );
  }
}

export default Progress;
