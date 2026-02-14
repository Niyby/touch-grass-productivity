"""
Enhanced Productivity & Wellness Desktop App
Combines the Shimeji character with full productivity/wellness features
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
from PIL import Image, ImageTk
import json
import os
from datetime import datetime
import threading
import time

class ProductivityWellnessApp:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Productivity & Wellness")
        self.root.geometry("1400x900")
        self.root.configure(bg="#f5f5f5")
        
        # Data storage
        self.data_file = "app_data.json"
        self.load_data()
        
        # Current mode
        self.current_mode = self.data.get('current_mode', 'selection')
        
        # Theme colors
        self.colors = {
            'work': {
                'primary': '#2c3e50',
                'secondary': '#34495e',
                'accent': '#3498db',
                'bg': '#ecf0f1',
                'text': '#2c3e50'
            },
            'chill': {
                'primary': '#ec4899',
                'secondary': '#a855f7',
                'accent': '#f472b6',
                'bg': '#fce7f3',
                'text': '#831843'
            }
        }
        
        # Show mode selection or main app
        if self.current_mode == 'selection':
            self.show_mode_selection()
        else:
            self.show_main_app()
        
        # Start focus tracker thread
        self.start_focus_tracker()
        
        self.root.mainloop()
    
    def load_data(self):
        """Load all app data from JSON file"""
        default_data = {
            'user': None,
            'current_mode': 'selection',
            'tasks': [],
            'notes': [],
            'reminders': [],
            'daily_goal': '',
            'daily_goal_completed': False,
            'sentiment_entries': [],
            'food_entries': [],
            'focus_points': 0,
            'focus_history': [],
            'comfort_vault': [],
            'character_state': 'idle'
        }
        
        if os.path.exists(self.data_file):
            try:
                with open(self.data_file, 'r') as f:
                    self.data = json.load(f)
                # Merge with defaults to add any new fields
                for key, value in default_data.items():
                    if key not in self.data:
                        self.data[key] = value
            except:
                self.data = default_data
        else:
            self.data = default_data
    
    def save_data(self):
        """Save all app data to JSON file"""
        try:
            with open(self.data_file, 'w') as f:
                json.dump(self.data, f, indent=2)
        except Exception as e:
            print(f"Error saving data: {e}")
    
    def show_mode_selection(self):
        """Display the mode selection screen"""
        # Clear window
        for widget in self.root.winfo_children():
            widget.destroy()
        
        self.root.configure(bg="#e8e8e8")
        
        # Container
        container = tk.Frame(self.root, bg="#e8e8e8")
        container.place(relx=0.5, rely=0.5, anchor="center")
        
        # Title
        title = tk.Label(container, text="Which mode are you feeling today?",
                        font=("Arial", 24, "bold"), bg="#e8e8e8", fg="#1e293b")
        title.pack(pady=(0, 40))
        
        # Buttons frame
        buttons_frame = tk.Frame(container, bg="#e8e8e8")
        buttons_frame.pack()
        
        # Get it Done button
        work_btn = tk.Button(buttons_frame, text="Get it Done",
                            font=("Arial", 16, "bold"), bg="#2c3e50", fg="white",
                            padx=40, pady=20, relief="flat", cursor="hand2",
                            command=lambda: self.set_mode('work'))
        work_btn.grid(row=0, column=0, padx=20)
        
        # Take a chill pill button
        chill_btn = tk.Button(buttons_frame, text="Take a chill pill",
                             font=("Arial", 16, "bold"),
                             bg="#ec4899", fg="white",
                             padx=40, pady=20, relief="flat", cursor="hand2",
                             command=lambda: self.set_mode('chill'))
        chill_btn.grid(row=0, column=1, padx=20)
        
        # Jake icon and launcher (if you have the character)
        jake_frame = tk.Frame(container, bg="#e8e8e8")
        jake_frame.pack(pady=(40, 0))
        
        try:
            # Try to load Jake image
            jake_img = Image.open("assets/shimeji_happy.png")
            jake_img = jake_img.resize((80, 80), Image.Resampling.LANCZOS)
            jake_photo = ImageTk.PhotoImage(jake_img)
            jake_label = tk.Label(jake_frame, image=jake_photo, bg="#e8e8e8", cursor="hand2")
            jake_label.image = jake_photo  # Keep reference
            jake_label.pack()
            jake_label.bind("<Button-1>", lambda e: self.launch_jake())
        except:
            pass
        
        jake_text = tk.Label(jake_frame, text="Launch Jcon?",
                           font=("Arial", 10), bg="#e8e8e8", fg="#64748b")
        jake_text.pack()
    
    def set_mode(self, mode):
        """Set the app mode (work/chill) and show main interface"""
        self.current_mode = mode
        self.data['current_mode'] = mode
        self.save_data()
        self.show_main_app()
    
    def show_main_app(self):
        """Display the main application interface"""
        # Clear window
        for widget in self.root.winfo_children():
            widget.destroy()
        
        mode = self.current_mode
        theme = self.colors['work'] if mode == 'work' else self.colors['chill']
        
        # Configure root background
        self.root.configure(bg=theme['bg'])
        
        # Header
        self.create_header(theme)
        
        # Main content area with scrolling
        main_container = tk.Frame(self.root, bg=theme['bg'])
        main_container.pack(fill="both", expand=True, padx=20, pady=10)
        
        # Canvas for scrolling
        canvas = tk.Canvas(main_container, bg=theme['bg'], highlightthickness=0)
        scrollbar = ttk.Scrollbar(main_container, orient="vertical", command=canvas.yview)
        scrollable_frame = tk.Frame(canvas, bg=theme['bg'])
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        # Add widgets based on mode
        if mode == 'work':
            self.create_work_mode_widgets(scrollable_frame, theme)
        else:
            self.create_chill_mode_widgets(scrollable_frame, theme)
        
        # Bind mouse wheel scrolling
        canvas.bind_all("<MouseWheel>", lambda e: canvas.yview_scroll(int(-1*(e.delta/120)), "units"))
    
    def create_header(self, theme):
        """Create the header with title and mode switch"""
        header = tk.Frame(self.root, bg=theme['primary'], height=60)
        header.pack(fill="x")
        header.pack_propagate(False)
        
        # Title
        mode_text = "Get it Done Mode" if self.current_mode == 'work' else "Take a Chill Pill Mode"
        title = tk.Label(header, text=mode_text, font=("Arial", 20, "bold"),
                        bg=theme['primary'], fg="white")
        title.pack(side="left", padx=20)
        
        # Negative Reward Display (Points System)
        points_frame = tk.Frame(header, bg=theme['primary'])
        points_frame.pack(side="left", padx=20)
        
        points = self.data.get('focus_points', 0)
        points_color = "#2ecc71" if points >= 0 else "#e74c3c"
        
        tk.Label(points_frame, text="Focus Points:", font=("Arial", 10),
                bg=theme['primary'], fg="white").pack(side="left")
        self.points_label = tk.Label(points_frame, text=str(points), font=("Arial", 16, "bold"),
                                    bg=theme['primary'], fg=points_color)
        self.points_label.pack(side="left", padx=5)
        
        # Warning if negative
        if points <= -10:
            tk.Label(points_frame, text="⚠️ FOCUS UP!", font=("Arial", 10, "bold"),
                    bg=theme['primary'], fg="#f1c40f").pack(side="left", padx=10)
        
        # Right side buttons
        buttons_frame = tk.Frame(header, bg=theme['primary'])
        buttons_frame.pack(side="right", padx=20)
        
        # Grayscale/Mode toggle
        if self.current_mode == 'work':
            toggle_text = "Grayscale Mode"
        else:
            toggle_text = "Switch Mode"
        
        toggle_btn = tk.Button(buttons_frame, text=toggle_text, font=("Arial", 10),
                              bg=theme['secondary'], fg="white", relief="flat",
                              padx=15, pady=5, cursor="hand2",
                              command=self.toggle_grayscale)
        toggle_btn.pack(side="left", padx=5)
        
        # Close/Exit
        close_btn = tk.Button(buttons_frame, text="✕", font=("Arial", 14, "bold"),
                             bg=theme['secondary'], fg="white", relief="flat",
                             width=3, cursor="hand2",
                             command=self.exit_to_selection)
        close_btn.pack(side="left", padx=5)
    
    def create_work_mode_widgets(self, parent, theme):
        """Create widgets for Get it Done mode"""
        # Row 1: Reminders, Stopwatch, Focus Audio
        row1 = tk.Frame(parent, bg=theme['bg'])
        row1.pack(fill="x", pady=10)
        
        # Reminders Card
        self.create_card(row1, "🔔 Reminders", theme, width=450).pack(side="left", padx=10, fill="both", expand=True)
        
        # Stopwatch Card
        stopwatch_card = self.create_card(row1, "⏱️ Stopwatch", theme, width=450)
        stopwatch_card.pack(side="left", padx=10, fill="both", expand=True)
        self.create_stopwatch(stopwatch_card, theme)
        
        # Focus Audio Card
        audio_card = self.create_card(row1, "🔊 Focus Audio", theme, width=450)
        audio_card.pack(side="left", padx=10, fill="both", expand=True)
        self.create_focus_audio(audio_card, theme)
        
        # Row 2: Notes and Tasks
        row2 = tk.Frame(parent, bg=theme['bg'])
        row2.pack(fill="x", pady=10)
        
        # Notes Card
        notes_card = self.create_card(row2, "📝 Notes Folder", theme)
        notes_card.pack(side="left", padx=10, fill="both", expand=True)
        self.create_notes_section(notes_card, theme)
        
        # Tasks Card
        tasks_card = self.create_card(row2, "✓ Tasks", theme)
        tasks_card.pack(side="left", padx=10, fill="both", expand=True)
        self.create_tasks_section(tasks_card, theme)
        
        # Row 3: Daily Goal
        row3 = tk.Frame(parent, bg=theme['bg'])
        row3.pack(fill="x", pady=10, padx=10)
        
        self.create_daily_goal(row3, theme)
        
        # Row 4: Focus Tracker
        row4 = tk.Frame(parent, bg=theme['bg'])
        row4.pack(fill="x", pady=10, padx=10)
        
        self.create_focus_tracker(row4, theme)
    
    def create_chill_mode_widgets(self, parent, theme):
        """Create widgets for Take a Chill Pill mode"""
        # Row 1: Comfort Vault and Sentiment Analysis
        row1 = tk.Frame(parent, bg=theme['bg'])
        row1.pack(fill="x", pady=10)
        
        # Comfort Vault
        vault_card = self.create_card(row1, "🎵 Comfort Vault", theme)
        vault_card.pack(side="left", padx=10, fill="both", expand=True)
        self.create_comfort_vault(vault_card, theme)
        
        # Sentiment Analysis
        sentiment_card = self.create_card(row1, "Sentiment Analysis", theme)
        sentiment_card.pack(side="left", padx=10, fill="both", expand=True)
        self.create_sentiment_analysis(sentiment_card, theme)
        
        # Row 2: Sentiment Tracker and Food Habits
        row2 = tk.Frame(parent, bg=theme['bg'])
        row2.pack(fill="x", pady=10)
        
        # Sentiment Tracker
        tracker_card = self.create_card(row2, "📈 Sentiment Tracker", theme)
        tracker_card.pack(side="left", padx=10, fill="both", expand=True)
        self.create_sentiment_tracker(tracker_card, theme)
        
        # Food Habits
        food_card = self.create_card(row2, "🍴 Food Habits", theme)
        food_card.pack(side="left", padx=10, fill="both", expand=True)
        self.create_food_habits(food_card, theme)
        
        # Row 3: Daily Motivation
        row3 = tk.Frame(parent, bg=theme['bg'])
        row3.pack(fill="x", pady=10, padx=10)
        
        self.create_daily_motivation(row3, theme)
        
        # Row 4: Zen Garden Button
        row4 = tk.Frame(parent, bg=theme['bg'])
        row4.pack(fill="x", pady=10, padx=10)
        
        zen_btn = tk.Button(row4, text="🌿 Enter Zen Garden", font=("Arial", 14, "bold"),
                           bg="#10b981", fg="white", relief="flat",
                           padx=30, pady=15, cursor="hand2",
                           command=self.open_zen_garden)
        zen_btn.pack()
    
    def create_card(self, parent, title, theme, width=None):
        """Create a styled card widget"""
        card = tk.Frame(parent, bg="white", relief="flat", bd=0)
        if width:
            card.configure(width=width)
        
        # Title
        title_frame = tk.Frame(card, bg="white")
        title_frame.pack(fill="x", padx=15, pady=10)
        
        tk.Label(title_frame, text=title, font=("Arial", 12, "bold"),
                bg="white", fg=theme['text']).pack(side="left")
        
        # Add button (for applicable cards)
        if title in ["🔔 Reminders", "✓ Tasks", "🎵 Comfort Vault", "🍴 Food Habits"]:
            add_btn = tk.Label(title_frame, text="+", font=("Arial", 16),
                             bg="white", fg=theme['primary'], cursor="hand2")
            add_btn.pack(side="right")
            add_btn.bind("<Button-1>", lambda e: self.add_item(title))
        
        # Content area
        content = tk.Frame(card, bg="white")
        content.pack(fill="both", expand=True, padx=15, pady=10)
        
        # Store reference
        card.content = content
        
        return card
    
    def create_stopwatch(self, parent, theme):
        """Create stopwatch widget"""
        content = parent.content
        
        # Time display
        self.stopwatch_time = "00:00:00"
        self.stopwatch_running = False
        self.stopwatch_start_time = 0
        
        time_label = tk.Label(content, text=self.stopwatch_time,
                             font=("Arial", 32, "bold"), bg="white", fg=theme['text'])
        time_label.pack(pady=20)
        
        # Buttons
        btn_frame = tk.Frame(content, bg="white")
        btn_frame.pack()
        
        self.stopwatch_start_btn = tk.Button(btn_frame, text="▶", font=("Arial", 16),
                                            bg=theme['primary'], fg="white",
                                            width=4, relief="flat", cursor="hand2",
                                            command=lambda: self.toggle_stopwatch(time_label))
        self.stopwatch_start_btn.pack(side="left", padx=5)
        
        reset_btn = tk.Button(btn_frame, text="↻", font=("Arial", 16),
                             bg=theme['secondary'], fg="white",
                             width=4, relief="flat", cursor="hand2",
                             command=lambda: self.reset_stopwatch(time_label))
        reset_btn.pack(side="left", padx=5)
        
        self.stopwatch_label = time_label
    
    def toggle_stopwatch(self, label):
        """Start/stop stopwatch"""
        if not self.stopwatch_running:
            self.stopwatch_running = True
            self.stopwatch_start_time = time.time() - (self.stopwatch_start_time or 0)
            self.stopwatch_start_btn.config(text="⏸")
            self.update_stopwatch(label)
        else:
            self.stopwatch_running = False
            self.stopwatch_start_btn.config(text="▶")
    
    def reset_stopwatch(self, label):
        """Reset stopwatch"""
        self.stopwatch_running = False
        self.stopwatch_start_time = 0
        self.stopwatch_time = "00:00:00"
        label.config(text=self.stopwatch_time)
        self.stopwatch_start_btn.config(text="▶")
    
    def update_stopwatch(self, label):
        """Update stopwatch display"""
        if self.stopwatch_running:
            elapsed = time.time() - self.stopwatch_start_time
            hours = int(elapsed // 3600)
            minutes = int((elapsed % 3600) // 60)
            seconds = int(elapsed % 60)
            self.stopwatch_time = f"{hours:02d}:{minutes:02d}:{seconds:02d}"
            label.config(text=self.stopwatch_time)
            label.after(100, lambda: self.update_stopwatch(label))
    
    def create_focus_audio(self, parent, theme):
        """Create focus audio player"""
        content = parent.content
        
        # Audio selection
        tk.Label(content, text="White Noise", font=("Arial", 11),
                bg="white", fg=theme['text']).pack(pady=10)
        
        # Upload button
        upload_btn = tk.Button(content, text="⬆ Upload Audio", font=("Arial", 10),
                              bg=theme['primary'], fg="white", relief="flat",
                              padx=20, pady=10, cursor="hand2",
                              command=self.upload_audio)
        upload_btn.pack(pady=10)
        
        # Status
        tk.Label(content, text="🔊 Paused", font=("Arial", 9),
                bg="white", fg="#6b7280").pack()
    
    def create_notes_section(self, parent, theme):
        """Create notes management section"""
        content = parent.content
        
        if not self.data['notes']:
            tk.Label(content, text="No notes", font=("Arial", 10),
                    bg="white", fg="#9ca3af").pack(pady=40)
        else:
            for note in self.data['notes'][:5]:  # Show first 5
                note_frame = tk.Frame(content, bg="#f3f4f6", relief="flat")
                note_frame.pack(fill="x", pady=5)
                
                tk.Label(note_frame, text=note['title'], font=("Arial", 10),
                        bg="#f3f4f6", fg=theme['text']).pack(anchor="w", padx=10, pady=5)
    
    def create_tasks_section(self, parent, theme):
        """Create tasks management section"""
        content = parent.content
        
        if not self.data['tasks']:
            tk.Label(content, text="No tasks", font=("Arial", 10),
                    bg="white", fg="#9ca3af").pack(pady=40)
        else:
            for task in self.data['tasks'][:5]:  # Show first 5
                self.create_task_item(content, task, theme)
    
    def create_task_item(self, parent, task, theme):
        """Create a single task item"""
        task_frame = tk.Frame(parent, bg="white")
        task_frame.pack(fill="x", pady=2)
        
        # Checkbox
        var = tk.BooleanVar(value=task.get('completed', False))
        cb = tk.Checkbutton(task_frame, variable=var, bg="white",
                           command=lambda: self.toggle_task(task['id']))
        cb.pack(side="left")
        
        # Task text
        text_color = "#9ca3af" if task.get('completed') else theme['text']
        tk.Label(task_frame, text=task['text'], font=("Arial", 10),
                bg="white", fg=text_color).pack(side="left", padx=5)
    
    def create_daily_goal(self, parent, theme):
        """Create daily goal section"""
        goal_frame = tk.Frame(parent, bg=theme['primary'], relief="flat")
        goal_frame.pack(fill="x", pady=10)
        
        # Title
        tk.Label(goal_frame, text="🎯 Daily Goal", font=("Arial", 12, "bold"),
                bg=theme['primary'], fg="white").pack(anchor="w", padx=20, pady=(15, 10))
        
        # Input
        entry_frame = tk.Frame(goal_frame, bg=theme['primary'])
        entry_frame.pack(fill="x", padx=20, pady=(0, 15))
        
        # Checkbox
        goal_var = tk.BooleanVar(value=self.data.get('daily_goal_completed', False))
        cb = tk.Checkbutton(entry_frame, variable=goal_var, bg=theme['primary'],
                           command=lambda: self.toggle_daily_goal(goal_var.get()))
        cb.pack(side="left")
        
        # Entry
        goal_entry = tk.Entry(entry_frame, font=("Arial", 11), bg=theme['secondary'],
                             fg="white", relief="flat", insertbackground="white")
        goal_entry.insert(0, self.data.get('daily_goal', "What's your main goal for today?"))
        goal_entry.pack(side="left", fill="x", expand=True, padx=10, ipady=8)
        goal_entry.bind("<FocusOut>", lambda e: self.save_daily_goal(goal_entry.get()))
    
    def create_focus_tracker(self, parent, theme):
        """Create focus tracker visualization"""
        tracker_frame = tk.Frame(parent, bg="white", relief="flat")
        tracker_frame.pack(fill="x", pady=10)
        
        # Title
        tk.Label(tracker_frame, text="📊 Focus Tracker", font=("Arial", 12, "bold"),
                bg="white", fg=theme['text']).pack(anchor="w", padx=20, pady=15)
        
        # Chart placeholder (simplified visualization)
        chart_frame = tk.Frame(tracker_frame, bg="#f3f4f6", height=150)
        chart_frame.pack(fill="x", padx=20, pady=(0, 20))
        chart_frame.pack_propagate(False)
        
        tk.Label(chart_frame, text="Focus activity will appear here",
                font=("Arial", 10), bg="#f3f4f6", fg="#9ca3af").place(relx=0.5, rely=0.5, anchor="center")
    
    def create_comfort_vault(self, parent, theme):
        """Create comfort vault section"""
        content = parent.content
        
        tk.Label(content, text="Add something comforting!",
                font=("Arial", 11), bg="white", fg=theme['primary']).pack(pady=40)
    
    def create_sentiment_analysis(self, parent, theme):
        """Create sentiment analysis widget"""
        content = parent.content
        
        # Tabs
        tab_frame = tk.Frame(content, bg="white")
        tab_frame.pack(fill="x", pady=10)
        
        tabs = ["Mood", "Color", "Questions"]
        for i, tab in enumerate(tabs):
            tab_btn = tk.Button(tab_frame, text=tab, font=("Arial", 10),
                               bg=theme['primary'] if i == 0 else "white",
                               fg="white" if i == 0 else theme['text'],
                               relief="flat", padx=15, pady=5, cursor="hand2")
            tab_btn.pack(side="left", padx=2)
        
        # Mood options
        tk.Label(content, text="How are you feeling?",
                font=("Arial", 11, "bold"), bg="white", fg=theme['primary']).pack(pady=10)
        
        moods_frame = tk.Frame(content, bg="white")
        moods_frame.pack()
        
        moods = [
            ("😊", "Great", "#ec4899"),
            ("🙂", "Good", "#10b981"),
            ("😐", "Neutral", "#f59e0b"),
            ("😢", "Sad", "#3b82f6"),
            ("😰", "Stressed", "#ef4444")
        ]
        
        for i, (emoji, label, color) in enumerate(moods):
            mood_btn = tk.Frame(moods_frame, bg="white", relief="solid", bd=1)
            mood_btn.grid(row=i//3, column=i%3, padx=10, pady=10)
            
            tk.Label(mood_btn, text=emoji, font=("Arial", 24),
                    bg=color, fg="white", width=3, height=1).pack()
            tk.Label(mood_btn, text=label, font=("Arial", 9),
                    bg="white", fg=theme['text']).pack(pady=5)
        
        # Submit button
        submit_btn = tk.Button(content, text="Submit", font=("Arial", 11, "bold"),
                              bg=theme['primary'], fg="white", relief="flat",
                              padx=50, pady=10, cursor="hand2",
                              command=self.submit_sentiment)
        submit_btn.pack(pady=15)
    
    def create_sentiment_tracker(self, parent, theme):
        """Create sentiment tracker graph"""
        content = parent.content
        
        # Graph placeholder
        graph_frame = tk.Frame(content, bg="#f3f4f6", height=200)
        graph_frame.pack(fill="both", expand=True, padx=10, pady=10)
        graph_frame.pack_propagate(False)
        
        tk.Label(graph_frame, text="📈", font=("Arial", 40),
                bg="#f3f4f6", fg=theme['primary']).place(relx=0.5, rely=0.3, anchor="center")
        
        tk.Label(graph_frame, text="No sentiment entries yet",
                font=("Arial", 10), bg="#f3f4f6", fg="#9ca3af").place(relx=0.5, rely=0.6, anchor="center")
        
        tk.Label(graph_frame, text="Complete the Sentiment Analysis to start tracking",
                font=("Arial", 9), bg="#f3f4f6", fg=theme['primary']).place(relx=0.5, rely=0.75, anchor="center")
    
    def create_food_habits(self, parent, theme):
        """Create food habits tracker"""
        content = parent.content
        
        tk.Label(content, text="Today's Meals", font=("Arial", 11, "bold"),
                bg="white", fg=theme['primary']).pack(pady=10)
        
        if not self.data['food_entries']:
            tk.Label(content, text="No meals logged today",
                    font=("Arial", 10), bg="white", fg="#9ca3af").pack(pady=20)
            tk.Label(content, text="Remember to eat and stay healthy! 🍎",
                    font=("Arial", 9), bg="white", fg=theme['primary']).pack()
    
    def create_daily_motivation(self, parent, theme):
        """Create daily motivation section"""
        motivation_frame = tk.Frame(parent, bg="white", relief="flat")
        motivation_frame.pack(fill="x", pady=10)
        
        # Gradient effect (simulated with frame)
        gradient = tk.Frame(motivation_frame, bg=theme['primary'], height=200)
        gradient.pack(fill="x", padx=20, pady=20)
        gradient.pack_propagate(False)
        
        # Title
        tk.Label(gradient, text="✨ Daily Motivation ✨", font=("Arial", 14, "bold"),
                bg=theme['primary'], fg="white").pack(pady=(20, 10))
        
        # Quote
        quotes = [
            "You're stronger than you think! 💪",
            "Take it one step at a time 🌱",
            "You've got this! 💫",
            "Progress, not perfection ✨",
            "Believe in yourself 🌟"
        ]
        import random
        quote = random.choice(quotes)
        
        tk.Label(gradient, text=f'"{quote}"', font=("Arial", 14, "italic"),
                bg=theme['primary'], fg="white", wraplength=400).pack(pady=10)
        
        # Button
        new_quote_btn = tk.Button(gradient, text="Get New Quote", font=("Arial", 11, "bold"),
                                 bg=theme['secondary'], fg="white", relief="flat",
                                 padx=30, pady=10, cursor="hand2",
                                 command=lambda: self.refresh_motivation(gradient, theme))
        new_quote_btn.pack(pady=10)
    
    # Helper Methods
    
    def add_item(self, card_title):
        """Add new item to a card"""
        # Simple dialog implementation
        dialog = tk.Toplevel(self.root)
        dialog.title(f"Add {card_title}")
        dialog.geometry("400x150")
        dialog.transient(self.root)
        dialog.grab_set()
        
        tk.Label(dialog, text=f"Enter new {card_title}:", font=("Arial", 11)).pack(pady=20)
        
        entry = tk.Entry(dialog, font=("Arial", 11), width=40)
        entry.pack(pady=10)
        entry.focus()
        
        def save_item():
            text = entry.get().strip()
            if text:
                if "Task" in card_title:
                    self.data['tasks'].append({'id': len(self.data['tasks']), 'text': text, 'completed': False})
                elif "Reminder" in card_title:
                    self.data['reminders'].append({'text': text, 'time': None})
                elif "Note" in card_title:
                    self.data['notes'].append({'title': text, 'content': '', 'date': datetime.now().isoformat()})
                
                self.save_data()
                dialog.destroy()
                self.show_main_app()  # Refresh
        
        tk.Button(dialog, text="Add", command=save_item, padx=20, pady=5).pack(pady=10)
    
    def toggle_task(self, task_id):
        """Toggle task completion"""
        for task in self.data['tasks']:
            if task['id'] == task_id:
                task['completed'] = not task.get('completed', False)
                break
        self.save_data()
    
    def toggle_daily_goal(self, completed):
        """Toggle daily goal completion"""
        self.data['daily_goal_completed'] = completed
        self.save_data()
    
    def save_daily_goal(self, goal_text):
        """Save daily goal text"""
        self.data['daily_goal'] = goal_text
        self.save_data()
    
    def upload_audio(self):
        """Upload audio file to comfort vault"""
        filepath = filedialog.askopenfilename(
            title="Select Audio File",
            filetypes=[("Audio Files", "*.mp3 *.wav *.ogg")]
        )
        if filepath:
            # Copy to comfort vault
            import shutil
            dest = os.path.join("audio_library", os.path.basename(filepath))
            os.makedirs("audio_library", exist_ok=True)
            shutil.copy(filepath, dest)
            messagebox.showinfo("Success", "Audio uploaded to comfort vault!")
    
    def submit_sentiment(self):
        """Submit sentiment analysis"""
        entry = {
            'date': datetime.now().isoformat(),
            'mood': 'neutral',  # Would be selected from UI
            'color': None,
            'answers': []
        }
        self.data['sentiment_entries'].append(entry)
        self.save_data()
        messagebox.showinfo("Saved", "Sentiment logged!")
    
    def toggle_grayscale(self):
        """Toggle grayscale mode or switch modes"""
        if self.current_mode == 'work':
            messagebox.showinfo("Grayscale Mode", "Grayscale filter would be applied here")
        else:
            self.exit_to_selection()
    
    def exit_to_selection(self):
        """Return to mode selection screen"""
        self.current_mode = 'selection'
        self.data['current_mode'] = 'selection'
        self.save_data()
        self.show_mode_selection()
    
    def refresh_motivation(self, parent, theme):
        """Refresh motivation quote"""
        # Recreate motivation section
        for widget in parent.winfo_children():
            widget.destroy()
        
        # Redraw
        tk.Label(parent, text="✨ Daily Motivation ✨", font=("Arial", 14, "bold"),
                bg=theme['primary'], fg="white").pack(pady=(20, 10))
        
        quotes = [
            "You're stronger than you think! 💪",
            "Take it one step at a time 🌱",
            "You've got this! 💫",
            "Progress, not perfection ✨",
            "Believe in yourself 🌟"
        ]
        import random
        quote = random.choice(quotes)
        
        tk.Label(parent, text=f'"{quote}"', font=("Arial", 14, "italic"),
                bg=theme['primary'], fg="white", wraplength=400).pack(pady=10)
        
        new_quote_btn = tk.Button(parent, text="Get New Quote", font=("Arial", 11, "bold"),
                                 bg=theme['secondary'], fg="white", relief="flat",
                                 padx=30, pady=10, cursor="hand2",
                                 command=lambda: self.refresh_motivation(parent, theme))
        new_quote_btn.pack(pady=10)
    
    def open_zen_garden(self):
        """Open zen garden mini-game"""
        messagebox.showinfo("Zen Garden", "Zen Garden feature coming soon! 🌿")
    
    def launch_jake(self):
        """Launch the Shimeji character window"""
        try:
            import animator_ui
            # Launch in separate thread so it doesn't block
            threading.Thread(target=lambda: animator_ui.TouchgrassAnimator(), daemon=True).start()
        except Exception as e:
            messagebox.showerror("Error", f"Could not launch Jake: {e}")
    
    def start_focus_tracker(self):
        """Start the focus tracking thread"""
        def track():
            while True:
                try:
                    # Read character state if exists
                    if os.path.exists("character_state.txt"):
                        with open("character_state.txt", "r") as f:
                            state = f.read().strip()
                            self.data['character_state'] = state
                    
                    # Update points display if in work mode
                    if hasattr(self, 'points_label') and self.current_mode == 'work':
                        points = self.data.get('focus_points', 0)
                        points_color = "#2ecc71" if points >= 0 else "#e74c3c"
                        self.points_label.config(text=str(points), fg=points_color)
                    
                    time.sleep(2)
                except:
                    pass
        
        threading.Thread(target=track, daemon=True).start()

if __name__ == "__main__":
    app = ProductivityWellnessApp()