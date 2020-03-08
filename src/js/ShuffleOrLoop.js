import React from "react";
import { IconContext } from "react-icons";
import { MdShuffle, MdRepeatOne } from "react-icons/md";
import ReactTooltip from "react-tooltip";
import "../css/buttons.css";
const ShuffleOrLoop = ({ loop, handleLoop }) => {
  return (
    <div
      onClick={handleLoop}
      className="wrapper"
      data-tip={loop ? "loop mode" : "shuffle mode"}
      data-effect="solid"
      data-place="top"
    >
      <ReactTooltip />
      <IconContext.Provider value={{ className: "loop hover" }}>
        {loop ? <MdRepeatOne /> : <MdShuffle />}
      </IconContext.Provider>
    </div>
  );
};

export default React.memo(ShuffleOrLoop);
