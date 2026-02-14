import { useState, useEffect } from "react";
import { CheckSquare, Plus, Trash2 } from "lucide-react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export default function TasksPanel() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("workTasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  const saveTasks = (updated: Task[]) => {
    setTasks(updated);
    localStorage.setItem("workTasks", JSON.stringify(updated));
  };

  const handleAdd = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        text: newTask,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      saveTasks([...tasks, task]);
      setNewTask("");
      setShowAdd(false);
    }
  };

  const toggleTask = (id: string) => {
    saveTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-gray-700" />
          <h3 className="text-gray-900">Tasks</h3>
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
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task..."
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
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <div className="flex items-center gap-2 flex-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-4 h-4 cursor-pointer"
              />
              <span
                className={`text-sm ${
                  task.completed ? "line-through text-gray-500" : "text-gray-900"
                }`}
              >
                {task.text}
              </span>
            </div>
            <button
              onClick={() => saveTasks(tasks.filter((t) => t.id !== task.id))}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {tasks.length === 0 && !showAdd && (
          <p className="text-sm text-gray-500 text-center py-4">No tasks</p>
        )}
      </div>
    </div>
  );
}
