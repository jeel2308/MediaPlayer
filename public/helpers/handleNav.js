const electron = require("electron").remote;
const app = electron.app;
const win = electron.getCurrentWindow();

const handleMinimize = () => {
  win.minimize();
};

const handleMaximize = () => {
  if (win.isMaximized()) win.unmaximize();
  else win.maximize();
};

const handleClose = () => {
  app.exit(0);
  win.close();
  win = null;
};

const toggleDevTools = () => {
  win.webContents.toggleDevTools();
};

module.exports.handleNav = {
  handleMinimize,
  handleMaximize,
  handleClose,
  toggleDevTools
};
