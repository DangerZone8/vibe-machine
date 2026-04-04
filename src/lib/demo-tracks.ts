import type { GeneratedTrack } from "./music-api";

// Reliable public test MP3s — these always work cross-origin
export const DEMO_TRACKS: GeneratedTrack[] = [
  {
    id: "demo-chill-1",
    title: "Neon Drift Demo [Chill Phonk]",
    mood: "chill",
    tags: ["chill", "lo-fi", "drift"],
    audioUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
    duration: 120,
    bpm: 100,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-hype-1",
    title: "Party Cowbell Demo [Hype Phonk]",
    mood: "hype",
    tags: ["hype", "aggressive", "808"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 95,
    bpm: 140,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-sad-1",
    title: "Rainy Chill Demo [Sad Phonk]",
    mood: "sad",
    tags: ["sad", "emotional", "piano"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 130,
    bpm: 85,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-party-1",
    title: "Neon Club Demo [Party Phonk]",
    mood: "party",
    tags: ["party", "bounce", "bass"],
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 110,
    bpm: 128,
    createdAt: new Date().toISOString(),
  },
];
