import React from "react";
import { MdPlayCircleOutline, MdPauseCircleOutline } from "react-icons/md";
import { IconContext } from "react-icons";
import "../css/buttons.css";

const PlayBtn = props => {
  return (
    <div
      onClick={props.handlePlayPause ? props.handlePlayPause : () => {}}
      className="wrapper"
    >
      <IconContext.Provider value={{ className: props.classValue }}>
        {props.state === "play" || props.state === "canPlay" ? (
          props.size === "large" ? (
            <MdPlayCircleOutline />
          ) : (
            <MdPauseCircleOutline />
          )
        ) : props.size === "large" ? (
          <MdPauseCircleOutline />
        ) : (
          <MdPlayCircleOutline />
        )}
      </IconContext.Provider>
    </div>
  );
};

export default React.memo(PlayBtn);
