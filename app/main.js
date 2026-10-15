/**
 * SubRadar Desktop — Electron Main Process
 * 
 * Controls application lifecycle, native frameless window, system dialogs,
 * and encrypted local IPC bridge.
 */

const { app, BrowserWindow, ipcMain, shell, dialog, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');
const SecureVaultStore = require('./src/main/store');
const { generateLegalNotice } = require('./src/main/legal-notice');
const { parseStatement } = require('./src/main/statement-parser');

let mainWindow = null;
let store = null;

function createWindow() {
  const userDataPath = app.getPath('userData');
  store = new SecureVaultStore(userDataPath);

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 1040,
    minHeight: 680,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#07090e',
    show: false,
    center: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      spellcheck: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'renderer', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Open external links safely in OS default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:') || url.startsWith('http:') || url.startsWith('mailto:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// -------------------------------------------------------------------------
// IPC Handlers: Window Controls
// -------------------------------------------------------------------------
ipcMain.handle('window:minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.handle('window:maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
      return false;
    } else {
      mainWindow.maximize();
      return true;
    }
  }
  return false;
});

ipcMain.handle('window:close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.handle('window:isMaximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

// -------------------------------------------------------------------------
// IPC Handlers: Vault Security & Cryptography
// -------------------------------------------------------------------------
ipcMain.handle('vault:hasVault', () => {
  return store ? store.hasVaultFile() : false;
});

ipcMain.handle('vault:setup', (_, masterPassword, initialData) => {
  try {
    const data = store.setupNewVault(masterPassword, initialData);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('vault:unlock', (_, masterPassword) => {
  try {
    const data = store.unlockVault(masterPassword);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('vault:lock', () => {
  if (store) store.lockVault();
  return { success: true };
});

ipcMain.handle('vault:changePassword', (_, oldPassword, newPassword) => {
  try {
    store.changePassword(oldPassword, newPassword);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('vault:factoryReset', () => {
  try {
    if (store) store.factoryReset();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// -------------------------------------------------------------------------
// IPC Handlers: Subscriptions CRUD
// -------------------------------------------------------------------------
ipcMain.handle('subs:getAll', () => {
  if (!store || !store.isUnlocked) throw new Error('Vault is locked.');
  return store.cachedData.subscriptions || [];
});

ipcMain.handle('subs:create', (_, subData) => {
  if (!store || !store.isUnlocked) throw new Error('Vault is locked.');
  const newSub = {
    ...subData,
    id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    cancellationProtocolExecuted: false
  };
  store.cachedData.subscriptions = store.cachedData.subscriptions || [];
  store.cachedData.subscriptions.unshift(newSub);
  store.saveVault();
  return newSub;
});

ipcMain.handle('subs:update', (_, id, patch) => {
  if (!store || !store.isUnlocked) throw new Error('Vault is locked.');
  const list = store.cachedData.subscriptions || [];
  const idx = list.findIndex(s => s.id === id);
  if (idx === -1) throw new Error('Subscription not found.');

  list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
  store.saveVault();
  return list[idx];
});

ipcMain.handle('subs:delete', (_, id) => {
  if (!store || !store.isUnlocked) throw new Error('Vault is locked.');
  const list = store.cachedData.subscriptions || [];
  store.cachedData.subscriptions = list.filter(s => s.id !== id);
  store.saveVault();
  return { success: true };
});

ipcMain.handle('subs:killSwitch', (_, id) => {
  if (!store || !store.isUnlocked) throw new Error('Vault is locked.');
  const list = store.cachedData.subscriptions || [];
  const target = list.find(s => s.id === id);
  if (!target) throw new Error('Subscription not found.');

  target.status = 'cancelled';
  target.cancellationProtocolExecuted = true;
  target.cancelledAt = new Date().toISOString();
  store.saveVault();
  return target;
});

// -------------------------------------------------------------------------
// IPC Handlers: Preferences & Bank Statement Scanner
// -------------------------------------------------------------------------
ipcMain.handle('prefs:get', () => {
  if (!store || !store.isUnlocked) throw new Error('Vault is locked.');
  return store.cachedData.userPreferences || {};
});

ipcMain.handle('prefs:update', (_, patch) => {
  if (!store || !store.isUnlocked) throw new Error('Vault is locked.');
  store.cachedData.userPreferences = {
    ...store.cachedData.userPreferences,
    ...patch
  };
  store.saveVault();
  return store.cachedData.userPreferences;
});

ipcMain.handle('statement:parse', (_, rawContent, defaultCurrency) => {
  return parseStatement(rawContent, defaultCurrency);
});

ipcMain.handle('legal:generateNotice', (_, subData, userInfo, language) => {
  return generateLegalNotice(subData, userInfo, language);
});

// -------------------------------------------------------------------------
// IPC Handlers: System Utilities & Encrypted Backups
// -------------------------------------------------------------------------
ipcMain.handle('system:copyToClipboard', (_, text) => {
  if (clipboard) {
    clipboard.writeText(text || '');
    return true;
  }
  return false;
});

ipcMain.handle('system:openExternal', async (_, url) => {
  if (url && (url.startsWith('https://') || url.startsWith('http://') || url.startsWith('mailto:'))) {
    await shell.openExternal(url);
    return true;
  }
  return false;
});

ipcMain.handle('system:exportBackup', async () => {
  if (!store || !store.isUnlocked) throw new Error('Vault is locked.');
  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'SubRadar Şifreli Kasa Yedeği Dışa Aktar',
    defaultPath: `subradar-vault-backup-${new Date().toISOString().split('T')[0]}.subradar`,
    filters: [{ name: 'SubRadar Encrypted Vault', extensions: ['subradar'] }]
  });

  if (!canceled && filePath) {
    store.exportBackup(filePath);
    return { success: true, filePath };
  }
  return { success: false };
});

ipcMain.handle('system:importBackup', async (_, masterPassword) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'SubRadar Şifreli Kasa Yedeği İçe Aktar',
    filters: [{ name: 'SubRadar Encrypted Vault', extensions: ['subradar'] }],
    properties: ['openFile']
  });

  if (!canceled && filePaths && filePaths.length > 0) {
    try {
      const data = store.importBackup(filePaths[0], masterPassword);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
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

// -------------------------------------------------------------------------
// App Lifecycle
// -------------------------------------------------------------------------
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
