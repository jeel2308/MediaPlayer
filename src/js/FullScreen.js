import React from "react";
import { IconContext } from "react-icons";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import "../css/buttons.css";
const FullScreen = props => {
  return (
    <div onClick={props.handleFullScreen} style={{ marginLeft: "auto" }}>
      <IconContext.Provider value={{ className: "fullscreen hover" }}>
        {props.fullScreen === "true" ? <MdFullscreenExit /> : <MdFullscreen />}
      </IconContext.Provider>
    </div>
  );
};

export default React.memo(FullScreen);
