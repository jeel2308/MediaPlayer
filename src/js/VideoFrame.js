import React from "react";
import "../css/videoFrame.css";
import { MdReplay5 } from "react-icons/md";
import PlayBtn from "./PlayBtn";
import SkipBtn from "./SkipBtn";
import Controls from "./Controls";
// import Video from "./Video";
// import * as url2 from "C:\\Users\\vatsal\\Desktop\\project2\\src\\try.mkv";
// console.log(url);
// import * as url from "../../src/try.mkv";
class VideoFrame extends React.PureComponent {
  state = {
    width: `100%`,
    height: `${Math.max(document.documentElement.clientHeight) - 26.4}px`,
    currentTime: 0,
    duration: 0,
    state: "",
    fullScreen: "false",
    muted: false,
    volume: 1,
    loop: false,
    largeBtn: "",
    subtitlesBtn: "none",
    subtitlesBtnState: "none",
    text: ""
  };
  video = React.createRef();
  subtitle = React.createRef();
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("readyToPlay", event => {
      this.props.updateUrl(window.directory + "/" + window.directoryEntry[0]);
      this.props.updateSubtitleUrl("");
    });
    this.subtitle.current.addEventListener("cuechange", e => {
      let text = "";
      if (e.target.track.activeCues[0]) {
        text = e.target.track.activeCues[0].text;
      }
      this.setState(() => ({
        text
      }));
    });
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
        state: "play",
        largeBtn: "play"
      }));
    } else {
      this.video.current.pause();
      this.setState(() => ({
        state: "pause",
        largeBtn: "pause"
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
        currentTime: prevState.currentTime + 5,
        largeBtn: prevState.largeBtn === "forward1" ? "forward2" : "forward1"
      }));
    } else {
      this.video.current.currentTime = this.video.current.duration;
      this.setState(prevState => ({
        currentTime: this.video.current.duration,
        largeBtn: prevState.largeBtn === "forward1" ? "forward2" : "forward1"
      }));
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
      let url =
        window.directory.replace(/\s/g, "%20").replace(/\\/g, "\\") +
        "\\" +
        window.directoryEntry[window.videoIndex]
          .replace(/\s/g, "%20")
          .replace(/\\/g, "\\");
      // console.log(url);
      let subtitleUrl = window.subtitleList[window.videoIndex];
      this.props.updateUrl(url);
      this.props.updateSubtitleUrl(subtitleUrl);
    }
  };
  handlePrevious = () => {
    if (window.videoIndex - 1 >= 0) {
      window.videoIndex--;
      let url =
        window.directory.replace(/\s/g, "%20").replace(/\\/g, "\\") +
        "\\" +
        window.directoryEntry[window.videoIndex]
          .replace(/\s/g, "%20")
          .replace(/\\/g, "\\");
      let subtitleUrl = window.subtitleList[window.videoIndex];
      this.props.updateUrl(url);
      this.props.updateSubtitleUrl(subtitleUrl);
    }
  };
  handleVolume = volume => {
    if (volume + this.video.current.volume > 1) {
      this.video.current.volume = 1;
      this.setState(prevState => ({
        volume: 1,
        largeBtn: prevState.largeBtn === "volumeUp1" ? "volumeUp2" : "volumeUp1"
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
        volume: prevState.volume + volume,
        largeBtn:
          volume > 0
            ? prevState.largeBtn === "volumeUp1"
              ? "volumeUp2"
              : "volumeUp1"
            : prevState.largeBtn === "volumeDown1"
            ? "volumeDown2"
            : "volumeDown1"
      }));
    }
  };
  handleLoop = () => {
    this.video.current.loop = !this.video.current.loop;
    this.setState(prevState => ({
      loop: !prevState.loop
    }));
  };
  handleMute = () => {
    this.video.current.muted = !this.video.current.muted;
    this.setState(prevState => ({
      muted: !prevState.muted,
      largeBtn: prevState.muted ? "unMute" : "mute"
    }));
  };
  handleReplay = () => {
    if (this.video.current.currentTime - 5 >= 0) {
      this.video.current.currentTime -= 5;
      this.setState(prevState => ({
        currentTime: prevState.currentTime - 5,
        largeBtn: prevState.largeBtn === "replay1" ? "replay2" : "replay1"
      }));
    } else {
      this.video.current.currentTime = 0;
      this.setState(prevState => ({
        currentTime: 0,
        largeBtn: prevState.largeBtn === "replay1" ? "replay2" : "replay1"
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
    if (!this.video.current.loop) {
      if (window.videoIndex + 1 <= window.directoryEntry.length - 1) {
        let url =
          window.directory.replace(/\s/g, "%20").replace(/\\/g, "\\") +
          "\\" +
          window.directoryEntry[++window.videoIndex]
            .replace(/\s/g, "%20")
            .replace(/\\/g, "\\");
        this.props.updateUrl(url);
      }
    }
  };

  setVideoState = e => {
    const duration = e.target.duration;
    this.setState(() => ({
      state: "play",
      duration,
      subtitlesBtn: !this.props.subtitleUrl ? "none" : "flex",
      subtitlesBtnState: "none"
    }));
    setTimeout(() => {
      if (this.state.subtitlesBtn === "flex") return;
      const subtitleUrl = window.subtitleList[window.videoIndex];
      if (subtitleUrl === "") return;
      else {
        this.props.updateSubtitleUrl(subtitleUrl);
        this.setState(() => ({
          subtitlesBtn: "flex"
        }));
      }
    }, 5000);
    // this.video.current.textTracks[0].mode = "hidden";
    // console.log(this.video.current.textTracks[0].cues);
  };
  setSubtitleState = () => {
    if (this.video.current.textTracks[0].mode === "disabled") {
      this.video.current.textTracks[0].mode = "hidden";
      this.setState(() => ({
        subtitlesBtnState: "block"
      }));
    } else {
      this.video.current.textTracks[0].mode = "disabled";
      this.setState(() => ({
        subtitlesBtnState: "none",
        text: ""
      }));
    }
  };
  handleDrop = async e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0].path;
    const type = e.dataTransfer.files[0].type;
    window.handleDrop(file, type);
    if (type.match(/video\//)) {
      this.props.updateUrl(file);
      this.props.updateSubtitleUrl("");
    }
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
            onDragOver={e => {
              e.preventDefault();
            }}
            onDrop={this.handleDrop}
          >
            <track
              kind="subtitles"
              src={this.props.subtitleUrl}
              ref={this.subtitle}
              id="cue"
              srcLang="en"
              label="English"
            />
            Video tag is not supported.
          </video>
          <div id="subtitleDisplay">{this.state.text}</div>
          <Controls
            data={{
              duration: this.state.duration,
              currentTime: this.state.currentTime,
              volume: this.state.volume,
              state: this.state.state,
              muted: this.state.muted,
              url: this.props.url,
              loop: this.state.loop,
              largeBtn: this.state.largeBtn,
              subtitlesBtn: this.state.subtitlesBtn,
              subtitlesBtnState: this.state.subtitlesBtnState
            }}
            handlers={{
              handleCurrentTime: this.handleCurrentTime,
              handleReplay: this.handleReplay,
              handlePlayPause: this.handlePlayPause,
              handleForward: this.handleForward,
              handleFullScreen: this.handleFullScreen,
              handleVolume: this.handleVolume,
              handleMute: this.handleMute,
              handleNext: this.handleNext,
              handlePrevious: this.handlePrevious,
              handleLoop: this.handleLoop,
              handleSubtitleState: this.setSubtitleState
            }}
          />
        </div>
      </>
    );
  }
}

export default VideoFrame;
