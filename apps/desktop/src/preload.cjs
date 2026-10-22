const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('computerDesktop', Object.freeze({
  platform: process.platform,
}));
