# focus_tracker.py

import pygetwindow as gw
import time
from utils import play_comfort_audio, play_voice_note, save_note

def track_focus():
    """
    Main loop for FocusBuddy:
    - Tracks work vs distraction windows
    - Updates points
    - Plays comfort audio or voice notes
    - Saves daily notes
    - Sends character state to frontend via character_state.txt
    """

    points = 0
    break_timer = time.time()

    # Thresholds
    comfort_threshold = -5
    negative_reward_threshold = -10

    # Apps
    work_apps = ["chrome", "code", "notepad", "word", "docs", "study"]
    distractions = ["youtube", "instagram", "reddit", "netflix", "facebook", "twitter"]

    while True:
        try:
            win = gw.getActiveWindow()
            title = win.title.lower() if win else "idle"
            print("Current window:", title)

            character_state = "idle"

            # 1️⃣ Distraction check
            if any(app in title for app in distractions):
                points -= 1
                character_state = "sad"
                print(f"❌ Distracted | Points: {points}")
                save_note(f"Distracted: {title}")

                if points <= comfort_threshold:
                    # Randomly choose between comfort audio or voice note
                    if points % 2 == 0:
                        play_comfort_audio()
                    else:
                        play_voice_note()

            # 2️⃣ Work apps check
            elif any(app in title for app in work_apps):
                points += 1
                character_state = "happy"
                print(f"✅ Working | Points: {points}")
                save_note(f"Working on: {title}")

            # 3️⃣ Idle
            else:
                print("🛌 Idle...")
                character_state = "idle"

            # 4️⃣ Break reminder every 45 minutes
            if time.time() - break_timer > 2700:
                print("🧘 Time for a break!")
                play_comfort_audio()
                break_timer = time.time()

            # 5️⃣ Negative reward warning
            if points <= negative_reward_threshold:
                print("⚠ Avoid distractions for 10 minutes!")

            # 6️⃣ Update character state for frontend animations
            with open("character_state.txt", "w") as f:
                f.write(character_state)

            # 7️⃣ Wait 5 seconds before next check
            time.sleep(5)

        except Exception as e:
            print("Error:", e)
            time.sleep(5)


# Allows running directly for testing
if __name__ == "__main__":
    track_focus()
