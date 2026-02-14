import tkinter as tk
from tkinter import messagebox
import os
import winsound 
import random

class TouchgrassAnimator:
    def __init__(self):
        self.root = tk.Tk()
        self.root.overrideredirect(True)
        self.root.attributes("-topmost", True)
        self.root.attributes("-transparentcolor", "white") 
        
        # Reduced window size (Small enough to be a 'pet', big enough to see)
        self.win_w, self.win_h = 150, 150
        self.root.geometry(f"{self.win_w}x{self.win_h}+500+300")
        
        self.mode = "CHILL" 

        # Create Canvas matching the window size
        self.canvas = tk.Canvas(self.root, width=self.win_w, height=self.win_h, 
                               bg="white", highlightthickness=0)
        self.canvas.pack()

        # Load and SCALE images
        self.sprites = {}
        self.load_and_scale_assets()

        # Draw the Full Image (Centered)
        self.sprite = self.canvas.create_image(self.win_w//2, self.win_h//2, 
                                             image=self.sprites.get('chill'))

        # Subtle Status Text (Smaller font for the smaller UI)
        self.status_text = self.canvas.create_text(self.win_w//2, self.win_h - 10, 
                                                 text="CHILL", font=("Arial", 8, "bold"), fill="#2ecc71")

        # Overlay and Bindings
        self.setup_overlay()
        self.canvas.bind("<B1-Motion>", self.drag)
        self.canvas.bind("<Double-Button-1>", self.open_comfort_vault)
        self.root.bind("<space>", lambda e: self.toggle_mode())

        self.root.mainloop()

    def update_jake_state(self):
    state_file = "../character_state.txt"
    if os.path.exists(state_file):
        with open(state_file, "r") as f:
            state = f.read().strip()
            
        # Map backend states to your Jake sprites
        if state == "happy":
            self.canvas.itemconfig(self.sprite, image=self.sprites['happy'])
            self.canvas.itemconfig(self.status_text, text="PROUD OF U", fill="#2ecc71")
        elif state == "sad":
            self.canvas.itemconfig(self.sprite, image=self.sprites['disappointed'])
            self.canvas.itemconfig(self.status_text, text="STOP SLACKING", fill="#e74c3c")
        else: # idle
            self.canvas.itemconfig(self.sprite, image=self.sprites['chill'])
            self.canvas.itemconfig(self.status_text, text="CHILLIN", fill="#3498db")

    # Check again in 1 second
    self.root.after(1000, self.update_jake_state)

    def load_and_scale_assets(self):
        """Loads PNGs and reduces size so the ENTIRE image fits"""
        asset_files = {
            'chill': '../assets/shimeji_chill.png',
            'work': '../assets/shimeji_work.png',
            'disappointed': '../assets/shimeji_disappointed.png',
            'excited': '../assets/shimeji_excited.png',
            'happy': '../assets/shimeji_happy.png'
        }
        
        for key, path in asset_files.items():
            try:
                full_img = tk.PhotoImage(file=path)
                # Reduce size: subsample(2,2) makes it 50% smaller. 
                # subsample(3,3) makes it 33% size.
                self.sprites[key] = full_img.subsample(3, 3) 
            except Exception as e:
                print(f"Error loading {key}: {e}")
                self.sprites[key] = None

    def drag(self, event):
        # Adjusting drag so it stays centered under the mouse
        self.root.geometry(f"+{event.x_root - (self.win_w//2)}+{event.y_root - (self.win_h//2)}")

    def setup_overlay(self):
        self.duller = tk.Toplevel(self.root)
        self.duller.attributes("-alpha", 0.4) 
        self.duller.configure(bg="black")
        self.duller.state('zoomed') 
        self.duller.withdraw()

    def toggle_mode(self):
        if self.mode == "CHILL":
            self.mode = "WORK"
            self.duller.deiconify()
            self.canvas.itemconfig(self.sprite, image=self.sprites['work'])
            self.canvas.itemconfig(self.status_text, text="FOCUS", fill="#e74c3c")
        else:
            self.mode = "CHILL"
            self.duller.withdraw()
            self.canvas.itemconfig(self.sprite, image=self.sprites['chill'])
            self.canvas.itemconfig(self.status_text, text="CHILL", fill="#2ecc71")

    def open_comfort_vault(self, event):
        # (Vault logic remains the same as previous)
        pass

if __name__ == "__main__":
    TouchgrassAnimator()