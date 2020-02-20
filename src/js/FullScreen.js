import React from "react";
import { IconContext } from "react-icons";
import { FaExpand } from "react-icons/fa";
import "../css/buttons.css";
const FullScreen = props => {
  return (
    <div onClick={props.handleFullScreen} style={{ marginLeft: "auto" }}>
      <IconContext.Provider value={{ className: "fullscreen hover" }}>
        <FaExpand />
      </IconContext.Provider>
    </div>
  );
};

export default React.memo(FullScreen);
