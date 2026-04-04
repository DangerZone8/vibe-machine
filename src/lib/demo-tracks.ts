import type { GeneratedTrack } from "./music-api";

// Public royalty-free MP3s with actual beats/bass — not beeps
export const DEMO_TRACKS: GeneratedTrack[] = [
  {
    id: "demo-chill-1",
    title: "Heavy Cowbell Drift Demo [Chill Phonk]",
    mood: "chill",
    tags: ["chill", "lo-fi", "drift", "cowbell"],
    audioUrl: "https://cdn.pixabay.com/audio/2022/10/25/audio_33f2704e4f.mp3",
    duration: 120,
    bpm: 100,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-hype-1",
    title: "Aggressive 808 Phonk Demo [Hype Phonk]",
    mood: "hype",
    tags: ["hype", "aggressive", "808", "cowbell"],
    audioUrl: "https://cdn.pixabay.com/audio/2023/07/19/audio_e55e6e8f0c.mp3",
    duration: 95,
    bpm: 140,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-sad-1",
    title: "Rainy Chill Demo [Sad Phonk]",
    mood: "sad",
    tags: ["sad", "emotional", "dark"],
    audioUrl: "https://cdn.pixabay.com/audio/2023/09/25/audio_0cb5da8685.mp3",
    duration: 130,
    bpm: 85,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-party-1",
    title: "Neon Club Bounce Demo [Party Phonk]",
    mood: "party",
    tags: ["party", "bounce", "bass"],
    audioUrl: "https://cdn.pixabay.com/audio/2024/01/10/audio_d0e93982e5.mp3",
    duration: 110,
    bpm: 128,
    createdAt: new Date().toISOString(),
  },
];
