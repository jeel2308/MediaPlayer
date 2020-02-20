import React from "react";
import "../css/time.css";
class Time extends React.PureComponent {
  handleTimeStamp = Time => {
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
      <React.Fragment>
        <div className="time wrapper">
          {this.handleTimeStamp(this.props.Time)}
        </div>
      </React.Fragment>
    );
  }
}

export default Time;
