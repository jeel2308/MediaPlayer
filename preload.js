const electron = require("electron");
const ipc = electron.ipcRenderer;
const path = require("path");
const fs = require("fs");
const remote = electron.remote;
let i = 1;
let state = 0;
let gainArr = [];
let ctrlStr = false;
let prevState = 0;
let allowed = false;
let window2 = remote.getGlobal("window2");
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
    }
    handleLoading(handleFolder.directory + "//" + handleFolder.src);
    handleInitialGain();
  },

  folderSelect: function(foldername, filename) {
    if (handleFolder.directory === foldername) {
      if (filename) handleLoading(handleFolder.directory + "//" + filename);
      return;
    }
    allowed = false;
    if (window2) window2.webContents.send("changeAllowed");
    handleFolder.directory = foldername;

    handleFolder.currentIndex = 0;
    prevState = 0.0;
    numb.value = 0.0;
    fs.readdir(foldername, function(err, files) {
      if (err) {
        return;
      }
      handleFolder.videoList = files.filter(file => {
        let extension = file.substring(file.lastIndexOf("."), file.length);
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
      });

      if (filename === undefined) {
        handleFolder.src = handleFolder.videoList[0];
        title.innerHTML = handleFolder.src;
        next.style.display = "block";
        back.style.display = "none";
      } else {
        handleFolder.src = filename;
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
      subtitles.style.display = "none";
      handleInitialGain();
      handleLoading(handleFolder.directory + "//" + handleFolder.src);
    });
  }
};

const aspectratio = {
  ratio: [16 / 9, 5 / 4, 16 / 10, 4 / 3, 18 / 9],
  index: 0
};

// here each time i select folder new event listener will be added.so multiple handlePrevNext calls will fire.
//To avoid this i put this in if condition.
function handleSubtitles(fileName) {
  let index = fileName.search(new RegExp(".vtt"));
  if (index === -1) {
    fileName = srtToVtt(fileName);
  }
  handleTracks(fileName);
}

function srtToVtt(srtfile) {
  let vttfile = path.join(__dirname, "App", "Appdata", "subtitle.vtt");
  fs.writeFileSync(vttfile, "WEBVTT\n");
  let text = fs.readFileSync(srtfile, { encoding: "utf8" });
  text = text.split("");
  let start = 0;
  while (text.indexOf(">", start + 1) >= 0) {
    let index = text.indexOf(">", start + 1);
    text[index - 7] = ".";
    text[index + 10] = ".";
    start = index;
  }
  text = text.join("");
  fs.appendFileSync(vttfile, text);
  fs.appendFileSync(vttfile, "\r\n");
  return vttfile;
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

  ipc.send("dimension", dimension);
}

function handleVideoSelect(args) {
  let index = args.lastIndexOf("\\");
  let folder = args.substr(0, index);
  let file = args.substr(index + 1, args.length);
  handleFolder.folderSelect(folder, file);
  title.innerHTML = file;

  // // when you search file using fs.stat() use actual urls,i.e. don't replace " " with %20
  //in above way video will play even if " " will not be replaced by %20.but it is good practice to do.
}

function handleAspectRatio(ratio) {
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

function handleInitialGain() {
  if (state) {
    let timer = setTimeout(function() {
      handleGain(gainArr);
    }, 500);
    state = 0;
  }
  if (!allowed) {
    handleGain([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    // localStorage.setItem("check", false);
    let window2 = remote.getGlobal("window2");
    if (window2) window2.webContents.send("reset");
    else {
      localStorage.setItem(
        "frequency",
        JSON.stringify({
          mode: "Default",
          gain: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        })
      );
      localStorage.setItem("check", false);
    }
  }
}

// Event Listeners
let index = setTimeout(function() {
  videoContainer.addEventListener("dragover", function(event) {
    event.preventDefault();
  });
  videoContainer.addEventListener("drop", function(event) {
    let fileList = event.dataTransfer.files;

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

  save.addEventListener("click", function(event) {
    event.preventDefault();
    ipc.send("save", save.href);
  });

  next.addEventListener("click", function() {
    console.log("click");
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
  handleSubtitles(args);
  subtitles.style.display = "block";
});

ipc.on("folder-selected", function(event, foldername) {
  handleFolder.folderSelect(foldername);
});

ipc.on("handleGain", function(event, data) {
  if (!firstsource.getAttribute("src")) {
    state = 1;
    gainArr = data;
  } else handleGain(data);
});
ipc.on("midband", function(event, data) {
  Filters[data.index].gain.value = data.value;
});
ipc.on("lowshelf", function(event, data) {
  biquadFilter.gain.value = data;
});
ipc.on("highshelf", function(event, data) {
  highPass.gain.value = data;
});
ipc.on("initialize", function(event) {
  localStorage.setItem(
    "frequency",
    JSON.stringify({
      mode: "Default",
      gain: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    })
  );
  localStorage.setItem("check", false);
});
ipc.on("reset", function(event) {
  handleGain([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});
ipc.on("check", function(event, data) {
  allowed = data;
});
console.log(new Date(), __dirname);
