import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Download, RotateCcw, Share2, Heart, Volume2, AlertCircle } from "lucide-react";
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
  const [duration, setDuration] = useState(track.duration);
  const [volume, setVolume] = useState(80);
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    setPlaying(false);
    setProgress(0);
    setError(null);
    setLoaded(false);
    if (audio) {
      audio.pause();
      audio.load();
    }
  }, [track.audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onLoadedMetadata = () => {
      setDuration(audio.duration || track.duration);
      setLoaded(true);
      console.log("Audio loaded:", audio.currentSrc || track.audioUrl, "duration:", audio.duration);
    };
    const onCanPlay = () => {
      setLoaded(true);
      setError(null);
    };
    const onEnded = () => { setPlaying(false); setProgress(0); };
    const onError = () => {
      const src = audio.currentSrc || audio.src || track.audioUrl;
      const msg = audio.error
        ? `Audio error (code ${audio.error.code}): ${audio.error.message}`
        : "Audio failed to load";
      console.error(msg, src);
      setError("Check Supabase bucket or refresh");
      setPlaying(false);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [track]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    console.log("Play attempt — audio src:", audio.currentSrc || audio.src, "readyState:", audio.readyState);
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      setError(null);
      audio.play().then(() => {
        setPlaying(true);
        console.log("Playback started successfully for:", audio.currentSrc || audio.src);
      }).catch((e) => {
        console.error("Playback failed:", e.name, e.message, "src:", audio.currentSrc || audio.src);
        if (e.name === "NotAllowedError") {
          setError("Tap the page first to enable sound, then press play");
        } else {
          setError("Check Supabase bucket or refresh");
        }
      });
    }
  }, [playing]);

  const seekTo = useCallback((val: number) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      audio.currentTime = (val / 100) * audio.duration;
      setProgress(val);
    }
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const currentTime = (progress / 100) * duration;

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl glass neon-border">
        <audio ref={audioRef} src={track.audioUrl} preload="auto" />
        <button
          onClick={togglePlay}
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
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass neon-border p-6 space-y-5 animate-slide-up">
      <audio ref={audioRef} src={track.audioUrl} preload="auto" controls className="w-full h-10 rounded-lg mb-2" />

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
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
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
            onValueChange={([v]) => seekTo(v)}
            max={100}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">{formatTime(currentTime)}</span>
            <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 w-28">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <Slider value={[volume]} onValueChange={([v]) => setVolume(v)} max={100} step={1} />
        </div>
      </div>

      {!loaded && !error && (
        <p className="text-xs text-muted-foreground text-center animate-pulse">Loading audio...</p>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          size="lg"
          onClick={async () => {
            try {
              const res = await fetch(track.audioUrl, { mode: "cors" });
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              const blob = await res.blob();
              const mp3Blob = blob.type === "audio/mpeg" ? blob : new Blob([blob], { type: "audio/mpeg" });
              const url = URL.createObjectURL(mp3Blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${track.title}.mp3`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            } catch (e) {
              console.error("Download failed, falling back to direct link:", e);
              const a = document.createElement("a");
              a.href = track.audioUrl;
              a.download = `${track.title}.mp3`;
              a.target = "_blank";
              a.rel = "noopener noreferrer";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
          }}
          className="gap-2 gradient-phonk text-primary-foreground glow-purple font-heading font-bold"
        >
          <Download className="w-5 h-5" /> Download MP3
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

      <p className="text-xs text-muted-foreground text-center">
        Demo mode — connect an API key in Settings for real AI generation
      </p>
    </div>
  );
};

export default AudioPlayer;
