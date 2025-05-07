const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    backgroundColor: '#2e2e2e',
    show: false,            // la ocultamos hasta que esté lista
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  // Ajusta aquí la URL correcta
  win.loadURL('http://localhost:5173');  // o 'http://localhost:3000' para CRA

  // Solo mostrar cuando React haya cargado
  win.once('ready-to-show', () => {
    win.show();
    // Para ver la consola de Chromium
     win.webContents.openDevTools();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => app.quit());
