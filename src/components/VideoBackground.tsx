import { useRef, useEffect, useState } from "react";
import { getMoodOverlayClass } from "@/lib/video-backgrounds";

interface VideoBackgroundProps {
  videoUrl: string | null;
  mood: string;
  audioElement?: HTMLAudioElement | null;
  active: boolean;
}

const VideoBackground = ({ videoUrl, mood, audioElement, active }: VideoBackgroundProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [beatPulse, setBeatPulse] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number>(0);

  // Video playback control
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !videoUrl) return;

    vid.src = videoUrl;
    vid.load();

    if (active) {
      vid.play().catch(() => {
        // Autoplay blocked — user interaction needed
      });
    } else {
      vid.pause();
    }
  }, [videoUrl, active]);

  // Beat reactivity via Web Audio API
  useEffect(() => {
    if (!audioElement || !active) {
      cancelAnimationFrame(rafRef.current);
      setBeatPulse(0);
      return;
    }

    try {
      if (!ctxRef.current) {
        ctxRef.current = new AudioContext();
      }
      const ctx = ctxRef.current;

      if (!sourceRef.current) {
        sourceRef.current = ctx.createMediaElementSource(audioElement);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        sourceRef.current.connect(analyser);
        analyser.connect(ctx.destination);
        analyserRef.current = analyser;
      }

      const analyser = analyserRef.current!;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        // Focus on bass frequencies (first 10 bins)
        const bass = dataArray.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
        const normalized = Math.min(bass / 200, 1);
        setBeatPulse(normalized);
        rafRef.current = requestAnimationFrame(tick);
      };

      tick();
    } catch (e) {
      console.log("Web Audio API not available for beat reactivity:", e);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [audioElement, active]);

  const overlayClass = getMoodOverlayClass(mood);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {videoUrl ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted
          playsInline
          preload="auto"
        />
      ) : (
        /* CSS fallback: animated neon rain / particles */
        <div className="absolute inset-0 bg-background">
          <div className="absolute inset-0 opacity-30">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 bg-primary/60 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  height: `${20 + Math.random() * 60}px`,
                  top: `-${Math.random() * 100}px`,
                  animation: `rainDrop ${1 + Math.random() * 2}s linear ${Math.random() * 2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Mood-tinted overlay */}
      <div className={`absolute inset-0 ${overlayClass} transition-colors duration-1000`} />

      {/* Darkening overlay for readability */}
      <div className="absolute inset-0 bg-background/60" />

      {/* Beat-reactive brightness pulse */}
      <div
        className="absolute inset-0 bg-primary/10 pointer-events-none transition-opacity duration-75"
        style={{ opacity: beatPulse * 0.4 }}
      />

      {/* Gradient fade at bottom for content readability */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default VideoBackground;
