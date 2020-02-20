import React from "react";
import "../css/controls.css";
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
import PlayBtn from "./PlayBtn";
import SkipBtn from "./SkipBtn";
import FullScreen from "./FullScreen.js";

// import {
//   FaPlay,
//   FaVolumeUp,
//   FaVolumeDown,
//   FaVolumeMute,
//   FaBackward,
//   FaForward,
//   FaExpand,
//   FaRedo,
//   FaStepBackward,
//   FaStepForward,
//   FaClosedCaptioning
// } from "react-icons/fa";
// import { IconContext } from "react-icons";
// class Controls extends React.PureComponent {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     return (
//       <>
//         <ul id="video-controls" className="controls">
//           <li className="buttons">
//             <button id="playpause" className="ctrlBtns">
//               <IconContext.Provider value={{ className: "fontSize" }}>
//                 <FaPlay />
//               </IconContext.Provider>
//             </button>
//           </li>
//           <li className="buttons">
//             <button id="volumeInc" className="ctrlBtns">
//               <IconContext.Provider value={{ className: "fontSize" }}>
//                 <FaVolumeUp />
//               </IconContext.Provider>
//             </button>
//           </li>
//           <li className="buttons">
//             <button id="volume-" className="ctrlBtns">
//               <IconContext.Provider value={{ className: "fontSize" }}>
//                 <FaVolumeDown />
//               </IconContext.Provider>
//             </button>
//           </li>
//           <li className="buttons">
//             <button id="mute" className="ctrlBtns">
//               <IconContext.Provider value={{ className: "fontSize" }}>
//                 <FaVolumeMute />
//               </IconContext.Provider>
//             </button>
//           </li>
//           <li className="buttons">
//             <button id="skipbackward" className="ctrlBtns">
//               <IconContext.Provider value={{ className: "fontSize" }}>
//                 <FaBackward />
//               </IconContext.Provider>
//             </button>
//           </li>
//           <li className="buttons">
//             <button id="skipahead" className="ctrlBtns">
//               <IconContext.Provider value={{ className: "fontSize" }}>
//                 <FaForward />
//               </IconContext.Provider>
//             </button>
//           </li>

//           <li className="buttons">
//             <button id="loop" className="ctrlBtns">
//               <IconContext.Provider value={{ className: "fontSize" }}>
//                 <FaRedo />
//               </IconContext.Provider>
//             </button>
//           </li>
//           <li className="buttons">
//             <button id="back" className="ctrlBtns">
//               <IconContext.Provider value={{ className: "fontSize" }}>
//                 <FaStepBackward />
//               </IconContext.Provider>
//             </button>
//           </li>
//           <li className="buttons">
//             <button id="next" className="ctrlBtns">
//               <IconContext.Provider value={{ className: "fontSize" }}>
//                 <FaStepForward />
//               </IconContext.Provider>
//             </button>
//           </li>
//           <li className="buttons">
//             <button id="subtitles" className="ctrlBtns">
//               <IconContext.Provider value={{ className: "fontSize" }}>
//                 <FaClosedCaptioning />
//               </IconContext.Provider>
//             </button>
//           </li>
//           <li className="buttons right">
//             <button id="fullscreen" className="ctrlBtns">
//               <IconContext.Provider value={{ className: "fontSize" }}>
//                 <FaExpand />
//               </IconContext.Provider>
//             </button>
//           </li>
//         </ul>
//       </>
//     );
//   }
// }

const Controls = ({ data, handlers }) => {
  return (
    <div id="controls">
      <div id="controls__first">
        <Progress
          duration={data.duration}
          currentTime={data.currentTime}
          handleCurrentTime={handlers.handleCurrentTime}
          url={data.url}
        />
      </div>
      <div id="controls__second">
        <Volume
          volume={data.volume}
          muted={data.muted}
          handleMute={handlers.handleMute}
          handleVolume={handlers.handleVolume}
        />
        <div id="controls__second__center">
          <Time Time={data.currentTime} />
          <SkipBtn
            handlePrevious={() => {
              console.log("working");
            }}
            type="handlePrevious"
            classValue={"skipbtn hover"}
          >
            <MdSkipPrevious />
          </SkipBtn>
          <SkipBtn
            handleReplay={handlers.handleReplay}
            type="handleReplay"
            classValue={"skipbtn hover"}
          >
            <MdReplay5 />
          </SkipBtn>
          <PlayBtn
            state={data.state}
            handlePlayPause={handlers.handlePlayPause}
            size="small"
            classValue={"play hover"}
          />

          <SkipBtn
            handleForward={handlers.handleForward}
            type="handleForward"
            classValue={"skipbtn hover"}
          >
            <MdForward5 />
          </SkipBtn>
          <SkipBtn
            handleNext={handlers.handleNext}
            type="handleNext"
            classValue={"skipbtn hover"}
          >
            <MdSkipNext />
          </SkipBtn>
          <Time Time={data.duration - data.currentTime} />
        </div>
        <FullScreen handleFullScreen={handlers.handleFullScreen} />
      </div>
    </div>
  );
};

export default React.memo(Controls);
