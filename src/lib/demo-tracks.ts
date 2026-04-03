import type { GeneratedTrack } from "./music-api";

// Royalty-free phonk-style demo audio from public sources
// These are short, loopable, phonk-adjacent beats
export const DEMO_AUDIO_URLS = {
  chill: "https://cdn.pixabay.com/audio/2024/11/29/audio_7a07b6abff.mp3", // chill dark beat
  hype: "https://cdn.pixabay.com/audio/2024/09/10/audio_6e4e187eb3.mp3", // aggressive beat
  sad: "https://cdn.pixabay.com/audio/2024/10/16/audio_d15db4e2df.mp3", // sad emotional
  party: "https://cdn.pixabay.com/audio/2024/08/27/audio_97a48e7053.mp3", // bouncy party
};

export const DEMO_TRACKS: GeneratedTrack[] = [
  {
    id: "demo-chill-1",
    title: "Midnight Rain Drift [Chill Phonk]",
    mood: "chill",
    tags: ["chill", "lo-fi", "drift", "rain"],
    audioUrl: DEMO_AUDIO_URLS.chill,
    duration: 120,
    bpm: 100,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-hype-1",
    title: "Street Fury Turbo [Hype Phonk]",
    mood: "hype",
    tags: ["hype", "aggressive", "808", "turbo"],
    audioUrl: DEMO_AUDIO_URLS.hype,
    duration: 95,
    bpm: 140,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-sad-1",
    title: "Broken Dreams Drive [Sad Phonk]",
    mood: "sad",
    tags: ["sad", "emotional", "piano", "night"],
    audioUrl: DEMO_AUDIO_URLS.sad,
    duration: 130,
    bpm: 85,
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-party-1",
    title: "Neon Club Bounce [Party Phonk]",
    mood: "party",
    tags: ["party", "bounce", "club", "bass"],
    audioUrl: DEMO_AUDIO_URLS.party,
    duration: 110,
    bpm: 128,
    createdAt: new Date().toISOString(),
  },
];
