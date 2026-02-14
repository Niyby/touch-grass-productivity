# Productivity & Wellness Desktop App

A beautiful desktop application combining productivity features with wellness tracking, featuring Jake the dog as your companion!

## Features

### Get it Done Mode (Productivity)
- ⏱️ **Stopwatch** - Track your focus time
- ✅ **Tasks** - Manage your to-do list
- 📝 **Notes** - Quick note-taking
- 🔔 **Reminders** - Never forget important things
- 🎯 **Daily Goal** - Set and achieve your main goal
- 📊 **Focus Tracker** - Monitor your productivity with focus points
- 🔊 **Focus Audio** - Background sounds to help you concentrate
- 🎨 **Grayscale Mode** - Minimize distractions

### Take a Chill Pill Mode (Wellness)
- 😊 **Sentiment Analysis** - Track your mood, color preferences, and feelings
- 📈 **Sentiment Tracker** - Visualize your emotional journey
- 🗂️ **Comfort Vault** - Store comforting memories and thoughts
- 🍽️ **Food Habits** - Log your meals
- ✨ **Daily Motivation** - Get inspiring quotes
- 🌿 **Zen Garden** - Plant seeds using focus points earned in work mode
- 🎨 **Color Themes** - Choose between Pink, Ocean Blue, or Calming Green gradients

### Jake the Dog Companion
- 🐶 **Floating Desktop Pet** - Launch Jake to accompany you
- 😊 **Mood Reactions** - Jake reacts based on your productivity (happy when working, disappointed when distracted)
- 🔄 **Live Updates** - Syncs with Python backend for real-time state changes
- 🖱️ **Draggable** - Move Jake anywhere on your screen

## Python Backend Integration

The app includes a Python backend that:
- Tracks which applications you're using (work apps vs distractions)
- Awards/deducts focus points based on your activity
- Updates Jake's emotional state in real-time
- Plays comfort audio when you're struggling
- Saves daily activity logs

## Installation

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8 or higher
- npm

### Setup

1. **Install Node dependencies:**
```bash
cd productivity-wellness-app
npm install
```

2. **Install Python dependencies:**
```bash
pip install pygetwindow pygame
```

3. **Setup audio library (optional):**
Create the following folder structure:
```
python-backend/
  audio_library/
    comfort.mp3          # Comfort audio file
    voice_notes/         # Folder for voice notes
      note1.mp3
      note2.mp3
```

## Running the App

### Development Mode
```bash
npm start
```

This will:
1. Launch the Electron app
2. Automatically start the Python backend
3. Begin tracking your focus

### Python Backend Only (for testing)
```bash
cd python-backend
python main.py
```

## Building for Distribution

### Windows
```bash
npm run build:win
```

### macOS
```bash
npm run build:mac
```

### Linux
```bash
npm run build:linux
```

Built apps will be in the `dist` folder.

## How It Works

### Focus Points System
- **Earn points**: Working on productive apps (+1 every 5 seconds)
- **Lose points**: Using distraction apps (-1 every 5 seconds)
- **Complete daily goal**: +5 points
- **Plant seeds**: Spend 10 points to grow your Zen Garden

### Python Backend Tracking
The Python backend (`focus_tracker.py`) monitors your active window:
- **Work apps**: Chrome, VS Code, Notepad, Word, Docs, Study-related
- **Distractions**: YouTube, Instagram, Reddit, Netflix, Facebook, Twitter

### Jake's Reactions
- **Happy (shimeji_happy.png)**: When you're working productively
- **Disappointed (shimeji_disappointed.png)**: When you're distracted
- **Excited (shimeji_excited.png)**: Special achievements
- **Chill (shimeji_chill.png)**: Default relaxed state
- **Work (shimeji_work.png)**: When you're in focus mode

## File Structure
```
productivity-wellness-app/
├── main.js                 # Electron main process
├── preload.js             # Secure IPC bridge
├── index.html             # UI structure
├── styles.css             # All styles and themes
├── app.js                 # Frontend logic
├── package.json           # Node dependencies
├── assets/                # Images
│   ├── shimeji_chill.png
│   ├── shimeji_work.png
│   ├── shimeji_disappointed.png
│   ├── shimeji_excited.png
│   └── shimeji_happy.png
└── python-backend/        # Python focus tracker
    ├── main.py           # Entry point
    ├── focus_tracker.py  # Window tracking
    ├── utils.py          # Helper functions
    ├── daily_reset.py    # Daily note reset
    ├── character_state.txt # Jake's current state
    └── audio_library/    # Audio files
```

## Data Storage

App data is stored locally in:
- **Windows**: `%APPDATA%/productivity-wellness-app/app-data.json`
- **macOS**: `~/Library/Application Support/productivity-wellness-app/app-data.json`
- **Linux**: `~/.config/productivity-wellness-app/app-data.json`

Data includes:
- Tasks, notes, reminders
- Daily goals
- Sentiment entries
- Food logs
- Focus points
- Zen garden seeds
- User settings

## Customization

### Adding Custom Work Apps
Edit `python-backend/focus_tracker.py`:
```python
work_apps = ["chrome", "code", "your-custom-app"]
```

### Adding Custom Distractions
```python
distractions = ["youtube", "your-distraction"]
```

### Changing Focus Point Values
In `focus_tracker.py`, adjust:
```python
points += 1  # Change reward amount
points -= 1  # Change penalty amount
```

### Adding Custom Themes
In `styles.css`, add a new theme:
```css
.your-theme {
    background: linear-gradient(135deg, #color1 0%, #color2 100%);
}
```

Then update the settings in `app.js`.

## Troubleshooting

### Python backend not starting
- Make sure Python is in your PATH
- Check that all Python dependencies are installed
- Review logs in the Electron console (enable with `npm run dev`)

### Jake not updating
- Ensure `character_state.txt` is being created in `python-backend/`
- Check that the Python backend is running
- Verify the IPC communication in the console

### Focus points not saving
- Check the data file location
- Ensure the app has write permissions
- Try deleting the data file to reset (backs up first!)

## Future Enhancements
- [ ] Cloud sync with authentication backend
- [ ] Pomodoro timer integration
- [ ] Detailed analytics dashboard
- [ ] More Jake animations
- [ ] Custom audio upload
- [ ] Weekly/monthly reports
- [ ] Habit tracking
- [ ] Calendar integration

## License
MIT

## Credits
- Jake the Dog character sprites from Adventure Time fan art
- Motivational quotes curated for mental wellness
- Built with Electron, Python, and love ❤️