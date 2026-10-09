/**
 * SubRadar Desktop — Secure Context-Isolated Preload Bridge
 * 
 * Exposes zero raw Node.js APIs to renderer.
 * Interacts only through strictly defined IPC channels.
 */

const { contextBridge, ipcRenderer, clipboard } = require('electron');

contextBridge.exposeInMainWorld('subradarAPI', {
  isElectron: true,
  platform: process.platform,

  // Window Controls
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized')
  },

  // Vault Management
  vault: {
    hasVaultFile: () => ipcRenderer.invoke('vault:hasVaultFile'),
    setupVault: (masterPassword) => ipcRenderer.invoke('vault:setup', masterPassword),
    unlock: (masterPassword) => ipcRenderer.invoke('vault:unlock', masterPassword),
    lock: () => ipcRenderer.invoke('vault:lock'),
    isUnlocked: () => ipcRenderer.invoke('vault:isUnlocked')
  },

  // Subscriptions & Data
  subscriptions: {
    list: () => ipcRenderer.invoke('subscriptions:list'),
    add: (subData) => ipcRenderer.invoke('subscriptions:add', subData),
    update: (id, subData) => ipcRenderer.invoke('subscriptions:update', id, subData),
    delete: (id) => ipcRenderer.invoke('subscriptions:delete', id),
    executeKill: (id) => ipcRenderer.invoke('subscriptions:executeKill', id)
  },

  // Preferences & Currency
  preferences: {
    get: () => ipcRenderer.invoke('preferences:get'),
    update: (prefs) => ipcRenderer.invoke('preferences:update', prefs)
  },

  // Cancellation & Legal Notice Generator
  legalNotice: {
    generate: (subData, userInfo) => ipcRenderer.invoke('legal:generateNotice', subData, userInfo)
  },

  // System & Utilities
  system: {
    openExternal: (url) => ipcRenderer.invoke('system:openExternal', url),
    copyToClipboard: (text) => {
      clipboard.writeText(text);
      return true;
    },
    exportBackup: () => ipcRenderer.invoke('system:exportBackup'),
    importBackup: () => ipcRenderer.invoke('system:importBackup'),
    getMemoryStats: () => ipcRenderer.invoke('system:getMemoryStats')
  }
});
