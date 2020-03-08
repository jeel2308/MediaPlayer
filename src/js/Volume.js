import React from "react";
import { IconContext } from "react-icons";
import { MdVolumeUp, MdVolumeOff } from "react-icons/md";
import "../css/volume.css";
class Volume extends React.PureComponent {
  state = {
    display: "none"
  };
  volume = React.createRef();
  handleVideoVolume = e => {
    const position = e.pageX;
    const left = e.target.offsetLeft;
    let volume = 0;
    if (left) {
      volume =
        (position -
          left -
          e.target.offsetParent.offsetLeft -
          e.target.offsetParent.offsetParent.offsetParent.offsetLeft) /
        100;
    } else {
      volume =
        (position -
          e.target.offsetParent.offsetLeft -
          e.target.offsetParent.offsetParent.offsetLeft -
          e.target.offsetParent.offsetParent.offsetParent.offsetParent
            .offsetLeft) /
        100;
    }

    if (volume > 1) {
      this.props.handleVolume(1 - this.props.volume);
      // this.volume.current.style.width = `${100}px`;
    } else {
      this.props.handleVolume(volume - this.props.volume);
      // this.volume.current.style.width = `${100 * volume}px`;
    }
  };
  toggleDisplay = flag => {
    if (flag) this.volume.current.style.width = `${this.props.volume * 100}px`;
    else this.volume.current.style.width = "";
  };
  render() {
    return (
      <>
        <div
          className="volumeBtnContainer"
          onMouseOver={e => {}}
          onMouseOut={e => {}}
        >
          <div
            onClick={this.props.handleMute}
            className="volumeBtnIconContainer"
          >
            <IconContext.Provider value={{ className: "volume" }}>
              {this.props.muted ? <MdVolumeOff /> : <MdVolumeUp />}
            </IconContext.Provider>
          </div>
          <div
            id="volumeBarContainer"
            onClick={this.handleVideoVolume}
            title={this.props.volume}
          >
            <div id="volumeBar">
              <div
                id="videoVolume"
                ref={this.volume}
                style={{ width: `${this.props.volume * 100}px` }}
              ></div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Volume;
