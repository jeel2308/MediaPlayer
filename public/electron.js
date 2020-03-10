const electron = require("electron");
// const path = require("path");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");
const ipcMain = electron.ipcMain;
const dialog = electron.dialog;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    frame: false,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle("openFile", async () => {
  let obj = "";
  try {
    obj = await dialog.showOpenDialog(mainWindow, {
      filters: [
        {
          name: "all",
          extensions: ["3gp", "swi", "m4v", "mp4", "mkv", "avi", "svi", "ogg"]
        }
      ]
    });
  } catch (e) {
    throw new Error(e);
  }
  return obj;
});

ipcMain.handle("openFolder", async () => {
  let obj = "";
  try {
    obj = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"]
    });
  } catch (e) {
    throw new Error(e);
  }
  return obj;
});
