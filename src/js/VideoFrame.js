import React from "react";
import "../css/videoFrame.css";
// import Button from "./Button.js";
// import { FaBackward, FaForward } from "react-icons/fa";
import { MdReplay5 } from "react-icons/md";
// import { MdPlayCircleOutline } from "react-icons/md";
// import { IconContext } from "react-icons";
// import Time from "./Time";
// import FullScreen from "./FullScreen.js";
// import Volume from "./Volume";
// import Progress from "./Progress";
import PlayBtn from "./PlayBtn";
import SkipBtn from "./SkipBtn";
import Controls from "./Controls";
// import Video from "./Video";
// import * as url2 from "C:\\Users\\vatsal\\Desktop\\project2\\src\\try.mkv";
// console.log(url);
import * as url from "../../src/try.mkv";
class VideoFrame extends React.PureComponent {
  state = {
    width: `100%`,
    height: `${Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    ) - 26.4}px`,
    currentTime: 0,
    duration: 0,
    state: "play",
    fullScreen: "false",
    muted: false,
    loop: false,
    volume: 1
  };
  video = React.createRef();
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }
  handleCurrentTime = currentTime => {
    this.video.current.currentTime = currentTime;
    this.setState(() => ({
      currentTime
    }));
  };
  handlePlayPause = () => {
    if (this.video.current.paused || this.video.current.ended) {
      this.video.current.play();
      this.setState(() => ({
        state: "play"
      }));
    } else {
      this.video.current.pause();
      this.setState(() => ({
        state: "pause"
      }));
    }
  };
  handleFullScreen = () => {
    if (this.state.fullScreen === "false") {
      document.body.webkitRequestFullScreen();
      this.setState(() => ({
        fullScreen: "true"
      }));
    } else {
      document.webkitCancelFullScreen();
      this.setState(() => ({
        fullScreen: "false"
      }));
    }
  };
  handleForward = () => {
    if (this.video.current.currentTime + 5 < this.video.current.duration) {
      this.video.current.currentTime += 5;
      this.setState(prevState => ({
        currentTime: prevState.currentTime + 5
      }));
    } else {
      this.video.current.currentTime = this.video.current.duration;
      this.setState(() => ({ currentTime: this.video.current.duration }));
    }
  };
  handleKey = e => {
    const key = e.key;
    switch (key) {
      case " ":
        this.handlePlayPause();
        break;
      case "ArrowLeft":
        this.handleReplay();
        break;
      case "ArrowRight":
        this.handleForward();
        break;
      case "Escape":
        if (this.state.fullScreen === "true") {
          document.webkitCancelFullScreen();
          this.setState(() => ({
            fullScreen: "false"
          }));
        }

        break;
      case "f":
      case "F":
        this.handleFullScreen();
        break;
      case "m":
      case "M":
        this.handleMute();
        break;
      case "ArrowUp":
        this.handleVolume(0.1);
        break;
      case "ArrowDown":
        this.handleVolume(-0.1);
        break;
    }
  };
  handleNext = () => {
    if (window.videoIndex + 1 <= window.directoryEntry.length - 1) {
      window.videoIndex++;
      let url = (
        window.directory +
        "//" +
        window.directoryEntry[window.videoIndex]
      ).replace(/\s/g, "%20");
      // console.log(url);
      this.props.updateUrl(url);
    }
  };
  handleVolume = volume => {
    if (volume + this.video.current.volume >= 1) {
      this.video.current.volume = 1;
      this.setState(() => ({
        volume: 1
      }));
    } else if (volume + this.video.current.volume < 0) {
      this.video.current.volume = 0;
      this.setState(() => ({
        volume: 0
      }));
    } else {
      this.video.current.volume += volume;
      console.log(this.video.current.volume);
      this.setState(prevState => ({
        volume: prevState.volume + volume
      }));
    }
  };
  handleMute = () => {
    this.video.current.muted = !this.video.current.muted;
    this.setState(prevState => ({
      muted: !prevState.muted
    }));
  };
  handleReplay = () => {
    if (this.video.current.currentTime - 5 >= 0) {
      this.video.current.currentTime -= 5;
      this.setState(prevState => ({
        currentTime: prevState.currentTime - 5
      }));
    } else {
      this.video.current.currentTime = 0;
      this.setState(() => ({
        currentTime: 0
      }));
    }
  };
  handleResize = () => {
    this.setState(() => ({
      width: `100%`,
      height: `${Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      ) - 26.4}px`
    }));
  };

  handleTimeUpdate = e => {
    const currentTime = e.target.currentTime;
    this.setState(() => ({
      currentTime
    }));
  };
  handleVideoEnd = () => {
    this.setState(() => ({
      state: "end"
    }));
  };

  setVideoState = e => {
    const duration = e.target.duration;
    this.setState(() => ({
      state: "canPlay",
      duration
    }));
  };
  render() {
    return (
      <>
        <div
          id="container"
          tabIndex="0"
          draggable="true"
          style={{
            position:
              this.state.fullScreen === "false" ? "relative" : "absolute",
            top: 0,
            height:
              this.state.fullScreen === "true" ? "100%" : this.state.height,
            width: this.state.fullScreen === "true" ? "100%" : this.state.width,
            zIndex: this.state.fullScreen === "true" ? 2 : 0
          }}
          onKeyDown={this.handleKey}
          onDoubleClick={this.handleFullScreen}
        >
          <video
            id="myvideo"
            poster=""
            controls={false}
            autoPlay={true}
            style={{
              height:
                this.state.fullScreen === "true" ? "100vh" : this.state.height,
              width:
                this.state.fullScreen === "true" ? "100vw" : this.state.width
            }}
            src={this.props.url}
            onTimeUpdate={this.handleTimeUpdate}
            onLoadedMetadata={this.setVideoState}
            onEnded={this.handleVideoEnd}
            ref={this.video}
          >
            <track
              label="English"
              kind="subtitles"
              srcLang="en"
              src=""
              id="cue"
            />
            Video tag is not supported.
          </video>
          {this.state.state !== "end" && this.state.state !== "canPlay" ? (
            <div className="largePlayBtn">
              <PlayBtn
                state={this.state.state}
                size="large"
                classValue={"playBigBtn animate"}
              />
            </div>
          ) : (
            undefined
          )}
          <Controls
            data={{
              duration: this.state.duration,
              currentTime: this.state.currentTime,
              volume: this.state.volume,
              state: this.state.state,
              muted: this.state.muted,
              url: this.props.url
            }}
            handlers={{
              handleCurrentTime: this.handleCurrentTime,
              handleReplay: this.handleReplay,
              handlePlayPause: this.handlePlayPause,
              handleForward: this.handleForward,
              handleFullScreen: this.handleFullScreen,
              handleVolume: this.handleVolume,
              handleMute: this.handleMute,
              handleNext: this.handleNext
            }}
          />
        </div>
      </>
    );
  }
}

export default VideoFrame;
