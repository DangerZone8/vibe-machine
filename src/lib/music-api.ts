import { supabase } from "@/integrations/supabase/client";

export interface GenerationParams {
  mood: string;
  customPrompt?: string;
  bpm: number;
  length: number;
  intensity: number;
  vocalType: "male" | "female";
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
  const exactLength = Math.min(params.length, 180);
  const moodDesc = (params.customPrompt?.trim() || MOOD_PROMPTS[params.mood.toLowerCase()] || params.mood).trim();
  const vocal = params.vocalType === "male" ? "Male" : "Female";

  return `Completely original heavy goated phonk track, totally different beat and structure every time, heavy distorted slamming 808 bass, loud rhythmic cowbell melody, chopped Memphis rap vocals with a few gritty words and repeated hooks (${vocal} voice), heavy real drops, multiple fake drops, intense build-ups, dramatic pauses, crazy transitions, hypnotic bounce, dark lo-fi atmosphere, ${moodDesc}, nasty viral reel/drift/gym energy, max ${exactLength} seconds`;
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
 * Generate a real track via the Suno-powered edge function.
 * Returns { audioUrl, duration } or null on failure (caller falls back to demo).
 */
export async function generateTrackFromAPI(
  params: GenerationParams,
): Promise<{ audioUrl: string; duration: number } | null> {
  const exactLength = Math.min(params.length, 180);
  const prompt = buildPrompt({ ...params, length: exactLength });
  const title = generateTitle(params.mood);

  console.log("[PhonkVibe] Generating via Suno edge fn:", { prompt, length: exactLength });

  try {
    const { data, error } = await supabase.functions.invoke("generate-suno", {
      body: {
        prompt,
        length: exactLength,
        vocalType: params.vocalType,
        title,
      },
    });

    if (error) {
      console.error("[PhonkVibe] Edge function error:", error);
      return null;
    }
    if (!data?.audioUrl) {
      console.error("[PhonkVibe] No audioUrl in response:", data);
      return null;
    }

    return { audioUrl: data.audioUrl, duration: Number(data.duration) || exactLength };
  } catch (err) {
    console.error("[PhonkVibe] Generation failed:", err);
    return null;
  }
}
