const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('subradar', {
  // Veri Kasası (AES-256 Vault)
  getSubscriptions: () => ipcRenderer.invoke('vault:getAll'),
  addSubscription: (data) => ipcRenderer.invoke('vault:add', data),
  updateSubscription: (id, data) => ipcRenderer.invoke('vault:update', id, data),
  deleteSubscription: (id) => ipcRenderer.invoke('vault:delete', id),
  cancelSubscription: (id) => ipcRenderer.invoke('vault:cancel', id),
  resetDemo: () => ipcRenderer.invoke('vault:resetDemo'),

  // Sistem & Masaüstü Entegrasyonları
  openExternal: (url) => ipcRenderer.invoke('system:openExternal', url),
  copyToClipboard: (text) => ipcRenderer.invoke('system:copyToClipboard', text),
  showNotification: (title, body) => ipcRenderer.invoke('system:notify', title, body),

  // Pencere Kontrolleri (Trafik Işıkları)
  minimizeWindow: () => ipcRenderer.send('window:minimize'),
  maximizeWindow: () => ipcRenderer.send('window:maximize'),
  closeWindow: () => ipcRenderer.send('window:close'),
  isMaximized: () => ipcRenderer.invoke('window:isMaximized'),

  // İkili İletişim Olayları
  onWindowStateChange: (callback) => {
    ipcRenderer.on('window:stateChange', (event, isMax) => callback(isMax));
  }
});
