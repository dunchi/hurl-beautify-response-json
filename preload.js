const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  executeCommand: (command) => ipcRenderer.invoke('execute-command', command),
  getCurrentDirectory: () => ipcRenderer.invoke('get-current-directory'),
  loadHistory: () => ipcRenderer.invoke('load-history'),
  saveHistory: (history) => ipcRenderer.invoke('save-history', history),
  clearHistory: () => ipcRenderer.invoke('clear-history'),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('write-file', filePath, content),
  createFile: (filePath) => ipcRenderer.invoke('create-file', filePath),
  createFileWithPassword: (filePath, password) => ipcRenderer.invoke('create-file-with-password', filePath, password)
});
