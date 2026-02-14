import os
import shutil

def reset_daily_folder():
    folder = "daily_notes"
    if os.path.exists(folder):
        shutil.rmtree(folder)
    os.makedirs(folder)
    print("✨ Daily notes folder reset!")
