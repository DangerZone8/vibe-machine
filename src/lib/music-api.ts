import { supabase } from "@/integrations/supabase/client";

export type MusicType = "phonk" | "song";

export interface GenerationParams {
  mood: string;
  customPrompt?: string;
  bpm: number;
  length: number;
  intensity: number;
  vocalType: "male" | "female";
  musicType: MusicType;
  trendingTags?: string;
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
  musicType?: MusicType;
}

const PHONK_MOOD_PROMPTS: Record<string, string> = {
  chill: "slow dark drift phonk, rainy lo-fi atmosphere, melancholic Memphis samples, slow 808 hits, gloomy reverb tails",
  hype: "aggressive high-energy phonk, hard-slamming 808s, fast trap snares, adrenaline rush, nitro drop, war drums",
  sad: "emotional sad phonk, minor key piano chops, dark rainy night drive, heartbreak energy, heavy reverb bass",
  rage: "ultra aggressive rage phonk, distorted fuzz bass, screaming synth stabs, mosh-pit energy, skull-crushing drops",
  dreamy: "dreamy ethereal phonk, floating pads, cosmic lo-fi reverb, nostalgic Memphis chops, slow rolling 808s",
  epic: "cinematic epic phonk, powerful build-ups, massive drops, drift race energy, triumphant horns over 808s",
  party: "bouncy party phonk, groovy cowbell riff, peak-hour club energy, bass-heavy groove, crowd-hyping drops",
};

const SONG_MOOD_PROMPTS: Record<string, string> = {
  chill: "chill R&B vibes, smooth vocal melodies, lo-fi bedroom pop feel, warm chords, laid-back groove",
  hype: "hard-hitting trap banger, catchy viral hook, high-energy anthem, festival-ready drop, crowd sing-along chorus",
  sad: "emotional ballad, heartfelt lyrics, minor key piano, vulnerable vocals, cinematic strings, tear-jerking bridge",
  rage: "dark aggressive rap anthem, gritty delivery, raw energy bars, trap production, bass-heavy chorus",
  dreamy: "dreamy indie pop, ethereal vocal layers, lush synth textures, hazy romantic atmosphere, floaty chorus",
  epic: "epic anthem, powerful soaring vocals, cinematic build, stadium chorus, goosebump-inducing drop",
  party: "viral party banger, infectious chorus hook, upbeat club energy, dance floor ready, ear-worm melody",
};

function buildPhonkPrompt(params: GenerationParams): string {
  const exactLength = Math.min(params.length, 180);
  const moodDesc = (params.customPrompt?.trim() || PHONK_MOOD_PROMPTS[params.mood.toLowerCase()] || params.mood).trim();
  const vocal = params.vocalType === "male" ? "gritty male Memphis rap" : "dark female chopped rap";
  const trendingPart = params.trendingTags
    ? ` Inspired by current trending styles: ${params.trendingTags}. Make it sound fresh and viral for 2026.`
    : "";

  return `Completely original heavy goated phonk track, totally different beat and structure every time. Heavy distorted slamming 808 bass, loud rhythmic cowbell melody, chopped ${vocal} vocals with short punchy words and repeated hooks, heavy real drops, multiple fake-out drops, intense build-ups, dramatic silences, crazy transitions, hypnotic bounce, dark lo-fi atmosphere. ${moodDesc}.${trendingPart} Nasty viral reel/drift/gym energy. BPM: ${params.bpm}. Intensity: ${params.intensity}/10. Max ${exactLength} seconds.`;
}

function buildSongPrompt(params: GenerationParams): string {
  const exactLength = Math.min(params.length, 180);
  const moodDesc = (params.customPrompt?.trim() || SONG_MOOD_PROMPTS[params.mood.toLowerCase()] || params.mood).trim();
  const vocal = params.vocalType === "male" ? "male vocalist" : "female vocalist";
  const trendingPart = params.trendingTags
    ? ` Inspired by current trending styles: ${params.trendingTags}. Make it sound fresh and viral for 2026.`
    : "";

  return `Original viral-ready song with full structure: intro, verse, pre-chorus, massive hook chorus, bridge, outro. Catchy earworm melody, memorable hook lyrics, professional radio-quality production. ${vocal} with expressive delivery. ${moodDesc}.${trendingPart} Perfect for reels, shorts, TikTok, and content creators. BPM: ${params.bpm}. Intensity: ${params.intensity}/10. Max ${exactLength} seconds.`;
}

export function buildPrompt(params: GenerationParams): string {
  return params.musicType === "song" ? buildSongPrompt(params) : buildPhonkPrompt(params);
}

const PHONK_TITLES: Record<string, string[]> = {
  chill: ["Rainy Night Drift", "Midnight Cruise", "3AM Reverie", "Neon Rain"],
  hype: ["Street Fury", "Nitro Rush", "Full Send", "Turbo Demon"],
  sad: ["Broken Dreams", "Last Drive", "Faded Memory", "Empty Streets"],
  rage: ["War Machine", "Blood Moon", "No Mercy", "Chaos Engine"],
  dreamy: ["Cloud Nine", "Starlight Drift", "Lucid Highways", "Ethereal"],
  epic: ["Final Boss", "Victory Lap", "Unstoppable", "Legend Mode"],
  party: ["Club Demon", "Bass Drop God", "Night Out", "Bounce Season"],
};

const SONG_TITLES: Record<string, string[]> = {
  chill: ["Easy On Me", "Golden Hour", "Slow Down", "Stay A While"],
  hype: ["Run It Up", "No Ceiling", "Top Flight", "Level Up"],
  sad: ["Miss You More", "Falling Apart", "Without You", "Lose Everything"],
  rage: ["On Sight", "No Filter", "Wild Out", "Pressure"],
  dreamy: ["In Your Eyes", "Float Away", "Dreamscape", "Soft Landing"],
  epic: ["Rise Again", "Born For This", "Unbreakable", "The Summit"],
  party: ["Lights Up", "All Night", "Vibe Check", "Feel It"],
};

export function generateTitle(mood: string, musicType: MusicType = "phonk"): string {
  const titles = musicType === "song" ? SONG_TITLES : PHONK_TITLES;
  const pool = titles[mood.toLowerCase()] || ["Fire Track", "Banger", "Certified Hit"];
  const base = pool[Math.floor(Math.random() * pool.length)];
  return musicType === "phonk" ? `${base} [Phonk]` : `${base} [Song]`;
}

export async function generateTrackFromAPI(
  params: GenerationParams,
): Promise<{ audioUrl: string; duration: number } | null> {
  const exactLength = Math.min(params.length, 180);
  const prompt = buildPrompt({ ...params, length: exactLength });
  const title = generateTitle(params.mood, params.musicType);

  console.log("[PhonkVibe] Generating via Suno:", { musicType: params.musicType, prompt: prompt.slice(0, 120) });

  try {
    const { data, error } = await supabase.functions.invoke("generate-suno", {
      body: {
        prompt,
        mood: params.mood,
        customPrompt: params.customPrompt,
        length: exactLength,
        vocalType: params.vocalType,
        musicType: params.musicType,
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
