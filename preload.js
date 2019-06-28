const electron = require("electron");
const ipc = electron.ipcRenderer;
const fs = require("fs");

let i = 1;
let ctrlStr = false;
let prevState = 0;
const handleFolder = {
  videoList: [],
  src: "",
  directory: "",
  currentIndex: 0,
  handlePrevNext: function(numb) {
    //handleEquilizer();
    let index = handleFolder.currentIndex;
    ipc.send("current-progress", 0);
    prevState = 0.0;
    numb.value = 0.0;
    if (numb === 1) {
      if (index === handleFolder.videoList.length - 2) {
        next.style.display = "none";
        return;
      } else {
        next.style.display = "block";
        back.style.display = "block";
      }
      if (index === handleFolder.videoList.length - 1) {
        next.style.display = "none";
        return;
      }
      handleFolder.src = handleFolder.videoList[index + 1];
      title.innerHTML = handleFolder.src;
      handleFolder.currentIndex = index + 1;
      handleSubtitles("", handleFolder.directory + "\\" + handleFolder.src);
    } else {
      if (index - 2 === -1) {
        back.style.display = "none";
      } else {
        next.style.display = "block";
        back.style.display = "block";
      }

      handleFolder.src = handleFolder.videoList[index - 1];
      title.innerHTML = handleFolder.src;
      handleFolder.currentIndex = index - 1;
      handleSubtitles("", handleFolder.directory + "\\" + handleFolder.src);
    }
  },

  folderSelect: function(foldername, filename) {
    handleFolder.directory = foldername;

    handleFolder.currentIndex = 0;
    prevState = 0.0;
    numb.value = 0.0;
    fs.readdir(foldername, function(err, files) {
      if (err) {
        return;
      }
      handleFolder.videoList = files.filter(file => {
        let extension = file.substr(file.lastIndexOf("."), file.length - 1);
        switch (extension) {
          case ".mp4":
          case ".MP4":
          case ".mkv":
          case ".MKV":
          case ".avi":
          case ".AVI":
          case ".OGG":
          case ".ogg": {
            return true;
          }
        }

        //pending from here
      });
      // console.log(handleFolder.videoList);
      //handleEquilizer();
      if (filename === undefined) {
        handleFolder.src = handleFolder.videoList[0];
        title.innerHTML = handleFolder.src;
        handleSubtitles("", handleFolder.directory + "\\" + handleFolder.src);
        next.style.display = "block";
        back.style.display = "none";
      } else {
        let index = handleFolder.videoList.indexOf(filename);
        handleFolder.currentIndex = index;
        if (index === 0) {
          back.style.display = "none";
          next.style.display = "block";
        }
        if (index === handleFolder.videoList.length - 1) {
          next.style.display = "none";
          back.style.display = "block";
        }
      }

      if (i === 1) {
        next.addEventListener("click", function() {
          handleFolder.handlePrevNext(1);
        });
        back.addEventListener("click", function() {
          handleFolder.handlePrevNext(-1);
        });
        video.addEventListener("ended", function() {
          handleFolder.handlePrevNext(1);
          prevState = 0.0;
          numb.value = 0.0;
        });
        video.addEventListener("timeupdate", handleProgress);
        video.addEventListener("loadedmetadata", function() {
          aspectratio.index = 0;
          handleDimension(2);
          videoContainer.style.transform = "";
        });
      }

      i++;
    });
  }
};

const aspectratio = {
  ratio: [16 / 9, 5 / 4, 16 / 10, 4 / 3, 18 / 9],
  index: 0
};

// here each time i select folder new event listener will be added.so multiple handlePrevNext calls will fire.
//To avoid this i put this in if condition.
function handleSubtitles(subtitlePath, args) {
  currentTime.innerHTML = "";
  remainingTime.innerHTML = "";
  if (args !== "") {
    subtitlePath = args.replace(
      /((\.)[a-zA-Z0-9]{3}|(\.)[a-zA-Z0-9]{4})$/,
      ".vtt"
    );
    fs.stat(subtitlePath, function(err) {
      if (err) {
        let newSubtitle = subtitlePath.replace(/(\.)[a-z0-9]{3}/i, ".srt");
        fs.stat(newSubtitle, function(error) {
          if (error) {
            subtitles.style.display = "none";
            englishSubtitle.setAttribute("src", "");

            handleLoading(args);
          } else {
            srtToVtt(newSubtitle, args);
          }
        });
      } else {
        handleTracks(subtitlePath);
        handleLoading(args);
      }
    });
  } else {
    let index = subtitlePath.search(/\.vtt/);
    if (index >= 0) {
      handleTracks(subtitlePath);
    } else {
      srtToVtt(subtitlePath, "");
    }
  }
}

// function handleEquilizer() {
//   equilizer.style.display = "";
//   equilizer.style.zIndex = "";
//   for (let i = 0; i < peakingFreq.length; i++) {
//     peakingFreq[i].value = 0;
//   }
//   lowshelf.value = hightshelf.value = 0;
//   for (let i = 0; i < optionValues.length; i++) {
//     optionValues[i].classList.remove("active");
//   }
//   optionValues[0].classList.add("active");
//   selectValue.innerText = "Default";
//   options.style.display = "none";

//   ipc.send("reset");
// }

function srtToVtt(newSubtitle, args) {
  fs.writeFile("subtitle.vtt", "WEBVTT\n", function(err) {
    if (err) {
      return;
    }
  });
  fs.readFile(newSubtitle, "utf8", function(err, text) {
    if (err) {
      return;
    }
    text = text.split("");
    let start = 0;
    while (text.indexOf(">", start + 1) >= 0) {
      let index = text.indexOf(">", start + 1);
      text[index - 7] = ".";
      text[index + 10] = ".";
      start = index;
    }
    text = text.join("");
    fs.appendFile("subtitle.vtt", "\r\n" + text, function(err) {
      if (err) {
        return;
      } else {
        if (args != "") {
          handleTracks("subtitle.vtt");
          handleLoading(args);
        } else {
          handleTracks("subtitle.vtt");
        }
      }
    });
  });
}

function handleProgress() {
  let len = video.currentTime / video.duration;
  ipc.send("current-progress", len);
}

function handleDimension(args) {
  let height = video.videoHeight;
  let width = video.videoWidth;
  if (aspectratio.ratio.length > 5) {
    aspectratio.ratio.pop();
  }
  aspectratio.ratio.push(width / height);
  if (ctrlStr) {
    let ratio = width / height;
    handleAspectRatio(ratio);
    return;
  }

  if (height > screen.height - 100) {
    height = screen.height - 100;
    let height1 = video.videoHeight;
    let width1 = video.videoWidth;
    width = (width1 / height1) * height;
    if (width > screen.width) {
      width = screen.width;
      height = width * (height1 / width1);
      if (height > screen.height) {
        height = screen.height - 100;
        width = (screen.width / screen.height) * height;
      }
    }
  }

  if (width > screen.width) {
    width = screen.width;
    height = width * (height1 / width1);
    if (height > screen.height) {
      height = screen.height - 100;
      width = (width1 / height1) * height;
    }
    if (width > screen.width) {
      height = screen.height - 100;
      width = (screen.width / screen.height) * height;
    }
  }

  if (!args) {
    videoContainer.style.height = ``;
    videoContainer.style.width = ``;
  }

  let dimension = {
    height: Math.floor(height + 50),
    width: Math.floor(width),
    args: args //win needs height and width in int,not in float
  };

  // let height = video.videoHeight;
  // let width = video.videoWidth;
  // let ratio = width/height;
  //handleAspectRatio(ratio);
  //console.log(ratio);
  ipc.send("dimension", dimension);
}

function handleVideoSelect(args) {
  let index = args.lastIndexOf("\\");
  let folder = args.substr(0, index);
  let file = args.substr(index + 1, args.length);
  handleFolder.folderSelect(folder, file);
  title.innerHTML = file;
  handleSubtitles("", args);
  // // when you search file using fs.stat() use actual urls,i.e. don't replace " " with %20
  //in above way video will play even if " " will not be replaced by %20.but it is good practice to do.
}

function handleAspectRatio(ratio) {
  //console.log(video.videoHeight, video.videoWidth);
  /* let width = 100 * ratio;
  let width1, height1;
  if (ctrlStr) height1 = screen.height;
  else height1 = video.videoHeight;
  width1 = ratio * height1;
  console.log(width1, screen.width, video.videoHeight);
  if (width1 > screen.width) {
    width = (screen.width / screen.height) * 100;
    let height = width / ratio;
    videoContainer.setAttribute(
      "style",
      "width : " + `${width}vh` + ";height : " + `${height}vh`
    );
  } else {
    //videoContainer.style.width = `${width}vh` + " " + "!important";
    videoContainer.setAttribute(
      "style",
      "width : " + `${width}vh` + ";height : " + `${100}vh`
    );
    // videoContainer.style.cssText = "height: 500px !important";
  }*/
  let width1 = ratio * video.videoHeight;
  let width2 = ratio * (screen.height - 100);
  if (
    (width1 < screen.width && width2 > screen.width) ||
    (width1 > screen.width && width2 > screen.width)
  ) {
    let height = 100 / ratio;
    videoContainer.style.height = `${height}vw`;
    videoContainer.style.width = `${100}vw`;
  } else {
    let width = ratio * 100;
    videoContainer.style.height = `${100}vh`;
    videoContainer.style.width = `${width}vh`;
  }
}

function handleSSync(diff2) {
  let diff;
  if (!diff2) {
    let value = numb.value;
    diff = value - prevState;
    prevState = value;
  } else diff = diff2;
  Array.from(video.textTracks).forEach(track => {
    if (track.mode === "hidden") {
      Array.from(track.cues).forEach(cue => {
        cue.startTime += diff;
        cue.endTime += diff;
      });
      if (diff2) {
        prevState = numb.value;
        numb.value = (Number(numb.value) + diff2).toFixed(2);
      }
    }
  });
}

// Event Listeners
let index = setTimeout(function() {
  // console.log(new Date());
  videoContainer.addEventListener("dragover", function(event) {
    event.preventDefault();
  });
  videoContainer.addEventListener("drop", function(event) {
    let fileList = event.dataTransfer.files;
    // let items = event.dataTransfer.items;
    //let item = items[0].webkitGetAsEntry();
    // console.log(item.DirectoryEntry);
    //handleFolder.folderSelect(item.DirectoryEntry.fullPath);
    /* if(item.isDirectory) {
      let dirReader = item.createReader();
      dirReader.readEntries(function(entries){
        for(let i=0;i<entries.length;i++){
          console.log(item.name);
        }
      });
    }*/
    let file = fileList[0];
    fs.stat(file.path, function(err, stats) {
      if (err) return;
      else if (stats.isDirectory()) {
        handleFolder.folderSelect(file.path);
      } else {
        if (file.type.match(/video\//)) {
          handleVideoSelect(file.path);
        }
      }
    });
  });
  videoContainer.addEventListener("keydown", function(event) {
    if (event.key === "a" || event.key === "A") {
      aspectratio.index = (aspectratio.index + 1) % 6;
      handleAspectRatio(aspectratio.ratio[aspectratio.index]);
    } else if (event.key === "n" || event.key === "N") {
      handleFolder.handlePrevNext(1);
    } else if (event.key === "p" || event.key === "P") {
      handleFolder.handlePrevNext(-1);
    } else if (event.key === "c") {
      numb.value = (Number(numb.value) - 0.1).toFixed(2);
      handleSSync(-0.1);
    } else if (event.key === "d") {
      numb.value = (Number(numb.value) + 0.1).toFixed(2);
      handleSSync(0.1);
    } else if (event.key === "r") {
      subtitleSync.style.display = "block";
      subtitleSync.style.zIndex = "2";
      numb.focus();
    }
  });
  rotate.addEventListener("click", function() {
    let ratio = video.videoWidth / video.videoHeight;
    if (ratio < 1) {
      let width = 80 * ratio;

      videoContainer.style.transform = //"rotate(90deg)";
        //videoContainer.style.left = "0px";
        "translateX(-50%) rotate(90deg) translateX(-30%)";
      videoContainer.style.width = `${width}vw`;
      videoContainer.style.height = `80vw`;
    }
    // let width = screen.height - 100;
    // let height = width * (video.videoHeight / video.videoWidth);
    // videoContainer.style.height = `${height}px`;
    // videoContainer.style.width = `${width}px`;
    // videoContainer.style.transform = `rotate(${90}deg)`;
    // videoContainer.style.transformOrigin = "10% 30%";
  });
  save.addEventListener("click", function(event) {
    event.preventDefault();
    ipc.send("save");
  });
  videoContainer.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "s") {
      if (sscontainer.style.display === "block") ipc.send("save");
    }
  });
}, 1000);

ipc.on("ratio-selected", function(event, ratio) {
  if (!Number(ratio)) {
    let height = video.videoHeight;
    let width = video.videoWidth;
    ratio = width / height;
  }

  handleAspectRatio(ratio);
});

ipc.on("change", function(event, data) {
  if (data === 1) {
    ctrlStr = true;
    videoContainer.focus();
  } else {
    ctrlStr = false;

    handleDimension(1);
    videoContainer.focus();
  }
});

ipc.on("dimensionApplied", function(event, data) {
  if (!ctrlStr) handleAspectRatio(data.width / data.height);
});

ipc.on("saved", function(event) {
  sscontainer.style.display = "none";
  sscontainer.style.zIndex = "-2";
  screenshot.src = "";
  videoContainer.focus();
  handlePlayPause();
});

ipc.on("showForm", function(event) {
  subtitleSync.style.display = "block";
  subtitleSync.style.zIndex = "2";
  numb.focus();
});

ipc.on("video-selected", function(event, args) {
  handleVideoSelect(args);
});

ipc.on("subtitle-selected", function(event, args) {
  handleSubtitles(args, "");
});

ipc.on("folder-selected", function(event, foldername) {
  handleFolder.folderSelect(foldername);
});
// ipc.on("show", function() {
//   equilizer.style.display = "block";
//   equilizer.style.zIndex = "3";
// });
// ipc.on("hide", function() {
//   equilizer.style.display = "";
//   equilizer.style.zIndex = "";
// });
// console.log(new Date());
