console.log("yolo");
const { handleNav } = require("./helpers/handleNav");
const electron = require("electron");
const remote = electron.remote;
const ipcRenderer = electron.ipcRenderer;
const win = remote.getCurrentWindow();
const fs = require("fs");
window.handleMinimize = handleNav.handleMinimize;
window.handleMaximize = handleNav.handleMaximize;
window.handleClose = handleNav.handleClose;
window.toggleDevTools = handleNav.toggleDevTools;
window.directory = [];
window.openFile = async () => {
  let obj = "";
  try {
    obj = await ipcRenderer.invoke("openFile");
  } catch (e) {
    throw new Error(e);
  }
  if (!obj.canceled) {
    url = obj.filePaths[0];
    let subtitleUrl = url.replace(/\.mp4|\.mkv/, ".vtt");
    let index = url.lastIndexOf("\\");
    let folder = url.substr(0, index);
    let file = url.substr(index + 1, url.length);
    if (folder === window.directory) {
      window.videoIndex = window.directoryEntry.indexOf(file);
      return url.replace(/\s/g, "%20");
    }
    window.videoIndex = -1;
    window.directory = folder;
    window.directoryEntry = [];
    window.subtitleList = [];
    const event = new Event("folderNotReady");
    window.dispatchEvent(event);
    handleDirectorySubtitles(folder, file);

    return url.replace(/\s/g, "%20");
  } else return "Not selected";
};

window.openDirectory = async () => {
  let obj = "";
  try {
    obj = await ipcRenderer.invoke("openFolder");
  } catch (e) {
    throw new Error(e);
  }
  if (!obj.canceled) {
    window.directoryEntry = await handleDirectorySubtitles(obj.filePaths[0]);
    window.directory = obj.filePaths[0];
    window.videoIndex = 0;
    const event = new Event("readyToPlay");
    window.dispatchEvent(event);
  }
};

const handleDirectorySubtitles = (folder, file) => {
  const list = new Promise((resolve, reject) => {
    fs.readdir(folder, (err, files) => {
      if (err) reject(err);
      resolve(
        files.filter(file => {
          const extension = file.substring(file.lastIndexOf("."), file.length);
          switch (extension) {
            case ".mp4":
            case ".MP4":
            case ".mkv":
            case ".MKV":
            case ".avi":
            case ".AVI":
            case ".OGG":
            case ".ogg":
              return true;
            default:
              return false;
          }
        })
      );
    });
  });
  list
    .then(list => {
      return list;
    })
    .catch(e => {
      return [];
    })

    .then(folderList => {
      window.directoryEntry = folderList;
      if (file) window.videoIndex = window.directoryEntry.indexOf(file);
      const promiseArray = [];
      for (let i = 0; i < folderList.length; i++) {
        const p = new Promise((resolve, reject) => {
          const file = folder + "/" + folderList[i];
          const index = file.lastIndexOf(".");
          const file1 = file.substr(0, index) + ".vtt";

          new Promise((resolve, reject) => {
            fs.stat(file1, (err, stats) => {
              if (!err) {
                resolve(file1);
              } else {
                const file2 = file.substr(0, index) + ".srt";
                new Promise((resolve, reject) => {
                  fs.stat(file2, (err, stats) => {
                    if (err) {
                      resolve("");
                    } else {
                      const p = srtToVtt(file2);
                      p.then(resolve);
                    }
                  });
                }).then(resolve);
              }
            });
          }).then(resolve);
        });
        promiseArray.push(p);
      }
      Promise.all(promiseArray).then(list => {
        window.subtitleList = list;
      });
    });
  if (!file) return list;
};

const srtToVtt = srtfile => {
  const vttfile = srtfile.replace(/\.srt/, ".vtt");
  const fileStart = new Promise((resolve, reject) => {
    fs.writeFile(vttfile, "WEBVTT\n", err => {
      if (err) reject("");
      else {
        resolve(vttfile);
      }
    });
  });

  const readFile = new Promise((resolve, reject) => {
    fs.readFile(srtfile, (err, data) => {
      if (err) reject("");
      else {
        resolve(data.toString());
      }
    });
  });

  return Promise.all([fileStart, readFile])
    .then(data => {
      data[1] = data[1].split("");
      let start = 0;
      while (data[1].indexOf(">", start + 1) >= 0) {
        let index = data[1].indexOf(">", start + 1);
        data[1][index - 7] = ".";
        data[1][index + 10] = ".";
        start = index;
      }
      return [data[0], data[1].join("")];
    })
    .then(
      data =>
        new Promise((resolve, reject) => {
          fs.appendFile(data[0], data[1], err => {
            if (err) reject("");
            else resolve(data[0]);
          });
        })
    )
    .then(
      vttfile =>
        new Promise((resolve, reject) => {
          fs.appendFile(vttfile, "\r\n", err => {
            if (err) reject("");
            else resolve(vttfile);
          });
        })
    )
    .catch(val => {
      return val;
    });
};

window.handleDrop = (url, type) => {
  fs.stat(url, async (err, stats) => {
    if (err) reject("");
    else {
      if (type.match(/video\//)) {
        const index = url.lastIndexOf("\\");
        const folder = url.substr(0, index);
        const file = url.substr(index + 1, url.length);
        if (folder === window.directory) {
          window.videoIndex = window.directoryEntry.indexOf(file);
        }
        window.videoIndex = -1;
        window.directory = folder;
        window.directoryEntry = [];
        window.subtitleList = [];
        handleDirectorySubtitles(folder, file);
      } else if (stats.isDirectory()) {
        window.directoryEntry = await handleDirectorySubtitles(url);
        window.directory = url;
        window.videoIndex = 0;
        const event = new Event("readyToPlay");
        window.dispatchEvent(event);
      }
    }
  });
};
