/*jshint esversion: 6 */

const electron = require("electron");
const url = require("url");
const WebSocket = require("ws");

process.env.NODE_ENV = "development";

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600, webPreferences: { nodeIntegration: true, webSecurity: false }});
  mainWindow.loadURL(url.format({
        pathname: "./mainWindow.html",
        protocol: "file:",
        slashes:true
      }));
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});


const mainMenuTemplate =  [
  {
    label: "File",
    submenu:[
      {
        label: "Open",
        accelerator:process.platform == "darwin" ? "Command+O" : "Ctrl+O",
        click(){
          mainWindow.webContents.send("open");
        }
      },
      {
        label: "Save",
        accelerator:process.platform == "darwin" ? "Command+S" : "Ctrl+S",
        click(){
          mainWindow.webContents.send("request-save");
        }
      },
      {
        label: "Clear",
        click(){
          mainWindow.webContents.send("clear-editor");
        }
      },
      {
        label: "Quit",
        accelerator:process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click(){
          app.quit();
        }
      }
    ]
  },
  {
    label: "Execution",
    submenu: [
      {
        label: "Attach",
        click() {
          const attach_ws = new WebSocket("ws://localhost:24892/attach");
          attach_ws.on("open", function() {
            console.log("opened");
            attach_ws.send("ATTACH");
          });
          attach_ws.on("message", function incoming(data) {
            console.log("data received, "  + data);
            if (data == "READY") {
              mainWindow.webContents.send("set-doc-title","Attached");
            } else if (data == "ALREADY_ATTACHED") {
              mainWindow.webContents.send("set-doc-title","Already attached!");
              setTimeout(function() {
                mainWindow.webContents.send("set-doc-title","Attached");
              }, 3000);
            } else if(data == "INTERRUPT") {
              mainWindow.webContents.send("set-doc-title","Failed to attach");
              setTimeout(function() {
                mainWindow.webContents.send("set-doc-title","Not attached");
              }, 3000);
            } else if (data == "FAILED_TO_FIND") {
              mainWindow.webContents.send("set-doc-title","Failed to find");
              setTimeout(function() {
                mainWindow.webContents.send("set-doc-title","Not attached");
              }, 3000);
            }
          });
        }
      },

      {
        label: "Execute Local",
        click() {
          mainWindow.webContents.send("send-script");
        }
      }
    ]
  },
  {
    label: "Options",
    submenu: [
      {
        label: "TopMost",
        type: "checkbox",
        checked: true
      },
      {
        label: "Unlock FPS",
        type: "checkbox",
        checked: false
      },
      {
        label: "Auto Attach",
        type: "checkbox",
        checked: false
      },
      {
        label: "Internal UI",
        type: "checkbox",
        checked: false
      },
      {
        label: "Beta Release",
        type: "checkbox",
        checked: false
      },
      {
        label: "In Game Chat",
        type: "checkbox",
        checked: false
      }        
    ]
  }
];

ipcMain.on("script", function(e,scr) {
  var execute_ws = new WebSocket("ws://localhost:24892/execute")
  execute_ws.on("open", function() {
    execute_ws.send(scr);
    setTimeout(function() {
      execute_ws = null;
    },5000);
  });
});

if(process.env.NODE_ENV !== "production"){
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu:[
      {
        role: "reload"
      },
      {
        label: "Toggle DevTools",
        accelerator:process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}