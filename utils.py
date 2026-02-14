import os
import pygame
import random
from datetime import datetime

pygame.mixer.init()

# Play a random comfort audio
def play_comfort_audio():
    if not os.path.exists("audio_library/comfort.mp3"):
        return
    pygame.mixer.music.load("audio_library/comfort.mp3")
    pygame.mixer.music.play()
    print("🎵 Playing comfort audio")

# Play a random voice note
def play_voice_note():
    folder = "audio_library/voice_notes"
    files = [f for f in os.listdir(folder) if f.endswith(".mp3")]
    if files:
        file = random.choice(files)
        pygame.mixer.music.load(os.path.join(folder, file))
        pygame.mixer.music.play()
        print(f"🎤 Playing voice note: {file}")

# Return today's folder path
def get_daily_folder():
    today = datetime.now().strftime("%Y-%m-%d")
    folder = os.path.join("daily_notes", today)
    if not os.path.exists(folder):
        os.makedirs(folder)
    return folder

# Save a note/task to today's folder
def save_note(note_text, filename="notes.txt"):
    folder = get_daily_folder()
    path = os.path.join(folder, filename)
    with open(path, "a") as f:
        f.write(note_text + "\n")
