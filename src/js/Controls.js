import React from "react";
import "../css/controls.css";
// import "../css/buttons.css";
import Progress from "./Progress";
import Volume from "./Volume";
import Time from "./Time";
// import SkipBtn from "./SkipBtn";
import {
  MdForward5,
  MdReplay5,
  MdSkipNext,
  MdSkipPrevious
} from "react-icons/md";
import ShuffleOrLoop from "./ShuffleOrLoop";
import { IconContext } from "react-icons";
import PlayBtn from "./PlayBtn";
import SkipBtn from "./SkipBtn";
import FullScreen from "./FullScreen.js";

class Controls extends React.PureComponent {
  state = {
    replayClass: "BigBtn",
    forwardClass: "BigBtn"
  };
  handleReplay = () => {
    // console.log("handleReplay");
    this.props.handlers.handleReplay();
    const index = this.state.replayClass.indexOf("animate2");
    // console.log(index);
    // console.log(index);
    if (index === -1) {
      this.setState(() => ({
        replayClass: "BigBtn animate2"
      }));
    } else {
      this.setState(() => ({
        replayClass: "BigBtn animate"
      }));
    }
  };
  handleForward = () => {
    this.props.handlers.handleForward();
    const index = this.state.forwardClass.indexOf("animate2");
    // console.log(index);
    if (index === -1) {
      this.setState(() => ({
        forwardClass: "BigBtn animate2"
      }));
    } else {
      this.setState(() => ({
        forwardClass: "BigBtn animate"
      }));
    }
  };
  render() {
    return (
      <>
        <div id="largeBtns">
          {/*<div>
            <IconContext.Provider value={{ className: this.state.replayClass }}>
              <MdReplay5 />
            </IconContext.Provider>
    </div>*/}
          <div
            style={{
              opacity:
                this.props.data.state !== "end" &&
                this.props.data.state !== "canPlay"
                  ? 1
                  : 0
            }}
          >
            (
            <PlayBtn
              state={this.props.data.state}
              size="large"
              classValue={"playBigBtn animate"}
            />
            )
          </div>
          {/* <div>
            <IconContext.Provider
              value={{ className: this.state.forwardClass }}
            >
              <MdForward5 />
            </IconContext.Provider>
         </div>*/}
        </div>
        <div id="controls">
          <div id="controls__first">
            <Progress
              duration={this.props.data.duration}
              currentTime={this.props.data.currentTime}
              handleCurrentTime={this.props.handlers.handleCurrentTime}
              url={this.props.data.url}
            />
          </div>
          <div id="controls__second">
            <Volume
              volume={this.props.data.volume}
              muted={this.props.data.muted}
              handleMute={this.props.handlers.handleMute}
              handleVolume={this.props.handlers.handleVolume}
            />
            <div id="controls__second__center">
              <Time Time={this.props.data.currentTime} />
              <SkipBtn
                handlePrevious={this.props.handlers.handlePrevious}
                type="handlePrevious"
                classValue={"skipbtn hover"}
              >
                <MdSkipPrevious />
              </SkipBtn>
              <SkipBtn
                handleReplay={this.props.handlers.handleReplay}
                type="handleReplay"
                classValue={"skipbtn hover"}
              >
                <MdReplay5 />
              </SkipBtn>
              <PlayBtn
                state={this.props.data.state}
                handlePlayPause={this.props.handlers.handlePlayPause}
                size="small"
                classValue={"play hover"}
              />
              <ShuffleOrLoop
                handleLoop={this.props.handlers.handleLoop}
                loop={this.props.data.loop}
              />
              <SkipBtn
                handleForward={this.props.handlers.handleForward}
                type="handleForward"
                classValue={"skipbtn hover"}
              >
                <MdForward5 />
              </SkipBtn>
              <SkipBtn
                handleNext={this.props.handlers.handleNext}
                type="handleNext"
                classValue={"skipbtn hover"}
              >
                <MdSkipNext />
              </SkipBtn>
              <Time
                Time={this.props.data.duration - this.props.data.currentTime}
              />
            </div>
            <FullScreen
              handleFullScreen={this.props.handlers.handleFullScreen}
            />
          </div>
        </div>
      </>
    );
  }
}
export default Controls;
