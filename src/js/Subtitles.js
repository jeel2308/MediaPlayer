import React from "react";
import { MdClosedCaption } from "react-icons/md";
import { IconContext } from "react-icons";
import "../css/buttons.css";
const Subtitles = props => {
  console.log(props);
  return (
    <div
      onClick={props.handleSubtitles}
      className="subtitles"
      style={{ display: props.subtitlesBtn }}
    >
      <IconContext.Provider value={{ className: "wrapper hover" }}>
        <MdClosedCaption />
      </IconContext.Provider>
      <div
        className="border"
        style={{ display: props.subtitlesBtnState }}
      ></div>
    </div>
  );
};

export default React.memo(Subtitles);
