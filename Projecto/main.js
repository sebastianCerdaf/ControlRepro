const { app, BrowserWindow } = require('electron');
const path = require('path');

// === Activar @electron/remote ===
const remoteMain = require('@electron/remote/main');
remoteMain.initialize();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Habilita el acceso a Electron desde el renderer (para dialog, fs, path, etc.)
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

ipcMain.handle('guardar-excel', async (event, { productos, ruta }) => {
  try {
    if (!fs.existsSync(ruta)) {
      console.error('La ruta no existe:', ruta);
      return 'error';
    }

    const productosPlano = productos.map(p => ({
      id: p.id,
      nombre: p.nombre,
      categoria: p.categoria,
      precioCaja30: p.precioCaja30,
      stock: p.stock,
      stockMinimo: p.stockMinimo,
      proveedores: Array.isArray(p.proveedores)
        ? p.proveedores.map(pr => `${pr.nombre} (${pr.leadTime} días)`).join(', ')
        : ''
    }));

    const xlsx = require('xlsx');
    const ws = xlsx.utils.json_to_sheet(productosPlano);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Productos');

    const nombreArchivo = path.join(ruta, 'productos_exportados.xlsx');
    xlsx.writeFile(wb, nombreArchivo);

    return 'ok';
  } catch (err) {
    console.error('Error al exportar:', err);
    return 'error';
  }
});

