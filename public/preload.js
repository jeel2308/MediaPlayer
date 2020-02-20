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
    let index = url.lastIndexOf("\\");
    let folder = url.substr(0, index);
    let file = url.substr(index + 1, url.length);
    window.videoIndex = -1;
    window.directory = folder;
    window.directoryEntry = [];
    handleDirectory(folder).then(folderList => {
      window.directoryEntry = folderList;
      window.videoIndex = window.directoryEntry.indexOf(file);
    });
    return url.replace(/\s/g, "%20");
  } else return "Not selected";
};

const handleDirectory = async folder => {
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
  let fileList = [];
  try {
    fileList = await list;
  } catch (e) {
    throw new Error(e);
  }
  return fileList;
};
