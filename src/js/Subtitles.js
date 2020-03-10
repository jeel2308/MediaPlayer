import React from "react";
import { MdClosedCaption } from "react-icons/md";
import { FaClosedCaptioning } from "react-icons/fa";
import { IconContext } from "react-icons";
import ReactTooltip from "react-tooltip";
import "../css/buttons.css";
const Subtitles = props => {
  return (
    <div
      onClick={props.handleSubtitles}
      className="subtitles"
      style={{ display: props.subtitlesBtn }}
      data-tip={
        props.subtitlesBtnState === "none" ? "Caption Off" : "Caption On"
      }
      data-effect="solid"
      data-place="top"
    >
      <ReactTooltip />
      <IconContext.Provider value={{ className: "wrapper hover" }}>
        {props.subtitlesBtnState === "none" ? (
          <MdClosedCaption />
        ) : (
          <FaClosedCaptioning />
        )}
      </IconContext.Provider>
      <div
        className="border"
        style={{ display: props.subtitlesBtnState }}
      ></div>
    </div>
  );
};

export default React.memo(Subtitles);
