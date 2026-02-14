// App State
let appData = {
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
        colorMode: 'pink',
        audioEnabled: true
    }
};

// Stopwatch state
let stopwatchRunning = false;
let stopwatchTime = 0;
let stopwatchInterval = null;

// Jake state
let jakeState = 'chill';
let jakeUpdateInterval = null;

// Motivational quotes
const motivationalQuotes = [
    "You're stronger than you think! 🌟",
    "Every small step counts! 💪",
    "Believe in yourself! ✨",
    "You've got this! 🚀",
    "Progress, not perfection! 🌱",
    "You're doing amazing! 🌈",
    "Keep going, you're almost there! 🎯",
    "Your effort matters! 💫",
    "One day at a time! 🌸",
    "You're capable of great things! 🦋"
];

// Initialize app
async function initApp() {
    // Load data
    const data = await window.electronAPI.loadData();
    appData = { ...appData, ...data };
    
    // Update UI
    updateFocusPoints();
    
    // Check if user is logged in
    if (appData.user) {
        showProfileButton();
    }
    
    // Apply saved theme
    if (appData.settings.colorMode) {
        applyTheme(appData.settings.colorMode);
    }
    
    // Load daily goal
    if (appData.dailyGoal) {
        document.getElementById('daily-goal-text').value = appData.dailyGoal;
        document.getElementById('daily-goal-check').checked = appData.dailyGoalCompleted;
    }
    
    // Render existing data
    renderTasks();
    renderNotes();
    renderReminders();
    
    console.log('App initialized');
}

// Save data
async function saveData() {
    await window.electronAPI.saveData(appData);
}

// ===== MODE SELECTION =====
function selectMode(mode) {
    document.getElementById('mode-selection').classList.remove('active');
    
    if (mode === 'work') {
        document.getElementById('work-mode').classList.add('active');
        appData.currentMode = 'work';
    } else {
        document.getElementById('chill-mode').classList.add('active');
        appData.currentMode = 'chill';
    }
    
    saveData();
}

function backToSelection() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById('mode-selection').classList.add('active');
    appData.currentMode = 'selection';
    saveData();
}

// ===== WORK MODE FEATURES =====

// Grayscale toggle
function toggleGrayscale() {
    document.body.classList.toggle('grayscale');
}

// Stopwatch
function toggleStopwatch() {
    if (stopwatchRunning) {
        stopStopwatch();
    } else {
        startStopwatch();
    }
}

function startStopwatch() {
    stopwatchRunning = true;
    document.getElementById('stopwatch-start').textContent = '⏸';
    
    const startTime = Date.now() - stopwatchTime;
    stopwatchInterval = setInterval(() => {
        stopwatchTime = Date.now() - startTime;
        updateStopwatchDisplay();
    }, 10);
}

function stopStopwatch() {
    stopwatchRunning = false;
    document.getElementById('stopwatch-start').textContent = '▶';
    clearInterval(stopwatchInterval);
}

function resetStopwatch() {
    stopStopwatch();
    stopwatchTime = 0;
    updateStopwatchDisplay();
}

function updateStopwatchDisplay() {
    const hours = Math.floor(stopwatchTime / 3600000);
    const minutes = Math.floor((stopwatchTime % 3600000) / 60000);
    const seconds = Math.floor((stopwatchTime % 60000) / 1000);
    
    const display = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    document.getElementById('stopwatch-display').textContent = display;
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

// Tasks
function addTask() {
    const taskText = prompt('Enter task:');
    if (taskText && taskText.trim()) {
        const task = {
            id: Date.now(),
            text: taskText.trim(),
            completed: false,
            createdAt: new Date().toISOString()
        };
        appData.tasks.push(task);
        renderTasks();
        saveData();
    }
}

function renderTasks() {
    const container = document.getElementById('tasks-content');
    if (appData.tasks.length === 0) {
        container.innerHTML = '<p class="empty-state">No tasks</p>';
        return;
    }
    
    container.innerHTML = appData.tasks.map(task => `
        <div class="task-item" style="display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #ecf0f1;">
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <span style="${task.completed ? 'text-decoration: line-through; color: #95a5a6;' : ''}">${task.text}</span>
            <button onclick="deleteTask(${task.id})" style="margin-left: auto; background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">×</button>
        </div>
    `).join('');
}

function toggleTask(id) {
    const task = appData.tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        saveData();
    }
}

function deleteTask(id) {
    appData.tasks = appData.tasks.filter(t => t.id !== id);
    renderTasks();
    saveData();
}

// Notes
function addNote() {
    const noteText = prompt('Enter note:');
    if (noteText && noteText.trim()) {
        const note = {
            id: Date.now(),
            text: noteText.trim(),
            createdAt: new Date().toISOString()
        };
        appData.notes.push(note);
        renderNotes();
        saveData();
    }
}

function renderNotes() {
    const container = document.getElementById('notes-content');
    if (appData.notes.length === 0) {
        container.innerHTML = '<p class="empty-state">No notes</p>';
        return;
    }
    
    container.innerHTML = appData.notes.map(note => `
        <div class="note-item" style="padding: 10px; border-bottom: 1px solid #ecf0f1; display: flex; justify-content: space-between;">
            <span>${note.text}</span>
            <button onclick="deleteNote(${note.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">×</button>
        </div>
    `).join('');
}

function deleteNote(id) {
    appData.notes = appData.notes.filter(n => n.id !== id);
    renderNotes();
    saveData();
}

// Reminders
function addReminder() {
    const reminderText = prompt('Enter reminder:');
    if (reminderText && reminderText.trim()) {
        const reminder = {
            id: Date.now(),
            text: reminderText.trim(),
            createdAt: new Date().toISOString()
        };
        appData.reminders.push(reminder);
        renderReminders();
        saveData();
    }
}

function renderReminders() {
    const container = document.getElementById('reminders-content');
    if (appData.reminders.length === 0) {
        container.innerHTML = '<p class="empty-state">No reminders</p>';
        return;
    }
    
    container.innerHTML = appData.reminders.map(reminder => `
        <div class="reminder-item" style="padding: 10px; border-bottom: 1px solid #ecf0f1; display: flex; justify-content: space-between;">
            <span>${reminder.text}</span>
            <button onclick="deleteReminder(${reminder.id})" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">×</button>
        </div>
    `).join('');
}

function deleteReminder(id) {
    appData.reminders = appData.reminders.filter(r => r.id !== id);
    renderReminders();
    saveData();
}

// Daily Goal
document.addEventListener('DOMContentLoaded', () => {
    const goalText = document.getElementById('daily-goal-text');
    const goalCheck = document.getElementById('daily-goal-check');
    
    if (goalText) {
        goalText.addEventListener('change', () => {
            appData.dailyGoal = goalText.value;
            saveData();
        });
    }
    
    if (goalCheck) {
        goalCheck.addEventListener('change', () => {
            appData.dailyGoalCompleted = goalCheck.checked;
            saveData();
            
            if (goalCheck.checked) {
                // Reward focus points for completing daily goal
                window.electronAPI.addFocusPoints(5).then(points => {
                    appData.focusPoints = points;
                    updateFocusPoints();
                    showNotification('Great job! +5 focus points!');
                });
            }
        });
    }
});

// Focus Points
async function updateFocusPoints() {
    const points = await window.electronAPI.getFocusPoints();
    appData.focusPoints = points;
    document.getElementById('focus-points').textContent = points;
    
    const zenPoints = document.getElementById('zen-focus-points');
    if (zenPoints) {
        zenPoints.textContent = points;
    }
}

// ===== CHILL MODE FEATURES =====

// Sentiment Analysis
function switchSentimentTab(tab) {
    // Update tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update content
    document.querySelectorAll('.sentiment-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(`${tab}-tab`).classList.remove('hidden');
}

// Comfort Vault
function addComfortItem() {
    const item = prompt('Add something comforting (text, memory, or note):');
    if (item && item.trim()) {
        appData.comfortVault.push({
            id: Date.now(),
            text: item.trim(),
            createdAt: new Date().toISOString()
        });
        saveData();
        showNotification('Added to comfort vault! 💜');
    }
}

// Food Habits
function addMeal() {
    const meal = prompt('What did you eat?');
    if (meal && meal.trim()) {
        appData.foodEntries.push({
            id: Date.now(),
            meal: meal.trim(),
            time: new Date().toISOString()
        });
        saveData();
        showNotification('Meal logged! 🍽️');
    }
}

// Motivation
function getNewQuote() {
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    document.getElementById('motivation-quote').textContent = `"${quote}"`;
}

// Settings
function openSettings() {
    document.getElementById('settings-modal').classList.add('active');
    
    // Highlight current theme
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === appData.settings.colorMode) {
            btn.classList.add('active');
        }
    });
}

function closeSettings() {
    document.getElementById('settings-modal').classList.remove('active');
}

function changeTheme(theme) {
    appData.settings.colorMode = theme;
    applyTheme(theme);
    saveData();
    
    // Update active button
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === theme) {
            btn.classList.add('active');
        }
    });
}

function applyTheme(theme) {
    const chillMode = document.getElementById('chill-mode');
    chillMode.classList.remove('ocean-theme', 'forest-theme');
    
    if (theme === 'ocean') {
        chillMode.classList.add('ocean-theme');
    } else if (theme === 'forest') {
        chillMode.classList.add('forest-theme');
    }
}

// Zen Garden
function enterZenGarden() {
    document.getElementById('zen-garden-modal').classList.add('active');
    updateFocusPoints();
    renderZenGarden();
}

function closeZenGarden() {
    document.getElementById('zen-garden-modal').classList.remove('active');
}

async function plantSeed() {
    const result = await window.electronAPI.plantSeed({
        type: 'tree',
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20
    });
    
    if (result.success) {
        appData.focusPoints = result.points;
        updateFocusPoints();
        renderZenGarden();
        showNotification('Seed planted! 🌱');
    } else {
        showNotification('Not enough focus points! Need 10 points.');
    }
}

function renderZenGarden() {
    const data = appData.zenGarden || { seeds: [] };
    const container = document.getElementById('zen-garden-area');
    
    if (data.seeds.length === 0) {
        container.innerHTML = '<div class="empty-garden">Your zen garden is empty. Plant your first seed!</div>';
        return;
    }
    
    container.innerHTML = '';
    data.seeds.forEach(seed => {
        const seedEl = document.createElement('div');
        seedEl.className = 'seed';
        seedEl.textContent = '🌱';
        seedEl.style.left = `${seed.x}%`;
        seedEl.style.top = `${seed.y}%`;
        container.appendChild(seedEl);
    });
}

// ===== JAKE CHARACTER =====
let jakeFloating = false;
let jakeDragOffset = { x: 0, y: 0 };

function launchJake() {
    const jakeEl = document.getElementById('jake-character');
    jakeEl.classList.remove('hidden');
    jakeFloating = true;
    
    // Start updating Jake's state from Python backend
    startJakeUpdates();
    
    // Make Jake draggable
    const jakeImg = document.getElementById('jake-img');
    jakeImg.addEventListener('mousedown', startJakeDrag);
}

function startJakeDrag(e) {
    const jakeEl = document.getElementById('jake-character');
    const rect = jakeEl.getBoundingClientRect();
    jakeDragOffset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
    
    document.addEventListener('mousemove', dragJake);
    document.addEventListener('mouseup', stopJakeDrag);
}

function dragJake(e) {
    const jakeEl = document.getElementById('jake-character');
    jakeEl.style.left = `${e.clientX - jakeDragOffset.x}px`;
    jakeEl.style.top = `${e.clientY - jakeDragOffset.y}px`;
    jakeEl.style.bottom = 'auto';
    jakeEl.style.right = 'auto';
}

function stopJakeDrag() {
    document.removeEventListener('mousemove', dragJake);
    document.removeEventListener('mouseup', stopJakeDrag);
}

async function startJakeUpdates() {
    if (jakeUpdateInterval) return;
    
    jakeUpdateInterval = setInterval(async () => {
        const state = await window.electronAPI.getCharacterState();
        updateJakeCharacter(state);
    }, 1000);
}

function updateJakeCharacter(state) {
    const jakeImg = document.getElementById('jake-img');
    const jakeStatus = document.getElementById('jake-status');
    
    const stateMap = {
        'happy': { img: 'assets/shimeji_happy.png', status: 'PROUD OF U', color: '#2ecc71' },
        'sad': { img: 'assets/shimeji_disappointed.png', status: 'STOP SLACKING', color: '#e74c3c' },
        'excited': { img: 'assets/shimeji_excited.png', status: 'EXCITED!', color: '#f39c12' },
        'work': { img: 'assets/shimeji_work.png', status: 'FOCUS', color: '#e74c3c' },
        'chill': { img: 'assets/shimeji_chill.png', status: 'CHILLIN', color: '#3498db' },
        'idle': { img: 'assets/shimeji_chill.png', status: 'CHILLIN', color: '#3498db' }
    };
    
    const stateInfo = stateMap[state] || stateMap['idle'];
    jakeImg.src = stateInfo.img;
    jakeStatus.textContent = stateInfo.status;
    jakeStatus.style.color = stateInfo.color;
}

// ===== PROFILE =====
function showProfileButton() {
    const btn = document.getElementById('profile-btn');
    btn.classList.remove('hidden');
    
    if (appData.user && appData.user.name) {
        document.getElementById('profile-initial').textContent = appData.user.name[0].toUpperCase();
    }
}

function openProfile() {
    document.getElementById('profile-modal').classList.add('active');
    renderProfile();
}

function closeProfile() {
    document.getElementById('profile-modal').classList.remove('active');
}

function renderProfile() {
    const container = document.getElementById('profile-content');
    
    if (!appData.user) {
        container.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <p>Not logged in</p>
                <button onclick="showLogin()" style="margin-top: 20px; padding: 10px 20px; background: var(--primary-dark); color: white; border: none; border-radius: 8px; cursor: pointer;">Log In</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div style="padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 80px; height: 80px; background: var(--primary-dark); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 15px;">
                    ${appData.user.name[0].toUpperCase()}
                </div>
                <h3>${appData.user.name}</h3>
                <p style="color: #7f8c8d;">${appData.user.email}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <strong>Focus Points:</strong> ${appData.focusPoints}
            </div>
            
            <div style="margin-bottom: 20px;">
                <strong>Tasks Completed:</strong> ${appData.tasks.filter(t => t.completed).length}
            </div>
            
            <div style="margin-bottom: 20px;">
                <strong>Member Since:</strong> ${new Date(appData.user.createdAt).toLocaleDateString()}
            </div>
            
            <button onclick="logout()" style="width: 100%; padding: 12px; background: #e74c3c; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                Log Out
            </button>
        </div>
    `;
}

async function logout() {
    await window.electronAPI.logout();
    appData.user = null;
    document.getElementById('profile-btn').classList.add('hidden');
    closeProfile();
}

// Notification helper
function showNotification(message) {
    // Simple alert for now, can be enhanced with custom notification UI
    console.log('Notification:', message);
    // Could create a toast notification here
}

// Initialize on load
window.addEventListener('DOMContentLoaded', initApp);