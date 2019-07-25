const electron = require("electron");
const ipc = electron.ipcRenderer;
const remote = electron.remote;

const select = document.getElementById("select");
const current = document.getElementById("default");
const options = document.getElementsByClassName("optionsValue");
const highshelf = document.getElementById("highshelf");
const lowshelf = document.getElementById("lowshelf");
const frequencies = document.getElementsByClassName("Frequencies");
const dbgain = document.getElementsByClassName("gain");
const defaultOption = document.querySelector(".optionsValue:nth-child(8)");
const reset = document.getElementById("reset");
const checkbox = document.getElementById("checkbox");
//console.log(defaultOption);
let state = localStorage.getItem("check");

console.log(checkbox.checked);
checkbox.checked = state === "true" ? true : false;

select.addEventListener("click", function(event) {
  let len = options.length;
  for (let i = 0; i < len; i++) {
    options[i].classList.remove("active");
  }
  event.target.classList.add("active");
  current.innerHTML = event.target.innerHTML;
  handleMode(event.target.innerHTML);
});

let arr = [];
let win = remote.getGlobal("win");

let data = localStorage.getItem("frequency");
if (data) {
  data = JSON.parse(data);
  changeDisplay(data.gain);
  current.innerHTML = data.mode;
  let len = options.length;
  for (let i = 0; i < len; i++) {
    options[i].classList.remove("active");
  }
  for (let i = 0; i < len; i++) {
    if (options[i].innerHTML === data.mode) {
      options[i].classList.add("active");
      break;
    }
  }
}
function handleMode(value) {
  switch (value) {
    case "Club":
      arr = [0, 0, 4, 3, 3, 3, 2, 0, 0, 0];
      break;
    case "Live":
      arr = [-3, 0, 2, 3, 3, 3, 2, 1, 1, 1];
      break;
    case "Pop":
      arr = [1, 3, 4, 4, 3, 0, -1, -1, 1, 1];
      break;
    case "Soft":
      arr = [3, 1, 0, -1, 0, 2, 4, 5, 6, 7];
      break;
    case "Ska":
      arr = [-1, -3, -2, 0, 2, 3, 5, 5, 6, 5];
      break;
    case "Reggae":
      arr = [0, 0, 0, -3, 0, 3, 3, 0, 0, 0];
      break;
    case "Default":
      arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      break;
    case "Rock":
      arr = [4, 3, -3, -5, -2, 2, 5, 6, 6, 6];
      break;
    case "Dance":
      arr = [5, 4, 1, 0, 0, -3, -4, -4, 0, 0];
      break;
    case "Techno":
      arr = [4, 3, 0, -3, -3, 0, 4, 5, 5, 5];
      break;
    case "Headphones":
      arr = [3, 6, 3, -2, -1, 1, 3, 5, 7, 7];
      break;
    case "Soft Rock":
      arr = [2, 2, 1, 0, -2, -2, -2, 0, 1, 5];
      break;
    case "Classical":
      arr = [0, 0, 0, 0, 0, 0, -4, -4, -4, -5];
      break;
    case "Large Hall":
      arr = [6, 6, 3, 3, 0, -3, -3, -3, 0, 0];
      break;
    case "Full Base":
      arr = [4, 5, 5, 3, 1, -2, -5, -6, -6, -6];
      break;
    case "Full Treble":
      arr = [-5, -5, -5, -2, 1, 6, 9, 9, 9, 9];
      break;
    case "Laptop Speakers":
      arr = [3, 6, 3, -2, -2, 1, 2, 5, 7, 8];
      break;
    case "Full Base and Treble":
      arr = [4, 3, 0, -4, -3, 1, 4, 6, 7, 6];
      break;
  }
  win.webContents.send("handleGain", arr);
  localStorage.setItem(
    "frequency",
    JSON.stringify({
      mode: value,
      gain: arr
    })
  );
  changeDisplay(arr);
}

function changeDisplay(data) {
  let len = data.length;
  for (let i = 0; i < len; i++) {
    if (i == 0) lowshelf.value = data[0];
    else if (i == len - 1) highshelf.value = data[i];
    else frequencies[i - 1].value = data[i];
    dbgain[i].innerHTML = `${data[i]}dB`;
  }
}

function update() {
  let arr = [];
  for (let i = 0; i < 10; i++) {
    if (i == 0) arr.push(lowshelf.value);
    else if (i == 9) arr.push(highshelf.value);
    else arr.push(frequencies[i - 1].value);
  }
  localStorage.setItem(
    "frequency",
    JSON.stringify({
      mode: current.innerHTML,
      gain: arr
    })
  );
}
for (let i = 0; i < frequencies.length; i++) {
  frequencies[i].addEventListener("input", function(event) {
    dbgain[i + 1].innerHTML = `${event.target.value}dB`;
    win.webContents.send("midband", {
      index: i,
      value: event.target.value
    });
    update();
  });
}

lowshelf.addEventListener("input", function(event) {
  dbgain[0].innerHTML = `${event.target.value}dB`;
  win.webContents.send("lowshelf", event.target.value);
  update();
});

highshelf.addEventListener("input", function(event) {
  dbgain[9].innerHTML = `${event.target.value}dB`;
  win.webContents.send("highshelf", event.target.value);
  update();
});

ipc.on("reset", function(event) {
  resetGain();
  localStorage.setItem("check", false);
  checkbox.checked = false;
});
ipc.on("changeAllowed", function(event) {
  checkbox.checked = false;
});

reset.addEventListener("click", function() {
  resetGain();
  win.webContents.send("reset");
});
checkbox.addEventListener("input", function(event) {
  win.webContents.send("check", event.target.checked);
  localStorage.setItem("check", event.target.checked);
});

function resetGain() {
  changeDisplay([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  let len = options.length;
  for (let i = 0; i < len; i++) {
    options[i].classList.remove("active");
  }
  current.innerHTML = "Default";
  defaultOption.classList.add("active");
  localStorage.setItem(
    "frequency",
    JSON.stringify({
      mode: "Default",
      gain: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    })
  );
}
