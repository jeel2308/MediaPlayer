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
window.openFile = async (directory, directoryList) => {
  let obj = "";
  try {
    obj = await ipcRenderer.invoke("openFile");
  } catch (e) {
    throw new Error(e);
  }
  if (!obj.canceled) {
    url = obj.filePaths[0];
    const index = url.lastIndexOf("\\");
    const folder = url.substr(0, index);
    const file = url.substr(index + 1, url.length);
    if (folder === directory) {
      const index = directoryList.indexOf(file);
      return { url, index };
    }
    handleDirectorySubtitles(folder, file);

    return { url, index: -1 };
  } else return { url: "Not selected" };
};

window.openDirectory = async directory => {
  let obj = "";
  try {
    obj = await ipcRenderer.invoke("openFolder");
  } catch (e) {
    throw new Error(e);
  }
  if (!obj.canceled) {
    if (directory !== obj.filePaths[0]) {
      handleDirectorySubtitles(obj.filePaths[0]);
    }
  }
};

const handleDirectorySubtitles = (folder, file) => {
  const list = new Promise((resolve, reject) => {
    fs.readdir(folder, (err, files) => {
      if (err) reject([]);
      resolve(files);
    });
  });
  const videoFileList = list.then(fileList => {
    const videoFileList = fileList.filter(file => {
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
    });
    if (!file) {
      const event = new CustomEvent("readyToPlay", {
        detail: {
          fileList: videoFileList,
          index: 0,
          directory: folder,
          started: false
        }
      });
      window.dispatchEvent(event);
    } else {
      const event = new CustomEvent("readyToPlay", {
        detail: {
          fileList: videoFileList,
          index: videoFileList.indexOf(file),
          directory: folder,
          started: true
        }
      });
      window.dispatchEvent(event);
    }

    const subtitleList = videoFileList.map(file => {
      const index = file.lastIndexOf(".");
      const file1 = file.substr(0, index) + ".vtt";
      const fileIndex = fileList.indexOf(file1);
      if (fileIndex !== -1) {
        return new Promise((resolve, reject) => {
          resolve(file1);
        });
      } else {
        const file1 = file.substr(0, index) + ".srt";
        const fileIndex = fileList.indexOf(file1);

        if (fileIndex === -1) {
          return new Promise((resolve, reject) => {
            resolve("");
          });
        } else {
          return new Promise((resolve, reject) => {
            const p = srtToVtt(file1, folder);
            p.then(resolve);
          });
        }
      }
    });
    Promise.all(subtitleList).then(subtitleList => {
      const event = new CustomEvent("subtitlesReady", { detail: subtitleList });
      window.dispatchEvent(event);
    });
    //   const thumbnails = videoFileList.map(file => {
    //     const index = file.lastIndexOf(".");
    //     const file2 = folder + "/" + file.substr(0, index) + ".png";
    //     const file1 = folder + "/" + file;
    //     return genThumbnail(file1, file2, "150x100");
    //   });
    //   Promise.all(thumbnails)
    //     .then(() => {
    //       console.log("done");
    //     })
    //     .catch(console.log);
  });
};
// const handleDirectorySubtitles = (folder, file) => {
//   const list = new Promise((resolve, reject) => {
//     fs.readdir(folder, (err, files) => {
//       if (err) reject(err);
//       resolve(
//         files.filter(file => {
//           const extension = file.substring(file.lastIndexOf("."), file.length);
//           switch (extension) {
//             case ".mp4":
//             case ".MP4":
//             case ".mkv":
//             case ".MKV":
//             case ".avi":
//             case ".AVI":
//             case ".OGG":
//             case ".ogg":
//               return true;
//             default:
//               return false;
//           }
//         })
//       );
//     });
//   });

//   list
//     .then(list => {
//       return list;
//     })
//     .catch(e => {
//       return [];
//     })

//     .then(fileList => {
//       // window.directoryEntry = fileList;
//       if (file) {
//         // window.videoIndex = window.directoryEntry.indexOf(file);
//         const event = new CustomEvent("readyToPlay", {
//           detail: {
//             fileList,
//             index: fileList.indexOf(file),
//             started: true,
//             directory: folder
//           }
//         });
//         window.dispatchEvent(event);
//       }
//       const promiseArray = [];
//       for (let i = 0; i < fileList.length; i++) {
//         const file = folder + "/" + fileList[i];
//         const index = file.lastIndexOf(".");
//         const file1 = file.substr(0, index) + ".vtt";
//         const p = new Promise((resolve, reject) => {
//           fs.stat(file1, (err, stats) => {
//             if (!err) {
//               resolve(file1);
//             } else {
//               const file2 = file.substr(0, index) + ".srt";
//               new Promise((resolve, reject) => {
//                 fs.stat(file2, (err, stats) => {
//                   if (err) {
//                     resolve("");
//                   } else {
//                     const p = srtToVtt(file2);
//                     p.then(resolve);
//                   }
//                 });
//               }).then(resolve);
//             }
//           });
//         });
//         promiseArray.push(p);
//       }
//       Promise.all(promiseArray).then(list => {
//         // window.subtitleList = list;
//         const event = new CustomEvent("subtitlesReady", { detail: list });
//         window.dispatchEvent(event);
//       });
//     });
//   if (!file) return list;
// };

const srtToVtt = (srtfile, folder) => {
  const vttfile = folder + "/" + srtfile.replace(/\.srt/, ".vtt");
  const fileStart = new Promise((resolve, reject) => {
    fs.writeFile(vttfile, "WEBVTT\n", err => {
      if (err) reject("");
      else {
        resolve(vttfile);
      }
    });
  });

  const readFile = new Promise((resolve, reject) => {
    fs.readFile(folder + "/" + srtfile, (err, data) => {
      if (err) reject("");
      else {
        resolve(data.toString());
      }
    });
  });

  return (
    Promise.all([fileStart, readFile])
      .then(data => {
        data[1] = data[1].split("");
        let start = 0;
        while (data[1].indexOf(">", start + 1) >= 0) {
          let index = data[1].indexOf(">", start + 1);
          data[1][index - 7] = ".";
          data[1][index + 10] = ".";
          start = index;
        }
        data[1] = data[1].join("");
        return new Promise((resolve, reject) => {
          fs.appendFile(data[0], data[1], err => {
            if (err) reject("");
            else {
              resolve(data[0]);
            }
          });
        });
      })
      // .then(
      //   data =>
      //     new Promise((resolve, reject) => {
      //       fs.appendFile(data[0], data[1], err => {
      //         if (err) reject("");
      //         else resolve(data[0]);
      //       });
      //     })
      // )
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
      })
  );
};

window.handleDrop = (url, type, fileList, directory) => {
  fs.stat(url, async (err, stats) => {
    if (err) return;
    else {
      if (type.match(/video\//)) {
        const index = url.lastIndexOf("\\");
        const folder = url.substr(0, index);
        const file = url.substr(index + 1, url.length);
        if (folder === directory) {
          const index = fileList.indexOf(file);
          const event = new CustomEvent("handleDrop", { detail: index });
          window.dispatchEvent(event);
          return;
        }
        // window.videoIndex = -1;
        // window.directory = folder;
        // window.directoryEntry = [];
        // window.subtitleList = [];
        handleDirectorySubtitles(folder, file);
      } else if (stats.isDirectory()) {
        if (directory === url) return;
        // window.directoryEntry = await handleDirectorySubtitles(url);
        handleDirectorySubtitles(url);
        // window.directory = url;
        // window.videoIndex = 0;
      }
    }
  });
};
