const { app, BrowserWindow, ipcMain, shell, clipboard, Notification, Tray, Menu } = require('electron');
const path = require('path');
const vault = require('./vault');

let mainWindow = null;
let tray = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#07090e',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    console.log('[Main Process]: SubRadar penceresi ekranda gosterildi.');
  });

  mainWindow.webContents.on('console-message', (event, level, message, line) => {
    console.log(`[Renderer]: ${message}`);
  });

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window:stateChange', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window:stateChange', false);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers: Kasa (Vault) İşlemleri
ipcMain.handle('vault:getAll', async () => {
  return vault.getAll();
});

ipcMain.handle('vault:add', async (event, data) => {
  return vault.add(data);
});

ipcMain.handle('vault:update', async (event, id, data) => {
  return vault.update(id, data);
});

ipcMain.handle('vault:delete', async (event, id) => {
  return vault.delete(id);
});

ipcMain.handle('vault:cancel', async (event, id) => {
  const result = vault.cancel(id);
  if (Notification.isSupported()) {
    new Notification({
      title: 'SubRadar — Abonelik İptal Edildi',
      body: 'Abonelik başarıyla iptal edildi olarak işaretlendi. Tasarruf kaydedildi!'
    }).show();
  }
  return result;
});

ipcMain.handle('vault:resetDemo', async () => {
  return vault.resetDemo();
});

// IPC Handlers: Sistem ve Pencere Kontrolleri
ipcMain.handle('system:openExternal', async (event, url) => {
  if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
    await shell.openExternal(url);
    return true;
  }
  return false;
});

ipcMain.handle('system:copyToClipboard', async (event, text) => {
  clipboard.writeText(text);
  return true;
});

ipcMain.handle('system:notify', async (event, title, body) => {
  if (Notification.isSupported()) {
    new Notification({ title, body }).show();
    return true;
  }
  return false;
});

ipcMain.on('window:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window:maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window:close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window:isMaximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// Uygulama Yaşam Döngüsü
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
