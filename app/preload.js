/**
 * SubRadar Desktop — Secure Context-Isolated Preload Bridge
 * 
 * Exposes zero raw Node.js APIs to renderer.
 * Strictly mediated through IPC channels.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('subradarAPI', {
  isElectron: true,

  // Window Controls
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized')
  },

  // Vault Security
  vault: {
    hasVault: () => ipcRenderer.invoke('vault:hasVault'),
    setup: (masterPassword, initialData) => ipcRenderer.invoke('vault:setup', masterPassword, initialData),
    unlock: (masterPassword) => ipcRenderer.invoke('vault:unlock', masterPassword),
    lock: () => ipcRenderer.invoke('vault:lock'),
    changePassword: (oldPassword, newPassword) => ipcRenderer.invoke('vault:changePassword', oldPassword, newPassword),
    factoryReset: () => ipcRenderer.invoke('vault:factoryReset')
  },

  // Subscriptions CRUD
  subscriptions: {
    getAll: () => ipcRenderer.invoke('subs:getAll'),
    create: (subData) => ipcRenderer.invoke('subs:create', subData),
    update: (id, patch) => ipcRenderer.invoke('subs:update', id, patch),
    delete: (id) => ipcRenderer.invoke('subs:delete', id),
    killSwitch: (id) => ipcRenderer.invoke('subs:killSwitch', id)
  },

  // User Preferences
  preferences: {
    get: () => ipcRenderer.invoke('prefs:get'),
    update: (patch) => ipcRenderer.invoke('prefs:update', patch)
  },

  // Statement & Extrait Parser (100% Local)
  statement: {
    parse: (rawContent, defaultCurrency) => ipcRenderer.invoke('statement:parse', rawContent, defaultCurrency)
  },

  // Legal Notice
  legalNotice: {
    generateNotice: (subData, userInfo, language) => ipcRenderer.invoke('legal:generateNotice', subData, userInfo, language)
  },

  // System & Utilities
  system: {
    openExternal: (url) => ipcRenderer.invoke('system:openExternal', url),
    copyToClipboard: (text) => ipcRenderer.invoke('system:copyToClipboard', text),
    exportBackup: () => ipcRenderer.invoke('system:exportBackup'),
    importBackup: (masterPassword) => ipcRenderer.invoke('system:importBackup', masterPassword),
    getMemoryStats: () => ipcRenderer.invoke('system:getMemoryStats')
  }
});
