import { useState, useEffect } from "react";
import { Target } from "lucide-react";

export default function GoalSection() {
  const [goal, setGoal] = useState("");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const savedGoal = localStorage.getItem("dailyGoal");
    const savedCompleted = localStorage.getItem("dailyGoalCompleted");
    if (savedGoal) setGoal(savedGoal);
    if (savedCompleted) setCompleted(savedCompleted === "true");
  }, []);

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newGoal = e.target.value;
    setGoal(newGoal);
    localStorage.setItem("dailyGoal", newGoal);
  };

  const handleToggleComplete = () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    localStorage.setItem("dailyGoalCompleted", newCompleted.toString());
    
    // Award focus points for completing goal
    if (newCompleted) {
      const currentPoints = parseInt(localStorage.getItem("focusPoints") || "0");
      localStorage.setItem("focusPoints", (currentPoints + 50).toString());
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg p-6 shadow-lg text-white">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-6 h-6" />
        <h3 className="text-white">Daily Goal</h3>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggleComplete}
          className="w-6 h-6 cursor-pointer"
        />
        <input
          type="text"
          value={goal}
          onChange={handleGoalChange}
          placeholder="What's your main goal for today?"
          className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded text-white placeholder-white/60 focus:outline-none focus:border-white/40"
        />
      </div>
      
      {goal && !completed && (
        <p className="text-sm text-white/70 mt-2">
          Complete this goal to earn 50 focus points! 🎯
        </p>
      )}
      
      {completed && (
        <p className="text-sm text-green-300 mt-2">
          ✓ Goal completed! Great work! 🎉
        </p>
      )}
    </div>
  );
}
