const { ipcRenderer } = require('electron');

window.electronAPI = {
  seleccionarCarpeta: () => ipcRenderer.invoke('seleccionar-carpeta'),
  exportarExcel: (productos, ruta) =>
    ipcRenderer.invoke('guardar-excel', { productos, ruta })
};
