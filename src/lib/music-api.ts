export interface GenerationParams {
  mood: string;
  customPrompt?: string;
  bpm: number;
  length: number; // seconds
  intensity: number; // 1-10
  vocalChops: boolean;
}

export interface GeneratedTrack {
  id: string;
  title: string;
  mood: string;
  tags: string[];
  audioUrl: string;
  duration: number;
  bpm: number;
  createdAt: string;
}

const MOOD_PROMPTS: Record<string, string> = {
  chill: "relaxed lo-fi phonk, rainy atmosphere, slow drift vibes, melancholic melodies",
  hype: "aggressive high-energy phonk, hard-hitting 808s, fast tempo, adrenaline rush",
  sad: "emotional sad phonk, melancholic piano, dark rainy night drive, heartbreak vibes",
  rage: "ultra aggressive phonk, distorted bass, angry energy, intense drops, war drums",
  dreamy: "dreamy ethereal phonk, floating pads, cosmic atmosphere, nostalgic reverb",
  epic: "cinematic phonk, powerful build-ups, epic drops, drift race energy, triumphant",
  party: "bouncy party phonk, groovy cowbell patterns, club energy, bass-heavy bangers",
};

export function buildPrompt(params: GenerationParams): string {
  const moodDesc = MOOD_PROMPTS[params.mood.toLowerCase()] || params.mood;
  const customPart = params.customPrompt ? `, ${params.customPrompt}` : "";
  const vocalPart = params.vocalChops ? ", chopped vocal samples" : ", instrumental only";
  const intensityDesc = params.intensity > 7 ? "extremely intense" : params.intensity > 4 ? "moderate energy" : "chill laid-back";

  return `Create a completely original new phonk beat, never heard before, heavy distorted 808 bass, signature phonk cowbell melody, chopped & screwed Memphis-style samples, dark atmospheric pads, ${moodDesc}${customPart}, ${intensityDesc}, ${params.bpm} BPM${vocalPart}, high production quality, no copyright samples, fresh and unique, perfect for YouTube reels and Instagram content`;
}

export function generateTitle(mood: string): string {
  const adjectives: Record<string, string[]> = {
    chill: ["Rainy Night", "Midnight", "3AM Cruise", "Neon Rain"],
    hype: ["Street Fury", "Nitro Rush", "Full Send", "Turbo"],
    sad: ["Broken Dreams", "Last Drive", "Faded Memory", "Empty Streets"],
    rage: ["War Machine", "Blood Moon", "No Mercy", "Chaos"],
    dreamy: ["Cloud Nine", "Starlight", "Lucid", "Ethereal"],
    epic: ["Final Boss", "Victory Lap", "Unstoppable", "Legend"],
    party: ["Club Demon", "Bass Drop", "Night Out", "Bounce"],
  };

  const suffixes = ["Drift", "Phonk", "Beat", "Vibe"];
  const moodAdj = adjectives[mood.toLowerCase()] || ["Custom"];
  const adj = moodAdj[Math.floor(Math.random() * moodAdj.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const moodTag = mood.charAt(0).toUpperCase() + mood.slice(1);

  return `${adj} ${suffix} [${moodTag} Phonk]`;
}

// Demo tracks moved to src/lib/demo-tracks.ts
