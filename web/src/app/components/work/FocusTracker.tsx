import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, TrendingUp, AlertCircle, Award } from "lucide-react";

interface FocusData {
  focusSessions: number;
  distractions: number;
  focusPoints: number;
  lastUpdated: string;
}

export default function FocusTracker() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [focusData, setFocusData] = useState<FocusData>({
    focusSessions: 0,
    distractions: 0,
    focusPoints: 0,
    lastUpdated: new Date().toISOString(),
  });

  useEffect(() => {
    const saved = localStorage.getItem("focusTrackerData");
    const points = localStorage.getItem("focusPoints");
    if (saved) {
      const data = JSON.parse(saved);
      setFocusData({ ...data, focusPoints: parseInt(points || "0") });
    } else if (points) {
      setFocusData((prev) => ({ ...prev, focusPoints: parseInt(points) }));
    }
  }, []);

  const updateData = (field: "focusSessions" | "distractions", increment: boolean) => {
    const newData = {
      ...focusData,
      [field]: focusData[field] + (increment ? 1 : -1),
      lastUpdated: new Date().toISOString(),
    };
    
    // Update focus points
    if (field === "focusSessions" && increment) {
      newData.focusPoints += 10;
      localStorage.setItem("focusPoints", newData.focusPoints.toString());
    }
    
    setFocusData(newData);
    localStorage.setItem("focusTrackerData", JSON.stringify(newData));
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-700" />
          <h3 className="text-gray-900">Focus Tracker</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-700" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Focus Sessions */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-900">Focus Sessions</span>
              </div>
              <div className="text-2xl text-green-700 mb-2">
                {focusData.focusSessions}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateData("focusSessions", true)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  +1
                </button>
                <button
                  onClick={() => updateData("focusSessions", false)}
                  disabled={focusData.focusSessions === 0}
                  className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 disabled:opacity-50"
                >
                  -1
                </button>
              </div>
            </div>

            {/* Distractions */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-900">Distractions</span>
              </div>
              <div className="text-2xl text-red-700 mb-2">
                {focusData.distractions}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateData("distractions", true)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  +1
                </button>
                <button
                  onClick={() => updateData("distractions", false)}
                  disabled={focusData.distractions === 0}
                  className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300 disabled:opacity-50"
                >
                  -1
                </button>
              </div>
            </div>

            {/* Focus Points */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-900">Focus Points</span>
              </div>
              <div className="text-2xl text-yellow-700 mb-2">
                {focusData.focusPoints}
              </div>
              <p className="text-xs text-yellow-700">
                Earn by completing goals & focusing
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm text-gray-700 mb-2">How to earn Focus Points:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Complete daily goal: +50 points</li>
              <li>• Complete a focus session: +10 points</li>
              <li>• Use points to grow your Zen Garden in Destress Mode!</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
