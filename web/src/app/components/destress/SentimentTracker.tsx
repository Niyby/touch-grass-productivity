import { useState, useEffect } from "react";
import { TrendingUp, Heart, Smile, Meh, Frown, Angry } from "lucide-react";

interface Entry {
  id: string;
  date: string;
  mood?: string;
  color?: string;
}

const MOOD_ICONS: Record<string, any> = {
  great: Heart,
  good: Smile,
  neutral: Meh,
  sad: Frown,
  stressed: Angry,
};

export default function SentimentTracker() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("sentimentEntries");
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  // Refresh every few seconds to catch new entries
  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem("sentimentEntries");
      if (saved) setEntries(JSON.parse(saved));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const recentEntries = entries.slice(0, 7);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-200">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-purple-600" />
        <h3 className="text-purple-900">Sentiment Tracker</h3>
      </div>

      {recentEntries.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-purple-700 mb-2">
            <span>Recent entries</span>
            <span>{recentEntries.length} of 7</span>
          </div>
          
          {recentEntries.map((entry) => {
            const Icon = entry.mood ? MOOD_ICONS[entry.mood] : null;
            return (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-purple-100"
              >
                <div className="flex items-center gap-3">
                  {Icon && (
                    <div className="bg-purple-200 p-2 rounded-full">
                      <Icon className="w-4 h-4 text-purple-700" />
                    </div>
                  )}
                  {entry.color && (
                    <div className="w-8 h-8 rounded-full border-2 border-purple-300" style={{ backgroundColor: entry.color.toLowerCase() }} />
                  )}
                  <div>
                    <p className="text-sm text-purple-900">
                      {entry.mood ? entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1) : entry.color}
                    </p>
                    <p className="text-xs text-purple-600">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-800">
              Keep tracking your emotions to better understand your patterns! 💜
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-purple-300 mx-auto mb-3" />
          <p className="text-purple-600">No sentiment entries yet</p>
          <p className="text-sm text-purple-500 mt-2">
            Complete the Sentiment Analysis to start tracking
          </p>
        </div>
      )}
    </div>
  );
}
