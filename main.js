const electron = require('electron')
const url = require('url')

process.env.NODE_ENV = 'development';

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600, webPreferences: { nodeIntegration: true }})
  mainWindow.loadURL(url.format({
        pathname: './mainWindow.html',
        protocol: 'file:',
        slashes:true
      }))
  mainWindow.on('closed', function () {
    mainWindow = null
  })
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

const mainMenuTemplate =  [
    {
      label: 'File',
      submenu:[
        {
          label: "Open",
          accelerator:process.platform == 'darwin' ? 'Command+O' : 'Ctrl+O',
          click(){
            mainWindow.webContents.send("open")
          }
        },
        {
          label: "Save",
          accelerator:process.platform == 'darwin' ? 'Command+S' : 'Ctrl+S',
          click(){
            mainWindow.webContents.send("request-save")
          }
        },
        {
          label: "Clear",
          click(){
            mainWindow.webContents.send('clear-editor')
          }
        },
        {
          label: 'Quit',
          accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
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
            mainWindow.webContents.send("attach")
          }
        },

        {
          label: "Execute Local",
          click() {
            mainWindow.webContents.send("exec")
          }
        }
      ]
    }
  ];

if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'Developer Tools',
    submenu:[
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}