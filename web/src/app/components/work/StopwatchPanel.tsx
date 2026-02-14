import { useState, useEffect } from "react";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";

export default function StopwatchPanel() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = window.setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const reset = () => {
    setTime(0);
    setIsRunning(false);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Timer className="w-5 h-5 text-gray-700" />
        <h3 className="text-gray-900">Stopwatch</h3>
      </div>

      <div className="text-center">
        <div className="text-4xl font-mono mb-4 text-gray-900">{formatTime(time)}</div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 bg-gray-700 text-white rounded hover:bg-gray-800"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={reset}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            <RotateCcw className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
