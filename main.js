const electron = require("electron");
const app = electron.app;

const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const ipc = electron.ipcMain;
const url = require("url");
const Menu = electron.Menu;
const dialog = electron.dialog;

let win;

let template = [
  {
    label: "open",
    click: function() {
      dialog.showOpenDialog(
        {
          filters: [
            {
              name: "all",
              extensions: [
                "3gp",
                "swi",
                "m4v",
                "mp4",
                "mkv",
                "avi",
                "svi",
                "ogg"
              ]
            }
          ]
        },
        function(filename) {
          if (filename !== undefined) {
            win.webContents.send("video-selected", filename[0]);
          }
        }
      );
    }
  },
  {
    label: "choose subtitle",
    click: function() {
      dialog.showOpenDialog(function(filename) {
        if (filename !== undefined) {
          win.webContents.send("subtitle-selected", filename[0]);
        }
      });
    }
  },
  {
    label: "choose folder",
    click: function() {
      dialog.showOpenDialog({ properties: ["openDirectory"] }, function(
        foldername
      ) {
        if (foldername !== undefined) {
          win.webContents.send("folder-selected", foldername[0]);
        }
      });
    }
  },
  {
    label: "Dev tools",
    click: function() {
      win.webContents.toggleDevTools();
    }
  },
  {
    label: "Aspect Ratio",
    submenu: [
      {
        label: "16:9",
        click: function() {
          win.webContents.send("ratio-selected", 16 / 9);
        }
      },
      {
        type: "separator"
      },
      {
        label: "5:4",
        click: function() {
          win.webContents.send("ratio-selected", 5 / 4);
        }
      },
      {
        type: "separator"
      },
      {
        label: "16:10",
        click: function() {
          win.webContents.send("ratio-selected", 16 / 10);
        }
      },
      {
        type: "separator"
      },
      {
        label: "4:3",
        click: function() {
          win.webContents.send("ratio-selected", 4 / 3);
        }
      },
      {
        type: "separator"
      },
      {
        label: "18:9",
        click: function() {
          win.webContents.send("ratio-selected", 2);
        }
      },
      {
        type: "separator"
      },
      {
        label: "default",
        click: function() {
          win.webContents.send("ratio-selected", "default");
        }
      }
    ]
  },
  {
    label: "subtitle Sync",
    click: function() {
      win.webContents.send("showForm");
    }
  }
  // {
  //   label: "equilizer",
  //   click: function() {
  //     win.webContents.send("show");
  //   }
  // }
];

let menu = Menu.buildFromTemplate(template);
function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: false
    }
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "App", "index.html"),
      protocol: "file",
      slashes: true
    })
  );
  win.on("close", () => {
    win = null;
  });

  win.on("maximize", function(event) {
    win.webContents.send("change", 1);
    //Menu.setApplicationMenu(null);
    //win.setMenuBarVisibility(false);
    //win.setSize(pk.width, pk.height + 100);
  });
  win.on("unmaximize", function(event) {
    win.webContents.send("change", 0);
    // Menu.setApplicationMenu(menu);
    // win.setMenuBarVisibility(true);
  });
}
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required"); //for play video as soon as it loaded.

app.on("ready", function() {
  createWindow();

  Menu.setApplicationMenu(menu);
});

ipc.on("current-progress", function(event, progress) {
  if (progress !== null) {
    progress = progress.toPrecision(2);
    win.setProgressBar(Number(progress));
  }
});

ipc.on("dimension", function(event, dimension) {
  //console.log(dimension.width, dimension.height);
  win.setSize(dimension.width, dimension.height);
  if (dimension.args === 2) {
    win.webContents.send("dimensionApplied", {
      width: dimension.width,
      height: dimension.height - 50
    });
  }
});

ipc.on("save", function(event) {
  dialog.showSaveDialog(win, function() {
    win.webContents.send("saved");
  });
});

//ipc.send internally converts data into json.so NaN will become null. serialization = stringify
