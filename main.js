const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

let mainWindow;
let pythonProcess = null;

// Data storage path
const userDataPath = app.getPath('userData');
const dataFilePath = path.join(userDataPath, 'app-data.json');

// Initialize default data structure
const defaultData = {
  user: null,
  currentMode: 'selection',
  tasks: [],
  notes: [],
  reminders: [],
  dailyGoal: '',
  dailyGoalCompleted: false,
  sentimentEntries: [],
  foodEntries: [],
  focusPoints: 0,
  focusTracking: [],
  comfortVault: [],
  zenGarden: {
    seeds: [],
    plantedTrees: []
  },
  settings: {
    colorMode: 'pink', // pink, ocean, forest
    audioEnabled: true
  }
};

// Read data from file
function loadData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  return { ...defaultData };
}

// Save data to file
function saveData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
}

// Start Python backend
function startPythonBackend() {
  const pythonPath = path.join(__dirname, 'python-backend', 'main.py');
  
  try {
    pythonProcess = spawn('python', [pythonPath], {
      cwd: path.join(__dirname, 'python-backend')
    });

    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python: ${data}`);
      // Send focus updates to renderer
      if (mainWindow) {
        mainWindow.webContents.send('python-log', data.toString());
      }
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
    });

    console.log('Python backend started');
  } catch (error) {
    console.error('Failed to start Python backend:', error);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    frame: true,
    backgroundColor: '#f5f5f5',
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  mainWindow.loadFile('index.html');

  // Open DevTools in development
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  startPythonBackend();
});

app.on('window-all-closed', () => {
  // Kill Python process
  if (pythonProcess) {
    pythonProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
});

// IPC Handlers for data persistence
ipcMain.handle('load-data', () => {
  return loadData();
});

ipcMain.handle('save-data', (event, data) => {
  return saveData(data);
});

ipcMain.handle('get-focus-points', () => {
  const data = loadData();
  return data.focusPoints || 0;
});

ipcMain.handle('add-focus-points', (event, points) => {
  const data = loadData();
  data.focusPoints = (data.focusPoints || 0) + points;
  saveData(data);
  return data.focusPoints;
});

ipcMain.handle('plant-seed', (event, seedData) => {
  const data = loadData();
  const cost = 10; // 10 focus points per seed
  
  if ((data.focusPoints || 0) >= cost) {
    data.focusPoints -= cost;
    data.zenGarden.seeds.push({
      id: Date.now(),
      ...seedData,
      plantedAt: new Date().toISOString(),
      growth: 0
    });
    saveData(data);
    return { success: true, points: data.focusPoints };
  }
  return { success: false, message: 'Not enough focus points' };
});

ipcMain.handle('login', async (event, credentials) => {
  // TODO: Implement actual authentication with backend API
  // For now, simulate successful login
  const data = loadData();
  data.user = {
    id: 'user_' + Date.now(),
    email: credentials.email,
    name: credentials.name || credentials.email.split('@')[0],
    createdAt: new Date().toISOString()
  };
  saveData(data);
  return {
    success: true,
    user: data.user
  };
});

ipcMain.handle('logout', () => {
  const data = loadData();
  data.user = null;
  saveData(data);
  return { success: true };
});

// Character state tracking (reads from Python backend)
ipcMain.handle('get-character-state', () => {
  const statePath = path.join(__dirname, 'python-backend', 'character_state.txt');
  try {
    if (fs.existsSync(statePath)) {
      return fs.readFileSync(statePath, 'utf8').trim();
    }
  } catch (error) {
    console.error('Error reading character state:', error);
  }
  return 'idle';
});