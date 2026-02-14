import { useState } from "react";
import { useNavigate } from "react-router";
import { X, Sprout } from "lucide-react";
import ComfortVault from "../components/destress/ComfortVault";
import SentimentAnalysis from "../components/destress/SentimentAnalysis";
import SentimentTracker from "../components/destress/SentimentTracker";
import FoodHabitsTracker from "../components/destress/FoodHabitsTracker";
import MotivationSection from "../components/destress/MotivationSection";

export default function DestressMode() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 to-purple-500 text-white px-6 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-white">Take a Chill Pill Mode</h1>
        <button
          onClick={() => navigate("/mode-selection")}
          className="p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ComfortVault />
          <SentimentAnalysis />
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SentimentTracker />
          <FoodHabitsTracker />
        </div>

        {/* Motivation Section */}
        <MotivationSection />

        {/* Zen Garden Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/zen-garden")}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            <Sprout className="w-6 h-6" />
            <span className="text-lg">Enter Zen Garden</span>
          </button>
        </div>
      </div>
    </div>
  );
}
