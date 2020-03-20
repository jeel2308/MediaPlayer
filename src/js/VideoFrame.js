import React from "react";
import Playlist from "./Playlist";
import Controls from "./Controls";
import { connect } from "react-redux";
import { updateUrl, updateSubtitleUrl } from "../actions/updateUrl";
import {
  updateList,
  updateSubtitleList,
  currentIndex
} from "../actions/updateList";
import "../css/videoFrame.css";
// import Video from "./Video";
// import * as url2 from "C:\\Users\\vatsal\\Desktop\\project2\\src\\try.mkv";
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
    text: "",
    error: false
  };
  video = React.createRef();
  subtitle = React.createRef();
  componentDidMount() {
    this.video.current.addEventListener("stalled", e => {
      console.log(e, "stalled");
    });
    this.video.current.addEventListener("error", e => {
      console.log("second");
      this.setState(() => ({
        error: true
      }));
    });
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("readyToPlay", event => {
      const list = event.detail.fileList;
      const index = event.detail.index;
      const started = event.detail.started;
      const directory = event.detail.directory;
      this.props.dispatch(updateList({ fileEntries: list, directory }));
      this.props.dispatch(currentIndex({ currentIndex: index }));
      if (!started) {
        this.props.dispatch(
          updateUrl({
            // url: window.directory + "/" + window.fileEntries[0],
            url:
              this.props.fileList.directory +
              "/" +
              this.props.fileList.fileEntries[0],
            subtitleUrl: ""
          })
        );
      }
    });
    window.addEventListener("subtitlesReady", e => {
      const subtitleList = e.detail;
      this.props.dispatch(updateSubtitleList({ subtitleList }));
      const subtitle = this.props.fileList.subtitleList[
        this.props.fileList.currentIndex
      ];
      this.props.dispatch(
        updateSubtitleUrl({
          // subtitleUrl: window.subtitleList[window.videoIndex]
          subtitleUrl: subtitle
        })
      );
      if (subtitle) {
        this.setState(() => ({
          subtitlesBtn: "flex"
        }));
      }
    });
    window.addEventListener("refreshSubtitle", e => {
      const newSubtitleList = e.detail;
      let flag1 = true;
      let flag2 = true;
      const oldsubtitleList = this.props.fileList.subtitleList;
      for (let i = 0; i < oldsubtitleList.length; i++) {
        const index = newSubtitleList.indexOf(oldsubtitleList[i]);
        if (index === -1) {
          flag1 = false;
          break;
        }
      }
      for (let i = 0; i < newSubtitleList.length; i++) {
        const index = oldsubtitleList.indexOf(newSubtitleList[i]);
        if (index === -1) {
          flag2 = false;
          break;
        }
      }
      if (flag1 && flag2 && newSubtitleList.length === oldsubtitleList.length)
        return;
      else {
        // update list
        this.props.dispatch(
          updateSubtitleList({ subtitleList: newSubtitleList })
        );
        const currentSubtitle = this.props.fileList.subtitleList[
          this.props.fileList.currentIndex
        ];
        this.props.dispatch(
          updateSubtitleUrl({ subtitleUrl: currentSubtitle })
        );
        if (currentSubtitle) {
          this.setState(() => ({
            subtitlesBtn: "flex"
          }));
        }
      }
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
    window.addEventListener("handleDrop", event => {
      const index = event.detail;
      this.props.dispatch(currentIndex({ currentIndex: index }));
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
    let index =
      (this.props.fileList.currentIndex + 1) %
      this.props.fileList.fileEntries.length;
    const url =
      this.props.fileList.directory +
      "/" +
      this.props.fileList.fileEntries[index];
    let subtitleUrl = this.props.fileList.subtitleList[index];
    // if (subtitleUrl)
    //   subtitleUrl = this.props.fileList.directory + "/" + subtitleUrl;
    this.props.dispatch(updateUrl({ url, subtitleUrl }));
    this.props.dispatch(currentIndex({ currentIndex: index }));
  };
  handlePrevious = () => {
    let index =
      (this.props.fileList.currentIndex - 1) %
      this.props.fileList.fileEntries.length;

    // const url =
    //   window.directory + "/" + window.fileEntries[window.videoIndex];
    const url =
      this.props.fileList.directory +
      "/" +
      this.props.fileList.fileEntries[index];
    let subtitleUrl = this.props.fileList.subtitleList[index];
    // if (subtitleUrl)
    //   subtitleUrl = this.props.fileList.directory + "/" + subtitleUrl;
    // const event = new CustomEvent("changedIndex", {
    //   detail: window.videoIndex
    // });
    // window.dispatchEvent(event);
    this.props.dispatch(updateUrl({ url, subtitleUrl }));
    this.props.dispatch(currentIndex({ currentIndex: index }));
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
    if (!this.video.current.loop) {
      let index =
        (this.props.fileList.currentIndex + 1) %
        this.props.fileList.fileEntries.length;

      const url =
        this.props.fileList.directory +
        "/" +
        this.props.fileList.fileEntries[index];
      let subtitleUrl = this.props.fileList.subtitleList[index];
      // if (subtitleUrl)
      //   subtitleUrl = this.props.fileList.directory + "/" + subtitleUrl;
      this.setState(() => ({
        state: "end"
      }));
      this.props.dispatch(updateUrl({ url, subtitleUrl }));
      this.props.dispatch(currentIndex({ currentIndex: index }));
    }
  };

  setVideoState = e => {
    console.log(
      this.props.fileList.subtitleList &&
        this.props.fileList.subtitleList[this.props.fileList.currentIndex]
    );
    if (
      this.props.fileList.subtitleList &&
      this.props.fileList.subtitleList[this.props.fileList.currentIndex]
    ) {
      if (this.state.subtitlesBtnState === "block") {
        this.video.current.textTracks[0].mode = "hidden";
      }
      if (this.state.subtitlesBtn === "none") {
        this.setState(() => ({
          subtitlesBtn: "flex"
        }));
      }
    } else {
      this.setState(() => ({
        subtitlesBtn: "none"
      }));
    }
    this.setState(() => ({
      error: false
    }));
    const duration = e.target.duration;
    this.setState(() => ({
      state: "play",
      duration
      // subtitlesBtn: !this.props.fileList.subtitleList[
      //   this.props.fileList.currentIndex
      // ]
      //   ? "none"
      //   : "flex",
      // subtitlesBtnState: "none"
    }));
    console.log(this.state);
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
  handleDrop = e => {
    e.preventDefault();
    const path = e.dataTransfer.files[0].path;
    const type = e.dataTransfer.files[0].type;
    window.handleDrop(
      path,
      type,
      this.props.fileList.fileEntries,
      this.props.fileList.directory
    );
    if (type.match(/video\//)) {
      this.props.dispatch(updateUrl({ url: path, subtitleUrl: "" }));
    }
  };
  render() {
    return (
      <>
        <div
          id="container"
          tabIndex="0"
          style={{
            position:
              this.state.fullScreen === "false" ? "relative" : "absolute",
            top: "0px",
            height:
              this.state.fullScreen === "true" ? "100%" : this.state.height,
            width:
              this.state.fullScreen === "true"
                ? "100%"
                : `${parseInt(this.state.width) *
                    (this.props.playListRight === "0%" ? 0.75 : 1)}%`,
            zIndex: this.state.fullScreen === "true" ? 2 : 0
          }}
          onKeyDown={this.handleKey}
          onDoubleClick={this.handleFullScreen}
          onDragOver={e => {
            e.preventDefault();
          }}
          onDrop={this.handleDrop}
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
            // src={this.props.url + "#t=15"} /*to start video from 15sec*/
            src={this.props.urlState.url}
            onTimeUpdate={this.handleTimeUpdate}
            onLoadedMetadata={this.setVideoState}
            onEnded={this.handleVideoEnd}
            ref={this.video}
          >
            <track
              kind="subtitles"
              src={this.props.urlState.subtitleUrl}
              ref={this.subtitle}
              id="cue"
              srcLang="en"
              label="English"
            />
            Video tag is not supported.
          </video>
          <div id="subtitleDisplay">{this.state.text}</div>
          <div
            id="error"
            style={{ display: this.state.error ? "flex" : "none" }}
          >
            Video can't be played
          </div>

          <Controls
            data={{
              duration: this.state.duration,
              currentTime: this.state.currentTime,
              volume: this.state.volume,
              state: this.state.state,
              muted: this.state.muted,
              url: this.props.urlState.url,
              loop: this.state.loop,
              largeBtn: this.state.largeBtn,
              subtitlesBtn: this.state.subtitlesBtn,
              subtitlesBtnState: this.state.subtitlesBtnState,
              fullScreen: this.state.fullScreen
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
        <div
          id="playListContainer"
          style={{
            // display: this.props.playListRight === "-25%" ? "none" : "block",
            right: this.props.playListRight
          }}
        >
          <Playlist />
        </div>
      </>
    );
  }
}
const mapStateToProps = (state, props) => {
  return {
    urlState: state.urlState,
    fileList: state.fileList
  };
};
export default connect(mapStateToProps)(VideoFrame);
