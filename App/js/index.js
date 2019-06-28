var video = document.getElementById("myvideo");
const playpause = document.getElementById("playpause");
const stop = document.getElementById("stop");
const progressbar = document.getElementById("progressbar");
const progress = document.getElementById("progress");
const volinc = document.getElementById("volume+");
var videoContainer = document.getElementById("container");
const voldec = document.getElementById("volume-");
const mute = document.getElementById("mute");
const fullscreen = document.getElementById("fullscreen");
const controls = document.getElementById("video-controls");
const skipahead = document.getElementById("skipahead");
const skipbackward = document.getElementById("skipbackward");
const showVolume = document.getElementById("volume");
const currentTime = document.getElementById("currenttime");
const remainingTime = document.getElementById("remainingtime");
const thumbnail = document.getElementById("thumbnail");
const subtitles = document.getElementById("subtitles");
let subtitleDisplay = document.getElementById("displaySubtitles");
let firstsource = document.getElementById("firstsource");
let firstThumbnail = document.getElementById("firstThumbnail");
let englishSubtitle = document.getElementById("cue");
const loop = document.getElementById("loop");
var next = document.getElementById("next");
var back = document.getElementById("back");
const title = document.getElementById("title");
var rotate = document.getElementById("rotate");
const canvas = document.getElementById("canvas");
const screenshot = document.getElementById("screenshot");
const sscontainer = document.getElementById("sscontainer");
const close = document.getElementById("close");
var save = document.getElementById("save");
const subtitleSync = document.getElementById("subtitleSync");
const syncForm = document.getElementById("syncForm");
const numb = document.getElementById("numb");
const equilizer = document.getElementById("equilizer");
let audio = document.getElementById("audio");
//const video = document.getElementById("video");
const lowshelf = document.getElementById("lowshelf");
const hightshelf = document.getElementById("highshelf");
//const playpause = document.getElementById("playpause");
const peakingFreq = document.getElementsByClassName("peaking");
const showGain = document.getElementsByClassName("gain");
const select = document.getElementById("select");

const AudioContext = window.AudioContext || window.webkitAudioContext;
//const audiocontext = new AudioContext();
//const track = audiocontext.createMediaElementSource(audio);
// let track = audiocontext.createMediaElementSource(video);
// let biquadFilter = audiocontext.createBiquadFilter();
// const peakingFilter = [];
// const len = peakingFreq.length;
// let highPass = audiocontext.createBiquadFilter();
// const options = document.getElementById("options");
// const optionValues = document.getElementsByClassName("optionsValue");
// const selectValue = document.getElementById("selectValue");
//function definitions
// console.log(new Date());
video.setAttribute("preload", "metadata");
function volchange(data) {
  if (data === "+") {
    if (video.volume < 1) {
      video.volume += 0.1;
    }
    toggleVolumeDisplay.changeDisplay();
  } else if (data === "-") {
    if (video.volume > 0) {
      video.volume -= 0.1;
    }
    toggleVolumeDisplay.changeDisplay();
  }
}

function isFullScreen() {
  return !!(
    document.fullScreen ||
    document.webkitIsFullScreen ||
    document.mozFullScreen ||
    document.msFullscreenElement ||
    document.fullscreenElement
  );
}

function displayTime(Time) {
  let currentTime = Math.floor(Time);
  let seconds = currentTime % 60;
  let minutes = Math.floor(currentTime / 60);
  minutes = minutes % 60;
  let hour = Math.floor(currentTime / 3600);
  let time = hour + ":" + minutes + ":" + seconds;
  return time;
}

function handleFullScreen() {
  if (isFullScreen()) {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    fullscreen.innerHTML = '<img src="icons/maximize.png" />';
  } else {
    if (videoContainer.requestFullscreen) document.body.requestFullscreen();
    else if (videoContainer.mozRequestFullScreen)
      document.body.mozRequestFullScreen();
    else if (videoContainer.webkitRequestFullScreen)
      document.body.webkitRequestFullScreen();
    else if (videoContainer.msRequestFullscreen)
      document.body.msRequestFullscreen();
    fullscreen.innerHTML = '<img src="icons/minimize.png" />';
  }
  videoContainer.focus();
}

function skip(data, numb) {
  if (data === "+") {
    if (video.currentTime + numb <= video.duration) video.currentTime += numb;
    else video.currentTime = video.duration;
  } else if (data === "-") {
    if (video.currentTime - numb >= 0) video.currentTime -= numb;
    else video.currentTime = 0;
  }
}

function changeSubtitleDisplay(obj) {
  if (obj.activeCues[0] !== undefined) {
    let text = obj.activeCues[0].text;
    subtitleDisplay.innerHTML = text;
  } //activeCues will be undefined when cue finishes.
  else subtitleDisplay.innerHTML = "";
}

function subtitlePosition(state) {
  if (state === true) {
    subtitleDisplay.style.bottom = 65 + "px";
  } else subtitleDisplay.style.bottom = 85 + "px";
}

function hideControls(state) {
  if (state === true) {
    controls.style.display = "none";
    progress.style.display = "none";
    currentTime.style.display = "none";
    remainingTime.style.display = "none";
    subtitlePosition(true);
  } else {
    controls.style.display = "block";
    progress.style.display = "block";
    currentTime.style.display = "block";
    remainingTime.style.display = "block";
    subtitlePosition(false);
  }
}

let toggleControls = function() {
  if (!(video.paused || video.ended)) {
    hideControls(false);
    clearTimeout(togglescreen.timer);
    togglescreen.timer = setTimeout(function() {
      hideControls(true);
    }, 10000);
  } else {
    hideControls(false);
  }
};

function changeThumbnail(event) {
  let left = progress.offsetLeft;
  let right = progress.offsetLeft + progress.offsetWidth;
  let current = event.pageX;
  let currentTime =
    (Math.floor(current - left) / progress.offsetWidth) * video.duration;
  thumbnail.currentTime = currentTime;
  changeThumbnailState(true);
  let widthOfThubnail = thumbnail.offsetWidth / 2;

  if (current < widthOfThubnail) {
    thumbnail.style.left = 0;
  } else if (current + widthOfThubnail > right) {
    thumbnail.style.right = 0;
  } else {
    thumbnail.style.left = `${current - widthOfThubnail}px`;
  }
}

function changeThumbnailState(state) {
  thumbnail.setAttribute("data-display", !!state);
}

function controlKeys(event) {
  let key = event.key;
  switch (key) {
    case "ArrowUp":
      volchange("+");
      break;
    case "ArrowDown":
      volchange("-");
      break;

    case "ArrowLeft":
      skip("-", 10);
      break;

    case "ArrowRight":
      skip("+", 10);
      break;

    case "B":
    case "b":
      skip("-", 20);
      break;
    case "F":
    case "f":
      skip("+", 20);
      break;
    case " ":
      handlePlayPause();
      break;
    case "s":
    case "S":
      takeScreenShot();
      break;
  }
  // if (event.key === "ArrowUp") {
  //   volchange("+");
  // } else if (event.key === "ArrowDown") volchange("-");
  // else if (event.key === "ArrowLeft") {
  //   skip("-",10);
  //   toggleControls();
  // } else if (event.key === "ArrowRight") {
  //   skip("+",10);
  //   toggleControls();
  // } else if (event.key === " ") {
  //   handlePlayPause();
  // }
  //  else if()
}

function handlePlayPause() {
  if (video.paused || video.ended) {
    video.play();
    playpause.innerHTML = '<img src="icons/pause.png" />';
    togglescreen.addEvent();
  } else {
    video.pause();
    playpause.innerHTML = '<img src="icons/play.png" />';
    togglescreen.removeEvent();
  }
  videoContainer.focus();
}

function takeScreenShot() {
  if (sscontainer.style.display !== "block") {
    let ctx = canvas.getContext("2d");
    canvas.height =
      (parseInt(videoContainer.style.height) * window.innerHeight) / 100;
    canvas.width =
      (parseInt(videoContainer.style.width) * window.innerHeight) / 100;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let dataURI = canvas.toDataURL("image/jpeg");

    sscontainer.style.display = "block";
    sscontainer.style.zIndex = "1";
    screenshot.src = dataURI;
    screenshot.style.height = `${canvas.height}px`;
    screenshot.style.width = `${canvas.width}px`;
    save.href = dataURI;
    // console.log(dataURI);
    handlePlayPause();
  }
}

let subtitleMenuButtons = [];
let createMenuItem = function(id, lang, label) {
  let listItem = document.createElement("li");
  let button = listItem.appendChild(document.createElement("button"));
  button.setAttribute("id", id);
  button.className = "subtitles-button";
  if (lang.length > 0) button.setAttribute("lang", lang);
  button.value = label;
  button.setAttribute("data-state", "inactive");
  button.appendChild(document.createTextNode(label));
  button.addEventListener("click", function(e) {
    subtitleMenuButtons.map(function(v, i, a) {
      subtitleMenuButtons[i].setAttribute("data-state", "inactive");
    });
    subtitleDisplay.innerHTML = "";
    let lang = this.getAttribute("lang");
    for (let i = 0; i < video.textTracks.length; i++) {
      if (video.textTracks[i].language === lang) {
        video.textTracks[i].mode = "hidden";
        this.setAttribute("data-state", "active");
      } else {
        video.textTracks[i].mode = "disabled";
      }
    }
    subtitlesMenu.style.display = "none";
  });
  subtitleMenuButtons.push(button);
  return listItem;
};

function disableSubtitle() {
  for (var i = 0; i < video.textTracks.length; i++) {
    //to disable all subtitle by default.
    video.textTracks[i].mode = "disabled";
  }
}

let handleLoading = function(args) {
  args = args.replace(/\s/g, "%20");
  let index = args.search(/\.mp4/g);
  if (index >= 0) {
    firstsource.setAttribute("type", "video/mp4");
    firstThumbnail.setAttribute("type", "video/mp4");
  }
  firstsource.setAttribute("src", args);
  firstThumbnail.setAttribute("src", args);
  video.currentTime = 0;
  // video.pause();
  playpause.innerHTML = '<img src="icons/play.png" />';
  progressbar.style.width = 0;
  subtitleDisplay.innerHTML = "";
  togglescreen.removeEvent();
  video.load();
  thumbnail.load();
  handlePlayPause();
  video.play();
};

function handleTracks(subtitlePath) {
  englishSubtitle.parentNode.removeChild(englishSubtitle);
  subtitlePath = subtitlePath.replace(/\s/g, "%20");
  let track = document.createElement("track");
  track.setAttribute("src", subtitlePath);
  track.setAttribute("id", "cue");
  track.setAttribute("label", "English");
  track.setAttribute("kind", "subtitles");
  track.setAttribute("srclang", "en");
  englishSubtitle = track;
  video.appendChild(track);
  video.textTracks[0].addEventListener("cuechange", function() {
    changeSubtitleDisplay(video.textTracks[0]);
  });
  subtitles.style.display = "block";
}

function handleLoop() {
  let src = loop.firstChild.src;

  if (src.indexOf("loop.png") >= 0) {
    loop.firstChild.src = "icons/loop2.png";
    video.loop = true;
  } else {
    loop.firstChild.src = "icons/loop.png";
    video.loop = false;
  }
  videoContainer.focus();
}

// function handleMode(value) {
//   switch (value) {
//     case "Club":
//       handleGain([0, 0, 4, 3, 3, 3, 2, 0, 0, 0]);
//       break;
//     case "Live":
//       handleGain([-3, 0, 2, 3, 3, 3, 2, 1, 1, 1]);
//       break;
//     case "Pop":
//       handleGain([1, 3, 4, 4, 3, 0, -1, -1, 1, 1]);
//       break;
//     case "Soft":
//       handleGain([3, 1, 0, -1, 0, 2, 4, 5, 6, 7]);
//       break;
//     case "Ska":
//       handleGain([-1, -3, -2, 0, 2, 3, 5, 5, 6, 5]);
//       break;
//     case "Reggae":
//       handleGain([0, 0, 0, -3, 0, 3, 3, 0, 0, 0]);
//       break;
//     case "Default":
//       handleGain([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
//       break;
//     case "Rock":
//       handleGain([4, 3, -3, -5, -2, 2, 5, 6, 6, 6]);
//       break;
//     case "Dance":
//       handleGain([5, 4, 1, 0, 0, -3, -4, -4, 0, 0]);
//       break;
//     case "Techno":
//       handleGain([4, 3, 0, -3, -3, 0, 4, 5, 5, 5]);
//       break;
//     case "Headphones":
//       handleGain([3, 6, 3, -2, -1, 1, 3, 5, 7, 7]);
//       break;
//     case "Soft Rock":
//       handleGain([2, 2, 1, 0, -2, -2, -2, 0, 1, 5]);
//       break;
//     case "Classical":
//       handleGain([0, 0, 0, 0, 0, 0, -4, -4, -4, -5]);
//       break;
//     case "Large Hall":
//       handleGain([6, 6, 3, 3, 0, -3, -3, -3, 0, 0]);
//       break;
//     case "Full Base":
//       handleGain([4, 5, 5, 3, 1, -2, -5, -6, -6, -6]);
//       break;
//     case "Full Treble":
//       handleGain([-5, -5, -5, -2, 1, 6, 9, 9, 9, 9]);
//       break;
//     case "Laptop Speakers":
//       handleGain([3, 6, 3, -2, -2, 1, 2, 5, 7, 8]);
//       break;
//     case "Full Bass & Treble":
//       handleGain([4, 3, 0, -4, -3, 1, 4, 6, 7, 6]);
//       break;
//   }
// }

const togglescreen = {
  timer: 0,
  addEvent: function() {
    toggleControls();
    videoContainer.addEventListener("mousemove", toggleControls);
  },
  removeEvent: function() {
    clearInterval(this.timer);
    videoContainer.removeEventListener("mousemove", toggleControls);
    hideControls(false);
  }
};

const toggleVolumeDisplay = {
  timer: 0,
  changeDisplay() {
    showVolume.innerText = Math.floor(video.volume * 100);
    showVolume.style.display = "block";
    clearInterval(this.timer);
    this.timer = setInterval(function() {
      showVolume.style.display = "none";
    }, 5000);
  }
};

video.controls = false;
let supportFs = !!(
  document.fullscreenEnabled ||
  document.mozFullScreenEnabled ||
  document.msFullscreenEnabled ||
  document.webkitSupportsFullscreen ||
  document.webkitFullscreenEnabled ||
  document.createElement("video").webkitRequestFullScreen
);

if (!supportFs) {
  fullscreen.style.display = "none";
}

let subtitlesMenu;
if (video.textTracks) {
  let df = document.createDocumentFragment();
  subtitlesMenu = df.appendChild(document.createElement("ul"));
  subtitlesMenu.className = "subtitles-menu";
  subtitlesMenu.appendChild(createMenuItem("subtitles-off", "", "Off"));
  for (let i = 0; i < video.textTracks.length; i++) {
    subtitlesMenu.appendChild(
      createMenuItem(
        "subtitles-" + video.textTracks[i].language,
        video.textTracks[i].language,
        video.textTracks[i].label
      )
    );
    video.textTracks[i].addEventListener("cuechange", function() {
      changeSubtitleDisplay(video.textTracks[i]);
    });
  }
  videoContainer.appendChild(df);
}

//event listeners
document.addEventListener("fullscreenchange", function(e) {
  if (!isFullScreen()) {
    fullscreen.innerHTML = '<img src="icons/maximize.png" />';
    videoContainer.focus(); //this won't work if tabindex is not specified for nonfocusable elements.
  }
});

document.addEventListener("webkitfullscreenchange", function(e) {
  if (!isFullScreen()) {
    fullscreen.innerHTML = '<img src="icons/maximize.png" />';
    videoContainer.focus(); //this won't work if tabindex is not specified for nonfocusable elements.
  }
});

document.addEventListener("msfullscreenchange", function(e) {
  if (!isFullScreen()) {
    fullscreen.innerHTML = '<img src="icons/maximize.png" />';
    videoContainer.focus(); //this won't work if tabindex is not specified for nonfocusable elements.
  }
});

skipahead.addEventListener("click", function() {
  skip("+", 10);
  videoContainer.focus();
});

skipbackward.addEventListener("click", function() {
  skip("-", 10);
  videoContainer.focus();
});

playpause.addEventListener("click", handlePlayPause);

stop.addEventListener("click", function() {
  video.pause();
  video.currentTime = 0;
  progressbar.style.width = 0;
  playpause.innerHTML = '<img src="icons/play.png" />';
  togglescreen.removeEvent();
  videoContainer.focus();
});

video.addEventListener("timeupdate", function() {
  progressbar.style.width = (video.currentTime / video.duration) * 100 + "%";
  if (video.currentTime === video.duration) {
    togglescreen.removeEvent();
    playpause.innerHTML = '<img src="icons/play.png" />';
  }
  //NaN===NaN is false. so do not try like this:
  // if(video.duration===NaN) return;
  if (video.duration) {
    currentTime.innerHTML =
      `${displayTime(video.currentTime)}` +
      "/" +
      `${displayTime(video.duration)}`;
    remainingTime.innerHTML =
      `${displayTime(video.duration - video.currentTime)}` +
      "/" +
      `${displayTime(video.duration)}`;
  }
});

progress.addEventListener("click", function(e) {
  progressbar.style.width =
    ((e.pageX - this.offsetLeft) / this.offsetWidth) * 100 + "%";
  video.currentTime =
    ((e.pageX - this.offsetLeft) / this.offsetWidth) * video.duration;
  videoContainer.focus();
});

volinc.addEventListener("click", function(event) {
  volchange("+");
  videoContainer.focus();
});

videoContainer.addEventListener("dblclick", function() {
  handleFullScreen();
});

videoContainer.addEventListener("keydown", function(event) {
  if (!isFullScreen()) {
    controlKeys(event);
  }
});

videoContainer.addEventListener("click", function() {
  videoContainer.focus();
});

document.addEventListener("keydown", function(event) {
  if (isFullScreen()) {
    controlKeys(event);
  }
});

voldec.addEventListener("click", function(e) {
  volchange("-");
  videoContainer.focus();
});

mute.addEventListener("click", function() {
  video.muted = !video.muted;
  if (!video.muted) {
    mute.innerHTML = '<img src="icons/mute.png" />';
  } else mute.innerHTML = '<img src="icons/unmute.png" />';
  videoContainer.focus();
});

fullscreen.addEventListener("click", handleFullScreen);

video.addEventListener("loadedmetadata", function() {
  currentTime.innerHTML = `${displayTime(0)}/${displayTime(video.duration)}`;
  remainingTime.innerHTML =
    `${displayTime(video.duration)}` + "/" + `${displayTime(video.duration)}`;
  disableSubtitle();
});

progress.addEventListener("mousemove", function(event) {
  changeThumbnail(event);
});

progress.addEventListener("mouseout", function() {
  changeThumbnailState(false);
});
loop.addEventListener("click", handleLoop);

subtitles.addEventListener("click", function() {
  if (subtitlesMenu) {
    subtitlesMenu.style.display =
      subtitlesMenu.style.display == "block" ? "none" : "block";
  }
});
close.addEventListener("click", function() {
  sscontainer.style.display = "none";
  sscontainer.style.zIndex = "-2";
  screenshot.src = "";
  videoContainer.focus();
  handlePlayPause();
});
// console.log(new Date());

// biquadFilter.type = "lowshelf";
// biquadFilter.frequency.value = 32.0;
// biquadFilter.gain.value = 0.0;

// track.connect(biquadFilter);
// for (i = 0; i < len; i++) {
//   peakingFilter[i] = audiocontext.createBiquadFilter();
//   peakingFilter[i].type = "peaking";
//   peakingFilter[i].gain.value = 0.0;
//   peakingFilter[i].Q.value = 1;
//   if (i === 0) biquadFilter.connect(peakingFilter[i]);
//   else peakingFilter[i - 1].connect(peakingFilter[i]);
// }
// peakingFilter[0].frequency.value = 64.0;
// peakingFilter[1].frequency.value = 125.0;
// peakingFilter[2].frequency.value = 250.0;
// peakingFilter[3].frequency.value = 500.0;
// peakingFilter[4].frequency.value = 1000.0;
// peakingFilter[5].frequency.value = 2000.0;
// peakingFilter[6].frequency.value = 4000.0;
// peakingFilter[7].frequency.value = 8000.0;
// highPass.frequency.value = 16000;
// highPass.gain.value = 0.0;
// peakingFilter[len - 1].connect(highPass).connect(audiocontext.destination);

// function handleGain(gains) {
//   biquadFilter.gain.value = gains[0];
//   lowshelf.value = gains[0];
//   showGain[0].innerHTML = gains[0] + "dB";
//   for (let i = 0; i < 8; i++) {
//     peakingFilter[i].gain.value = gains[i + 1];
//     peakingFreq[i].value = gains[i + 1];
//     showGain[i + 1].innerHTML = gains[i + 1] + "dB";
//   }
//   showGain[9].innerHTML = gains[9] + "dB";
//   highPass.gain.value = gains[9];
//   hightshelf.value = gains[9];
// }

// lowshelf.addEventListener("input", function() {
//   let gain = this.value;
//   biquadFilter.gain.value = gain;
//   showGain[0].innerHTML = gain + "dB";
// });

// highshelf.addEventListener("input", function() {
//   let gain = this.value;
//   highPass.gain.value = gain;
//   showGain[9].innerHTML = gain + "dB";
// });

/*peakingFilter[1].frequency.setValueAtTime(125,audiocontext.currentTime);
peakingFilter[2].frequency.setValueAtTime(250,audiocontext.currentTime);
peakingFilter[3].frequency.setValueAtTime(500,audiocontext.currentTime);
peakingFilter[4].frequency.setValueAtTime(1000,audiocontext.currentTime);
peakingFilter[5].frequency.setValueAtTime(2000,audiocontext.currentTime);
peakingFilter[6].frequency.setValueAtTime(4000,audiocontext.currentTime);
peakingFilter[7].frequency.setValueAtTime(8000,audiocontext.currentTime);*/
//track.connect(biquadFilter).connect(audiocontext.destination);

// highPass.frequency.setValueAtTime(16000,audiocontext.currentTime);

// for (let i = 0; i < len; i++) {
//   peakingFreq[i].addEventListener("input", function() {
//     let gain = this.value;
//     peakingFilter[i].gain.value = gain;
//     showGain[i + 1].innerHTML = gain + "dB";
//   });
// }

// selectValue.addEventListener("click", function(event) {
//   options.style.display = "block";
// });

// options.addEventListener("mouseover", function(event) {
//   console.log("here");
//   handleMode(event.target.innerText);
// });

// options.addEventListener("click", function(event) {
//   let data = event.target.innerText;
//   selectValue.innerText = data;
//   for (let i = 0; i < optionValues.length; i++) {
//     optionValues[i].classList.remove("active");
//   }
//   event.target.classList.add("active");
//   options.style.display = "none";
//   equilizer.style.display = "";
//   equilizer.style.zIndex = "";
// });
syncForm.addEventListener("submit", event => {
  event.preventDefault();
  subtitleSync.style.display = "";
  subtitleSync.style.zIndex = "";
});

// document.body.addEventListener("mousemove", function(event) {
//   if (
//     !(
//       event.pageY >= 96 &&
//       event.pageY <= 290 &&
//       event.pageX <= 893 &&
//       event.pageX >= 395
//     )
//   ) {
//     if (event.pageX <= 400 || event.pageX >= 553) {
//       handleMode(selectValue.innerText);
//       options.style.display = "none";
//     }
//     if (event.pageY >= 631 || event.pageY <= 295) {
//       handleMode(selectValue.innerText);
//       options.style.display = "none";
//     }
//   }
// });
