/**
 * SubRadar Desktop — Electron Main Process
 * 
 * Controls application lifecycle, native frameless window, system dialogs,
 * and encrypted local IPC bridge.
 */

const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const SecureVaultStore = require('./src/main/store');
const { generateLegalNotice } = require('./src/main/legal-notice');

let mainWindow = null;
let store = null;

function getStorageDirectory() {
  try {
    return app.getPath('userData');
  } catch (e) {
    return path.join(__dirname, 'data');
  }
}

function createWindow() {
  store = new SecureVaultStore(getStorageDirectory());

  mainWindow = new BrowserWindow({
    width: 1220,
    height: 820,
    minWidth: 980,
    minHeight: 640,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#07090e',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'renderer', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links safely in OS default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// -----------------------------------------------------------------------------
// IPC Handlers
// -----------------------------------------------------------------------------

// Window Controls
ipcMain.handle('window:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
    return mainWindow.isMaximized();
  }
  return false;
});

ipcMain.handle('window:close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window:isMaximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// Vault Management
ipcMain.handle('vault:hasVaultFile', () => {
  return store ? store.hasVaultFile() : false;
});

ipcMain.handle('vault:setup', (_, masterPassword) => {
  if (!store) throw new Error('Store uninitialized');
  const data = store.setupNewVault(masterPassword);
  return { success: true, data };
});

ipcMain.handle('vault:unlock', (_, masterPassword) => {
  if (!store) throw new Error('Store uninitialized');
  try {
    const data = store.unlock(masterPassword);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('vault:lock', () => {
  if (store) store.lock();
  return { success: true };
});

ipcMain.handle('vault:isUnlocked', () => {
  return store ? store.isUnlocked : false;
});

// Subscriptions
ipcMain.handle('subscriptions:list', () => {
  if (!store || !store.isUnlocked) throw new Error('Vault is locked.');
  const data = store.getData();
  return data.subscriptions || [];
});

ipcMain.handle('subscriptions:add', (_, subData) => {
  if (!store || !store.isUnlocked) throw new Error('Vault is locked.');
  const data = store.getData();
  const newSub = {
    ...subData,
    id: 'sub-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString()
  };
  data.subscriptions = data.subscriptions || [];
  data.subscriptions.unshift(newSub);
  store.save(data);
  return newSub;
});

ipcMain.handle('subscriptions:update', (_, id, subData) => {
  if (!store || !store.isUnlocked) throw new Error('Vault is locked.');
  const data = store.getData();
  const idx = (data.subscriptions || []).findIndex(s => s.id === id);
  if (idx === -1) throw new Error('Subscription not found.');

  data.subscriptions[idx] = {
    ...data.subscriptions[idx],
    ...subData,
    updatedAt: new Date().toISOString()
  };
  store.save(data);
  return data.subscriptions[idx];
});

ipcMain.handle('subscriptions:delete', (_, id) => {
  if (!store || !store.isUnlocked) throw new Error('Vault is locked.');
  const data = store.getData();
  data.subscriptions = (data.subscriptions || []).filter(s => s.id !== id);
  store.save(data);
  return { success: true };
});

ipcMain.handle('subscriptions:executeKill', (_, id) => {
  if (!store || !store.isUnlocked) throw new Error('Vault is locked.');
  const data = store.getData();
  const sub = (data.subscriptions || []).find(s => s.id === id);
  if (!sub) throw new Error('Subscription not found.');

  sub.status = 'cancelled';
  sub.cancellationProtocolExecuted = true;
  sub.cancelledAt = new Date().toISOString();
  store.save(data);
  return sub;
});

// Preferences
ipcMain.handle('preferences:get', () => {
  if (!store || !store.isUnlocked) throw new Error('Vault is locked.');
  const data = store.getData();
  return data.userPreferences || {};
});

ipcMain.handle('preferences:update', (_, newPrefs) => {
  if (!store || !store.isUnlocked) throw new Error('Vault is locked.');
  const data = store.getData();
  data.userPreferences = { ...(data.userPreferences || {}), ...newPrefs };
  store.save(data);
  return data.userPreferences;
});

// Legal Notice Generator
ipcMain.handle('legal:generateNotice', (_, subData, userInfo) => {
  return generateLegalNotice({
    serviceName: subData.name,
    planName: subData.plan,
    accountEmail: subData.accountEmail || (userInfo && userInfo.email),
    accountId: subData.accountId,
    price: subData.price,
    currency: subData.currency,
    renewalDate: subData.nextRenewalDate,
    userName: (userInfo && userInfo.name) || 'Kullanıcı',
    language: (userInfo && userInfo.language) || 'tr'
  });
});

// System & Dialogs
ipcMain.handle('system:openExternal', async (_, url) => {
  if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
    await shell.openExternal(url);
    return true;
  }
  return false;
});

ipcMain.handle('system:exportBackup', async () => {
  if (!store || !store.isUnlocked) throw new Error('Vault is locked.');
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'SubRadar Şifreli Yedek Dışa Aktar',
    defaultPath: `subradar-vault-backup-${new Date().toISOString().split('T')[0]}.subradar`,
    filters: [{ name: 'SubRadar Encrypted Vault', extensions: ['subradar'] }]
  });

  if (!canceled && filePath) {
    store.exportBackup(filePath);
    return { success: true, filePath };
  }
  return { success: false };
});

ipcMain.handle('system:importBackup', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'SubRadar Şifreli Yedek İçe Aktar',
    filters: [{ name: 'SubRadar Encrypted Vault', extensions: ['subradar'] }],
    properties: ['openFile']
  });

  if (!canceled && filePaths.length > 0) {
    return { success: true, filePath: filePaths[0] };
  }
  return { success: false };
});

ipcMain.handle('system:getMemoryStats', () => {
  const mem = process.memoryUsage();
  return {
    heapUsedMB: (mem.heapUsed / 1024 / 1024).toFixed(1),
    rssMB: (mem.rss / 1024 / 1024).toFixed(1)
  };
});

// -----------------------------------------------------------------------------
// Lifecycle
// -----------------------------------------------------------------------------

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
