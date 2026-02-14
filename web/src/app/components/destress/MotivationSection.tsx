import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const MOTIVATIONAL_QUOTES = [
  "You are doing great! Keep going! 💪",
  "Every small step counts. Be proud of yourself! ✨",
  "You're stronger than you think! 🌟",
  "Take a deep breath. You've got this! 🌸",
  "Your feelings are valid. It's okay to take breaks! 💜",
  "You're making progress, even when it doesn't feel like it! 🌱",
  "Be kind to yourself today! You deserve it! 🌺",
  "You're not alone. You're doing amazing! 💖",
];

export default function MotivationSection() {
  const [quote, setQuote] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
  }, []);

  const getNewQuote = () => {
    let newIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    while (newIndex === index && MOTIVATIONAL_QUOTES.length > 1) {
      newIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    }
    setIndex(newIndex);
    setQuote(MOTIVATIONAL_QUOTES[newIndex]);
  };

  return (
    <div className="bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-2xl p-8 shadow-lg text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-purple-700" />
        <h3 className="text-purple-900">Daily Motivation</h3>
        <Sparkles className="w-6 h-6 text-purple-700" />
      </div>

      <p className="text-2xl text-purple-900 mb-6 italic">
        "{quote}"
      </p>

      <button
        onClick={getNewQuote}
        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      >
        Get New Quote
      </button>
    </div>
  );
}
