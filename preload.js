const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  executeCommand: (command) => ipcRenderer.invoke('execute-command', command),
  loadHistory: () => ipcRenderer.invoke('load-history'),
  saveHistory: (history) => ipcRenderer.invoke('save-history', history),
  clearHistory: () => ipcRenderer.invoke('clear-history'),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content)
});
