import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { X } from "lucide-react";
import RemindersPanel from "../components/work/RemindersPanel";
import StopwatchPanel from "../components/work/StopwatchPanel";
import AudioPanel from "../components/work/AudioPanel";
import NotesPanel from "../components/work/NotesPanel";
import TasksPanel from "../components/work/TasksPanel";
import GoalSection from "../components/work/GoalSection";
import FocusTracker from "../components/work/FocusTracker";

export default function WorkMode() {
  const navigate = useNavigate();
  const [isGrayscale, setIsGrayscale] = useState(false);

  return (
    <div className={`min-h-screen bg-gray-50 ${isGrayscale ? 'grayscale' : ''} transition-all duration-500`}>
      {/* Header */}
      <div className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center border-b-4 border-gray-900">
        <h1 className="text-white">Get it Done Mode</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsGrayscale(!isGrayscale)}
            className={`px-4 py-2 rounded transition-colors ${
              isGrayscale
                ? "bg-gray-600 hover:bg-gray-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {isGrayscale ? "Color Mode" : "Grayscale Mode"}
          </button>
          <button
            onClick={() => navigate("/mode-selection")}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Top Row - Utilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RemindersPanel />
          <StopwatchPanel />
          <AudioPanel />
        </div>

        {/* Middle Row - Notes and Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NotesPanel />
          <TasksPanel />
        </div>

        {/* Bottom Section - Goal and Focus Tracker */}
        <GoalSection />
        <FocusTracker />
      </div>
    </div>
  );
}
