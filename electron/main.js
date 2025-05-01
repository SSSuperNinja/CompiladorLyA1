const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: true, // para fetch ok
      contextIsolation: false
    }
  });
  // en desarrollo:
  win.loadURL('http://localhost:5173');  
  // para producción, tras build: 
  // win.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
