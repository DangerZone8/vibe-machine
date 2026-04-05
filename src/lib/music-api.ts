export interface GenerationParams {
  mood: string;
  customPrompt?: string;
  bpm: number;
  length: number;
  intensity: number;
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
  const moodDesc = (params.customPrompt?.trim() || MOOD_PROMPTS[params.mood.toLowerCase()] || params.mood).trim();

  return `Create a completely original heavy phonk track. Heavy distorted slamming 808 bass, loud prominent cowbell melody, chopped & screwed Memphis rap vocal samples with actual gritty words, phrases, short rap lines or spoken hooks (male or female voice, aggressive/dark tone), punchy kicks, gritty snares, dark lo-fi pads, hypnotic bounce. ${moodDesc}. High production, addictive, perfect for reels and drifts. Allow vocals/words.`;
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

/**
 * Call the unified music generation API (supports Suno/Udio models).
 * Returns the audio URL on success, or null if no API key / error.
 */
export async function generateTrackFromAPI(params: GenerationParams): Promise<string | null> {
  const apiKey = localStorage.getItem("phonkvibe-api-key");
  if (!apiKey) {
    console.log("[PhonkVibe] No API key set — running in demo mode");
    return null;
  }

  const prompt = buildPrompt(params);
  console.log("[PhonkVibe] Generating with prompt:", prompt);

  try {
    // Unified API endpoint (udioapi.pro-style)
    const res = await fetch("https://udioapi.pro/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        duration: params.length,
        bpm: params.bpm,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[PhonkVibe] API error ${res.status}:`, errText);
      return null;
    }

    const data = await res.json();
    const audioUrl = data.audio_url || data.url || data.audioUrl;
    if (audioUrl) {
      console.log("[PhonkVibe] Generated audio URL:", audioUrl);
      return audioUrl;
    }

    console.error("[PhonkVibe] No audio URL in API response:", data);
    return null;
  } catch (err) {
    console.error("[PhonkVibe] Generation failed:", err);
    return null;
  }
}
