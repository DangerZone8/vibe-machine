import { useState, useRef, useEffect } from "react";
import { Play, Pause, Download, RotateCcw, Share2, Heart, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import type { GeneratedTrack } from "@/lib/music-api";

interface AudioPlayerProps {
  track: GeneratedTrack;
  onRegenerate?: () => void;
  onSave?: () => void;
  compact?: boolean;
}

const AudioPlayer = ({ track, onRegenerate, onSave, compact = false }: AudioPlayerProps) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [liked, setLiked] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  // Simulated playback for demo
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setPlaying(false);
            return 0;
          }
          return p + 100 / (track.duration * 10);
        });
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, track.duration]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const currentTime = (progress / 100) * track.duration;

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl glass neon-border">
        <button
          onClick={() => setPlaying(!playing)}
          className="w-10 h-10 rounded-full gradient-phonk flex items-center justify-center shrink-0 glow-purple transition-transform hover:scale-105"
        >
          {playing ? <Pause className="w-4 h-4 text-primary-foreground" /> : <Play className="w-4 h-4 text-primary-foreground ml-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{track.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full gradient-phonk rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
          </div>
        </div>
        <button onClick={() => setLiked(!liked)} className="p-1.5">
          <Heart className={`w-4 h-4 ${liked ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass neon-border p-6 space-y-5 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold text-glow-purple">{track.title}</h3>
          <div className="flex gap-2 mt-2">
            {track.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="font-heading">{track.bpm} BPM</span>
          <span>•</span>
          <span>{formatTime(track.duration)}</span>
        </div>
      </div>

      {/* Fake waveform visualization */}
      <div className="relative h-20 flex items-center gap-px">
        {Array.from({ length: 80 }).map((_, i) => {
          const height = 20 + Math.sin(i * 0.3) * 30 + Math.random() * 25;
          const filled = (i / 80) * 100 < progress;
          return (
            <div
              key={i}
              className={`flex-1 rounded-full transition-colors ${filled ? "bg-primary" : "bg-muted-foreground/20"}`}
              style={{ height: `${height}%` }}
            />
          );
        })}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-primary-foreground shadow-lg"
          style={{ left: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setPlaying(!playing)}
          className="w-14 h-14 rounded-full gradient-phonk flex items-center justify-center glow-purple transition-all hover:scale-105 active:scale-95"
        >
          {playing ? (
            <Pause className="w-6 h-6 text-primary-foreground" />
          ) : (
            <Play className="w-6 h-6 text-primary-foreground ml-1" />
          )}
        </button>

        <div className="flex-1">
          <Slider
            value={[progress]}
            onValueChange={([v]) => setProgress(v)}
            max={100}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
            <span className="text-xs text-muted-foreground">{formatTime(track.duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-28">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <Slider value={[volume]} onValueChange={([v]) => setVolume(v)} max={100} step={1} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" size="sm" className="gap-2 neon-border hover:bg-primary/10">
          <Download className="w-4 h-4" /> Download MP3
        </Button>
        {onRegenerate && (
          <Button variant="outline" size="sm" onClick={onRegenerate} className="gap-2 neon-border hover:bg-primary/10">
            <RotateCcw className="w-4 h-4" /> Regenerate
          </Button>
        )}
        <Button variant="outline" size="sm" className="gap-2 neon-border hover:bg-primary/10">
          <Share2 className="w-4 h-4" /> Share
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { setLiked(!liked); onSave?.(); }}
          className={`gap-2 neon-border ${liked ? "bg-secondary/15 text-secondary border-secondary/30" : "hover:bg-primary/10"}`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} /> {liked ? "Saved" : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default AudioPlayer;
