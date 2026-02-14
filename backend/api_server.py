"""
Flask API Server for Touchgrass App
Connects React frontend with Python focus tracker
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow React app to connect from localhost:3000

# File paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR,"..", "app_data.json")
STATE_FILE = os.path.join(BASE_DIR,"..", "character_state.txt")
ASSETS_DIR = os.path.join(BASE_DIR,"..", "assets")

# Initialize data file if it doesn't exist
def init_data():
    if not os.path.exists(DATA_FILE):
        default_data = {
            "user": None,
            "current_mode": "selection",
            "tasks": [],
            "notes": [],
            "reminders": [],
            "daily_goal": "",
            "daily_goal_completed": False,
            "sentiment_entries": [],
            "food_entries": [],
            "focus_points": 0,
            "comfort_vault": [],
            "focus_history": []
        }
        with open(DATA_FILE, 'w') as f:
            json.dump(default_data, f, indent=2)
        print(f"✓ Created {DATA_FILE}")

init_data()

# ============= API ENDPOINTS =============

@app.route('/api/status', methods=['GET'])
def get_status():
    """Get current character state and focus points"""
    try:
        # Read character state
        character_state = "idle"
        if os.path.exists(STATE_FILE):
            with open(STATE_FILE, 'r') as f:
                character_state = f.read().strip()
        
        # Read app data
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
        
        return jsonify({
            "character_state": character_state,
            "focus_points": data.get("focus_points", 0),
            "current_mode": data.get("current_mode", "selection")
        })
    except Exception as e:
        print(f"Error in get_status: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/data', methods=['GET'])
def get_data():
    """Get all app data"""
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        print(f"Error in get_data: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/data', methods=['POST'])
def save_data():
    """Save app data"""
    try:
        data = request.json
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        return jsonify({"success": True})
    except Exception as e:
        print(f"Error in save_data: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/mode', methods=['POST'])
def set_mode():
    """Set current mode (work/destress/selection)"""
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
        
        mode = request.json.get('mode', 'selection')
        data['current_mode'] = mode
        
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        
        return jsonify({"success": True, "mode": mode})
    except Exception as e:
        print(f"Error in set_mode: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all tasks"""
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
        return jsonify(data.get('tasks', []))
    except Exception as e:
        print(f"Error in get_tasks: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
def add_task():
    """Add a new task"""
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
        
        task_text = request.json.get('text', '')
        if not task_text:
            return jsonify({"error": "Task text required"}), 400
        
        task = {
            'id': len(data['tasks']),
            'text': task_text,
            'completed': False,
            'created_at': datetime.now().isoformat()
        }
        data['tasks'].append(task)
        
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"✓ Added task: {task_text}")
        return jsonify(task)
    except Exception as e:
        print(f"Error in add_task: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['PATCH'])
def toggle_task(task_id):
    """Toggle task completion and award/deduct points"""
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
        
        task_found = False
        for task in data['tasks']:
            if task['id'] == task_id:
                task['completed'] = not task.get('completed', False)
                task_found = True
                
                # Award/deduct points
                if task['completed']:
                    data['focus_points'] = data.get('focus_points', 0) + 10
                    print(f"✓ Task completed! +10 points (now at {data['focus_points']})")
                else:
                    data['focus_points'] = data.get('focus_points', 0) - 10
                    print(f"⊘ Task unchecked. -10 points (now at {data['focus_points']})")
                break
        
        if not task_found:
            return jsonify({"error": "Task not found"}), 404
        
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        
        return jsonify({"success": True, "focus_points": data['focus_points']})
    except Exception as e:
        print(f"Error in toggle_task: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task"""
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
        
        data['tasks'] = [t for t in data['tasks'] if t['id'] != task_id]
        
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"✓ Deleted task {task_id}")
        return jsonify({"success": True})
    except Exception as e:
        print(f"Error in delete_task: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/sentiment', methods=['POST'])
def add_sentiment():
    """Add sentiment entry and award points"""
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
        
        entry = request.json
        entry['id'] = str(datetime.now().timestamp())
        entry['date'] = datetime.now().isoformat()
        
        data['sentiment_entries'].insert(0, entry)  # Add to beginning
        data['focus_points'] = data.get('focus_points', 0) + 15
        
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"✓ Sentiment logged! +15 points (now at {data['focus_points']})")
        return jsonify({"success": True, "points_earned": 15})
    except Exception as e:
        print(f"Error in add_sentiment: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/food', methods=['POST'])
def add_food():
    """Add food entry and award points"""
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
        
        entry = request.json
        entry['id'] = str(datetime.now().timestamp())
        entry['date'] = datetime.now().isoformat()
        
        data['food_entries'].insert(0, entry)
        data['focus_points'] = data.get('focus_points', 0) + 5
        
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"✓ Meal logged! +5 points (now at {data['focus_points']})")
        return jsonify({"success": True, "points_earned": 5})
    except Exception as e:
        print(f"Error in add_food: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/comfort', methods=['POST'])
def add_comfort():
    """Add comfort vault item and award points"""
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
        
        entry = request.json
        entry['id'] = str(datetime.now().timestamp())
        entry['createdAt'] = datetime.now().isoformat()
        
        data['comfort_vault'].insert(0, entry)
        data['focus_points'] = data.get('focus_points', 0) + 5
        
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"✓ Comfort item added! +5 points (now at {data['focus_points']})")
        return jsonify({"success": True, "points_earned": 5})
    except Exception as e:
        print(f"Error in add_comfort: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/points', methods=['POST'])
def update_points():
    """Manually update focus points"""
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
        
        change = request.json.get('change', 0)
        data['focus_points'] = data.get('focus_points', 0) + change
        
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"Points updated: {change:+d} (now at {data['focus_points']})")
        return jsonify({"focus_points": data['focus_points']})
    except Exception as e:
        print(f"Error in update_points: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/goal', methods=['POST'])
def set_goal():
    """Set daily goal"""
    try:
        with open(DATA_FILE, 'r') as f:
            data = json.load(f)
        
        goal = request.json.get('goal', '')
        completed = request.json.get('completed', False)
        
        data['daily_goal'] = goal
        data['daily_goal_completed'] = completed
        
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
        
        return jsonify({"success": True})
    except Exception as e:
        print(f"Error in set_goal: {e}")
        return jsonify({"error": str(e)}), 500

# Serve static assets (character images)
@app.route('/assets/<path:filename>')
def serve_asset(filename):
    """Serve character images and other assets"""
    return send_from_directory(ASSETS_DIR, filename)

@app.route('/')
def index():
    return jsonify({
        "name": "Touchgrass API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": [
            "GET /api/status - Get character state and points",
            "GET /api/data - Get all app data",
            "POST /api/data - Save all app data",
            "POST /api/mode - Set current mode",
            "GET /api/tasks - Get all tasks",
            "POST /api/tasks - Add a task",
            "PATCH /api/tasks/<id> - Toggle task completion",
            "DELETE /api/tasks/<id> - Delete a task",
            "POST /api/sentiment - Add sentiment entry",
            "POST /api/food - Add food entry",
            "POST /api/comfort - Add comfort item",
            "POST /api/points - Update focus points",
            "POST /api/goal - Set daily goal"
        ]
    })

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 Touchgrass API Server Starting...")
    print("=" * 50)
    print(f"📁 Data file: {DATA_FILE}")
    print(f"📄 State file: {STATE_FILE}")
    print(f"🖼️  Assets dir: {ASSETS_DIR}")
    print("=" * 50)
    print("🌐 Server running at: http://localhost:5000")
    print("🎨 React app should run at: http://localhost:3000")
    print("📊 Make sure focus_tracker.py is running!")
    print("=" * 50)
    
    app.run(debug=True, port=5000, host='0.0.0.0')
