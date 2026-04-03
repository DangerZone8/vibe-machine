import { Play, Download, Clock, Music2 } from "lucide-react";
import type { GeneratedTrack } from "@/lib/music-api";
import { useState } from "react";

interface TrackCardProps {
  track: GeneratedTrack;
  onPlay?: (track: GeneratedTrack) => void;
}

const moodColors: Record<string, string> = {
  chill: "from-blue-500/30 to-purple-500/30",
  hype: "from-orange-500/30 to-red-500/30",
  sad: "from-indigo-500/30 to-blue-500/30",
  rage: "from-red-500/30 to-pink-500/30",
  dreamy: "from-violet-500/30 to-pink-500/30",
  epic: "from-amber-500/30 to-orange-500/30",
  party: "from-pink-500/30 to-yellow-500/30",
};

const TrackCard = ({ track, onPlay }: TrackCardProps) => {
  const [hovered, setHovered] = useState(false);
  const gradient = moodColors[track.mood] || "from-primary/30 to-secondary/30";

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div
      className="group relative rounded-xl overflow-hidden neon-border transition-all duration-300 hover:scale-[1.02] hover:glow-purple cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onPlay?.(track)}
    >
      <div className={`h-32 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <Music2 className="w-10 h-10 text-foreground/20" />
        {hovered && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center animate-slide-up">
            <div className="w-12 h-12 rounded-full gradient-phonk flex items-center justify-center glow-purple">
              <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-card space-y-2">
        <h4 className="font-medium text-sm truncate">{track.title}</h4>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formatTime(track.duration)}
          </span>
          <span className="font-heading">{track.bpm} BPM</span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {track.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackCard;
