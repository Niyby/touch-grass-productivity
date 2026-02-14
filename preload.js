const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Data persistence
  loadData: () => ipcRenderer.invoke('load-data'),
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  
  // Focus points
  getFocusPoints: () => ipcRenderer.invoke('get-focus-points'),
  addFocusPoints: (points) => ipcRenderer.invoke('add-focus-points', points),
  
  // Zen garden
  plantSeed: (seedData) => ipcRenderer.invoke('plant-seed', seedData),
  
  // Authentication
  login: (credentials) => ipcRenderer.invoke('login', credentials),
  logout: () => ipcRenderer.invoke('logout'),
  
  // Character state
  getCharacterState: () => ipcRenderer.invoke('get-character-state'),
  
  // Python backend logs
  onPythonLog: (callback) => ipcRenderer.on('python-log', (event, data) => callback(data))
});