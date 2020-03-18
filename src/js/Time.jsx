import React from "react";
import "../css/time.css";
class Time extends React.PureComponent {
  handleTimeStamp = Time => {
    const currentTime = Math.floor(Time);
    let seconds = (currentTime % 60).toString();
    if (seconds.length === 1) seconds = "0" + seconds;
    let minutes = Math.floor(currentTime / 60);
    minutes = (minutes % 60).toString();
    if (minutes.length === 1) minutes = "0" + minutes;
    let hour = Math.floor(currentTime / 3600).toString();
    if (hour.length === 1) hour = "0" + hour;
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
