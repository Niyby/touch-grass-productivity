import { useState } from "react";
import { Heart, Smile, Meh, Frown, Angry } from "lucide-react";

const MOODS = [
  { value: "great", label: "Great", icon: Heart, color: "bg-pink-500" },
  { value: "good", label: "Good", icon: Smile, color: "bg-green-500" },
  { value: "neutral", label: "Neutral", icon: Meh, color: "bg-yellow-500" },
  { value: "sad", label: "Sad", icon: Frown, color: "bg-blue-500" },
  { value: "stressed", label: "Stressed", icon: Angry, color: "bg-red-500" },
];

const COLORS = [
  { name: "Red", color: "bg-red-500", emotion: "energetic/passionate" },
  { name: "Blue", color: "bg-blue-500", emotion: "calm/sad" },
  { name: "Yellow", color: "bg-yellow-500", emotion: "happy/optimistic" },
  { name: "Green", color: "bg-green-500", emotion: "peaceful/balanced" },
  { name: "Purple", color: "bg-purple-500", emotion: "creative/introspective" },
  { name: "Orange", color: "bg-orange-500", emotion: "enthusiastic/warm" },
];

const QUESTIONS = [
  "What are you grateful for today?",
  "What emotion are you feeling most right now?",
  "What would make today better?",
];

export default function SentimentAnalysis() {
  const [mode, setMode] = useState<"mood" | "color" | "questions">("mood");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const entry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: selectedMood,
      color: selectedColor,
      answers: mode === "questions" ? answers : [],
    };
    
    const saved = localStorage.getItem("sentimentEntries") || "[]";
    const entries = JSON.parse(saved);
    localStorage.setItem("sentimentEntries", JSON.stringify([entry, ...entries]));
    
    // Award focus points
    const currentPoints = parseInt(localStorage.getItem("focusPoints") || "0");
    localStorage.setItem("focusPoints", (currentPoints + 15).toString());
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedMood(null);
      setSelectedColor(null);
      setAnswers(["", "", ""]);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200 flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="text-6xl mb-4">✓</div>
          <h3 className="text-purple-900 mb-2">Thank you for sharing!</h3>
          <p className="text-purple-700">+15 Focus Points earned</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200">
      <h3 className="text-purple-900 mb-4">Sentiment Analysis</h3>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("mood")}
          className={`px-3 py-1 rounded text-sm ${
            mode === "mood" ? "bg-purple-500 text-white" : "bg-gray-200"
          }`}
        >
          Mood
        </button>
        <button
          onClick={() => setMode("color")}
          className={`px-3 py-1 rounded text-sm ${
            mode === "color" ? "bg-purple-500 text-white" : "bg-gray-200"
          }`}
        >
          Color
        </button>
        <button
          onClick={() => setMode("questions")}
          className={`px-3 py-1 rounded text-sm ${
            mode === "questions" ? "bg-purple-500 text-white" : "bg-gray-200"
          }`}
        >
          Questions
        </button>
      </div>

      {mode === "mood" && (
        <div>
          <p className="text-purple-800 mb-3">How are you feeling?</p>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {MOODS.map((mood) => {
              const Icon = mood.icon;
              return (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 ${
                    selectedMood === mood.value
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  <div className={`${mood.color} p-2 rounded-full`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs text-purple-900">{mood.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {mode === "color" && (
        <div>
          <p className="text-purple-800 mb-3">Which color represents your mood?</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`p-4 rounded-lg border-2 ${
                  selectedColor === color.name
                    ? "border-purple-500"
                    : "border-gray-200 hover:border-purple-300"
                }`}
              >
                <div className={`${color.color} w-full h-12 rounded mb-2`} />
                <p className="text-sm text-purple-900">{color.name}</p>
                <p className="text-xs text-purple-600">{color.emotion}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === "questions" && (
        <div className="space-y-4">
          {QUESTIONS.map((q, i) => (
            <div key={i}>
              <label className="block text-sm text-purple-800 mb-1">{q}</label>
              <textarea
                value={answers[i]}
                onChange={(e) => {
                  const newAnswers = [...answers];
                  newAnswers[i] = e.target.value;
                  setAnswers(newAnswers);
                }}
                className="w-full px-3 py-2 border border-purple-200 rounded h-20 resize-none"
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={
          (mode === "mood" && !selectedMood) ||
          (mode === "color" && !selectedColor) ||
          (mode === "questions" && answers.every((a) => !a.trim()))
        }
        className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit
      </button>
    </div>
  );
}
