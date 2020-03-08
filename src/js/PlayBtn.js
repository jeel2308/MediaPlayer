import React from "react";
import {
  MdPlayCircleOutline,
  MdPauseCircleOutline,
  MdPlayArrow,
  MdPause
} from "react-icons/md";
import { IconContext } from "react-icons";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../css/buttons.css";

const PlayBtn = props => {
  return (
    <>
      {props.size === "large" && (
        <div className="wrapper">
          <IconContext.Provider value={{ className: props.classValue }}>
            {props.state === "play" || props.state === "canPlay" ? (
              <MdPlayCircleOutline />
            ) : (
              <MdPauseCircleOutline />
            )}
          </IconContext.Provider>
        </div>
      )}
      {props.size === "small" && (
        <CircularProgressbarWithChildren value={props.value || 100}>
          <div onClick={props.handlePlayPause} className="wrapper">
            <IconContext.Provider value={{ className: props.classValue }}>
              {props.state === "play" || props.state === "canPlay" ? (
                <MdPause />
              ) : (
                <MdPlayArrow />
              )}
            </IconContext.Provider>
          </div>
        </CircularProgressbarWithChildren>
      )}
    </>
  );
};

export default React.memo(PlayBtn);
