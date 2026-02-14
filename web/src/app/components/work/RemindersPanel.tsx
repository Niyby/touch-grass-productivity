import { useState, useEffect } from "react";
import { Bell, Plus, Trash2 } from "lucide-react";

interface Reminder {
  id: string;
  text: string;
  time: string;
  createdAt: string;
}

export default function RemindersPanel() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("workReminders");
    if (saved) setReminders(JSON.parse(saved));
  }, []);

  const saveReminders = (updated: Reminder[]) => {
    setReminders(updated);
    localStorage.setItem("workReminders", JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (newText.trim() && newTime) {
      const newReminder: Reminder = {
        id: Date.now().toString(),
        text: newText,
        time: newTime,
        createdAt: new Date().toISOString(),
      };
      saveReminders([...reminders, newReminder]);
      setNewText("");
      setNewTime("");
      setShowAdd(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-700" />
          <h3 className="text-gray-900">Reminders</h3>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <Plus className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {showAdd && (
        <div className="mb-3 space-y-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Reminder..."
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="px-3 py-1 bg-gray-700 text-white rounded text-sm"
            >
              Add
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-3 py-1 bg-gray-200 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {reminders.map((r) => (
          <div key={r.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
            <div>
              <p className="text-sm text-gray-900">{r.text}</p>
              <p className="text-xs text-gray-600">{r.time}</p>
            </div>
            <button
              onClick={() => saveReminders(reminders.filter((rem) => rem.id !== r.id))}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {reminders.length === 0 && !showAdd && (
          <p className="text-sm text-gray-500 text-center py-4">No reminders</p>
        )}
      </div>
    </div>
  );
}
