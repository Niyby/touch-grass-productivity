import tkinter as tk
from tkinter import ttk
import animator_ui # Import your existing animator script

class TouchgrassControlCenter:
    def __init__(self, animator_instance):
        self.animator = animator_instance
        self.window = tk.Toplevel() # Opens as a secondary window
        self.window.title("TOUCHGRASS COMMAND")
        self.window.geometry("350x500")
        self.window.configure(bg="#121212")

        # --- STYLE ---
        style = ttk.Style()
        style.theme_use('clam')
        style.configure("TButton", padding=10, font=("Arial", 10, "bold"))

        # --- HEADER ---
        tk.Label(self.window, text="TOUCHGRASS v1.0", bg="#121212", fg="#00f2fe", 
                 font=("Arial", 16, "bold")).pack(pady=20)

        # --- MODE TOGGLE ---
        self.mode_label = tk.Label(self.window, text="CURRENT MODE: CHILL", 
                                   bg="#121212", fg="#2ecc71", font=("Arial", 10))
        self.mode_label.pack(pady=5)

        self.work_btn = tk.Button(self.window, text="ENTER WORK MODE", bg="#e74c3c", fg="white",
                                  command=self.start_work, width=25)
        self.work_btn.pack(pady=10)

        self.chill_btn = tk.Button(self.window, text="RETURN TO CHILL", bg="#2ecc71", fg="white",
                                   command=self.start_chill, width=25)
        self.chill_btn.pack(pady=10)

        # --- TASK PROGRESS ---
        tk.Label(self.window, text="DAILY GOAL PROGRESS", bg="#121212", fg="white").pack(pady=(20, 0))
        self.progress = ttk.Progressbar(self.window, length=200, mode='determinate')
        self.progress.pack(pady=10)
        self.progress['value'] = 20 # Placeholder progress

        # --- RANSOM STATUS ---
        self.ransom_frame = tk.Frame(self.window, bg="#1e1e1e", padx=10, pady=10)
        self.ransom_frame.pack(pady=20, fill="x", padx=20)
        
        tk.Label(self.ransom_frame, text="🔒 RANSOM ARMED", bg="#1e1e1e", fg="#f1c40f", 
                 font=("Arial", 9, "bold")).pack()
        tk.Label(self.ransom_frame, text="Photo: 'shame_pic.jpg' loaded.", 
                 bg="#1e1e1e", fg="gray", font=("Arial", 8)).pack()

    def start_work(self):
        self.animator.switch_to_work()
        self.mode_label.config(text="CURRENT MODE: WORKING", fg="#e74c3c")
        self.window.attributes("-alpha", 0.8) # Dim the UI itself

    def start_chill(self):
        self.animator.switch_to_chill()
        self.mode_label.config(text="CURRENT MODE: CHILL", fg="#2ecc71")
        self.window.attributes("-alpha", 1.0)

# To launch both at once:
if __name__ == "__main__":
    # This acts as the glue to run both
    app = animator_ui.TouchgrassAnimator()