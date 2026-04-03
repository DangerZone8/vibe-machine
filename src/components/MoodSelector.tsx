import { useState } from "react";

interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

const MOODS: MoodOption[] = [
  { id: "chill", emoji: "🌧️", label: "Chill", color: "from-blue-500/20 to-purple-500/20 border-blue-500/30" },
  { id: "hype", emoji: "🔥", label: "Hype", color: "from-orange-500/20 to-red-500/20 border-orange-500/30" },
  { id: "sad", emoji: "💔", label: "Sad", color: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30" },
  { id: "rage", emoji: "😤", label: "Rage", color: "from-red-500/20 to-pink-500/20 border-red-500/30" },
  { id: "dreamy", emoji: "☁️", label: "Dreamy", color: "from-violet-500/20 to-pink-500/20 border-violet-500/30" },
  { id: "epic", emoji: "🏎️", label: "Epic", color: "from-amber-500/20 to-orange-500/20 border-amber-500/30" },
  { id: "party", emoji: "🎉", label: "Party", color: "from-pink-500/20 to-yellow-500/20 border-pink-500/30" },
];

interface MoodSelectorProps {
  selected: string;
  onSelect: (mood: string) => void;
}

const MoodSelector = ({ selected, onSelect }: MoodSelectorProps) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
      {MOODS.map((mood) => {
        const isActive = selected === mood.id;
        return (
          <button
            key={mood.id}
            onClick={() => onSelect(mood.id)}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 bg-gradient-to-br ${mood.color} ${
              isActive
                ? "scale-105 ring-2 ring-primary glow-purple"
                : "opacity-70 hover:opacity-100 hover:scale-102"
            }`}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-xs font-heading font-semibold tracking-wider">{mood.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MoodSelector;
