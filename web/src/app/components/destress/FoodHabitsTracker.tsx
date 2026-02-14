import { useState, useEffect } from "react";
import { Utensils, Plus } from "lucide-react";

interface MealEntry {
  id: string;
  date: string;
  time: string;
  meal: string;
  ate: boolean;
}

export default function FoodHabitsTracker() {
  const [entries, setEntries] = useState<MealEntry[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newMeal, setNewMeal] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("foodHabits");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const saveEntries = (updated: MealEntry[]) => {
    setEntries(updated);
    localStorage.setItem("foodHabits", JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (newMeal.trim() && newTime) {
      const entry: MealEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        time: newTime,
        meal: newMeal,
        ate: true,
      };
      saveEntries([entry, ...entries]);
      setNewMeal("");
      setNewTime("");
      setShowAdd(false);
      
      // Award focus points
      const currentPoints = parseInt(localStorage.getItem("focusPoints") || "0");
      localStorage.setItem("focusPoints", (currentPoints + 5).toString());
    }
  };

  const toggleAte = (id: string) => {
    saveEntries(entries.map((e) => (e.id === id ? { ...e, ate: !e.ate } : e)));
  };

  const todayEntries = entries.filter(
    (e) => new Date(e.date).toDateString() === new Date().toDateString()
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Utensils className="w-6 h-6 text-purple-600" />
          <h3 className="text-purple-900">Food Habits</h3>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showAdd && (
        <div className="mb-4 p-4 bg-white rounded-lg border border-pink-200 space-y-2">
          <input
            type="text"
            value={newMeal}
            onChange={(e) => setNewMeal(e.target.value)}
            placeholder="What did you eat?"
            className="w-full px-3 py-2 border border-pink-200 rounded"
          />
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="w-full px-3 py-2 border border-pink-200 rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-pink-500 text-white rounded"
            >
              Log Meal
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        <h4 className="text-sm text-purple-800 mb-2">Today's Meals</h4>
        {todayEntries.length > 0 ? (
          todayEntries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-purple-100"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={entry.ate}
                  onChange={() => toggleAte(entry.id)}
                  className="w-5 h-5 cursor-pointer"
                />
                <div>
                  <p className="text-sm text-purple-900">{entry.meal}</p>
                  <p className="text-xs text-purple-600">{entry.time}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-purple-600">No meals logged today</p>
            <p className="text-sm text-purple-500 mt-1">
              Remember to eat and stay healthy! 🍽️
            </p>
          </div>
        )}
      </div>

      {todayEntries.length >= 3 && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            ✓ Great job! You've logged {todayEntries.length} meals today!
          </p>
        </div>
      )}
    </div>
  );
}
