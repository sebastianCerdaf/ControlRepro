const { app, BrowserWindow } = require('electron');

const path = require('path');

const remoteMain = require('@electron/remote/main');

remoteMain.initialize();

function createWindow() {

  const win = new BrowserWindow({

    width: 1920,

    height: 1080,

    webPreferences: {

      nodeIntegration: true,

      contextIsolation: false

    }

  });

  remoteMain.enable(win.webContents);

  win.loadFile('presentation/views/LoginView.html');

}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {

  if (process.platform !== 'darwin') app.quit();

});

const { ipcMain, dialog } = require('electron');

const fs = require('fs');

const xlsx = require('xlsx');

ipcMain.handle('seleccionar-carpeta', async () => {

  const result = await dialog.showOpenDialog({

    properties: ['openDirectory']

  });

  if (result.canceled) return null;

  return result.filePaths[0];

});