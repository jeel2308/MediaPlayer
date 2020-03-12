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
    handleDirectorySubtitles(folder, file);
    // const p = new Promise((resolve, reject) => {
    //   fs.stat(subtitleUrl, (err, stats) => {
    //     if (err) reject("File Not Found");
    //     else resolve(subtitleUrl);
    //   });
    // });

    // try {
    //   subtitleUrl = await p;
    //   window.subtitle = subtitleUrl.replace(/\s/g, "%20");
    // } catch (e) {
    //   window.subtitle = "";
    // }

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
    return obj.filePaths[0];
  } else return "not selected";
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
const handleDirectory = async folder => {};

const srtToVtt = srtfile => {
  let vttfile = srtfile.replace(/\.srt/, ".vtt");
  const p = new Promise((resolve, reject) => {
    fs.writeFile(vttfile, "WEBVTT\n", err => {
      if (err) resolve("");
      else {
        new Promise((resolve, reject) => {
          fs.readFile(srtfile, (err, data) => {
            if (err) resolve("");
            else {
              data = data.toString().split("");
              let start = 0;
              while (data.indexOf(">", start + 1) >= 0) {
                let index = data.indexOf(">", start + 1);
                data[index - 7] = ".";
                data[index + 10] = ".";
                start = index;
              }
              data = data.join("");
              fs.appendFile(vttfile, data, err => {
                if (err) console.log(err);
              });
              fs.appendFile(vttfile, "\r\n", err => {
                if (err) console.log(err);
              });
              resolve(vttfile);
            }
          });
        }).then(resolve);
      }
    });
  });
  return p;
};

//   });
//   let text = fs.readFileSync(srtfile, { encoding: "utf8" });
//   text = text.split("");

//   fs.appendFileSync(vttfile, text);
//   fs.appendFileSync(vttfile, "\r\n");
//   return vttfile;
// }

window.handleDrop = async (url, type) => {
  const p = new Promise((resolve, reject) => {
    fs.stat(url, async (err, stats) => {
      if (err) resolve("");
      else {
        if (type.match(/video\//)) {
          const index = url.lastIndexOf("\\");
          const folder = url.substr(0, index);
          const file = url.substr(index + 1, url.length);
          if (folder === window.directory) {
            window.videoIndex = window.directoryEntry.indexOf(file);
            resolve("");
          }
          window.videoIndex = -1;
          window.directory = folder;
          window.directoryEntry = [];
          window.subtitleList = [];
          handleDirectorySubtitles(folder, file);
          resolve("");
        } else if (stats.isDirectory()) {
          console.log("it is a directory");
          window.directoryEntry = await handleDirectorySubtitles(url);
          window.directory = url;
          window.videoIndex = 0;
          resolve(url);
        }
      }
    });
  });
  return p;
};
