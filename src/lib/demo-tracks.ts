import type { GeneratedTrack } from "./music-api";

export const DEMO_TRACKS: GeneratedTrack[] = [
  {
    id: "demo-neon-drift",
    title: "Neon Drift Demo",
    mood: "chill",
    tags: ["chill", "drift", "demo"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 120,
    bpm: 100,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-cowbell-hype",
    title: "Cowbell Hype Demo",
    mood: "hype",
    tags: ["hype", "cowbell", "demo"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 110,
    bpm: 140,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-heavy-beat",
    title: "Heavy Beat Demo",
    mood: "sad",
    tags: ["heavy", "beat", "demo"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    duration: 130,
    bpm: 90,
    createdAt: new Date().toISOString(),
  },
];
