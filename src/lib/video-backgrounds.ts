// Mood-matched video backgrounds using free Pixabay/Pexels video URLs
// These are royalty-free video loops for each mood category

export interface MoodVideo {
  mood: string;
  keywords: string[];
  videos: string[];
}

// Public domain / CC0 video URLs from Pixabay CDN
const MOOD_VIDEOS: MoodVideo[] = [
  {
    mood: "chill",
    keywords: ["chill", "rain", "lo-fi", "relax", "calm", "mellow", "nostalgic"],
    videos: [
      "https://cdn.pixabay.com/video/2024/04/10/207391-931556498_large.mp4", // rainy city night
      "https://cdn.pixabay.com/video/2023/10/07/183921-872411498_large.mp4", // neon rain
    ],
  },
  {
    mood: "hype",
    keywords: ["hype", "energy", "turbo", "fast", "fire", "lit", "pump"],
    videos: [
      "https://cdn.pixabay.com/video/2023/08/28/178164-859092498_large.mp4", // neon lights
      "https://cdn.pixabay.com/video/2024/02/10/200224-912176498_large.mp4", // city lights
    ],
  },
  {
    mood: "sad",
    keywords: ["sad", "lonely", "heartbreak", "cry", "depressed", "melancholy", "dark"],
    videos: [
      "https://cdn.pixabay.com/video/2020/07/30/45602-445222781_large.mp4", // rain on window
      "https://cdn.pixabay.com/video/2021/04/20/71804-540711663_large.mp4", // foggy road
    ],
  },
  {
    mood: "rage",
    keywords: ["rage", "angry", "aggressive", "war", "destroy", "chaos", "fury"],
    videos: [
      "https://cdn.pixabay.com/video/2022/07/21/125037-731836498_large.mp4", // dark tunnel
      "https://cdn.pixabay.com/video/2023/11/13/188924-884896498_large.mp4", // red lights
    ],
  },
  {
    mood: "dreamy",
    keywords: ["dreamy", "dream", "float", "cloud", "ethereal", "space", "cosmic"],
    videos: [
      "https://cdn.pixabay.com/video/2022/03/12/110566-688453498_large.mp4", // particles
      "https://cdn.pixabay.com/video/2021/08/20/86129-588803373_large.mp4", // nebula
    ],
  },
  {
    mood: "epic",
    keywords: ["epic", "cinematic", "victory", "boss", "legend", "power", "drift", "car", "drive"],
    videos: [
      "https://cdn.pixabay.com/video/2023/06/12/167007-835181498_large.mp4", // city skyline
      "https://cdn.pixabay.com/video/2024/01/18/196886-903678498_large.mp4", // night drive
    ],
  },
  {
    mood: "party",
    keywords: ["party", "happy", "dance", "club", "celebrate", "fun", "joy", "excited"],
    videos: [
      "https://cdn.pixabay.com/video/2019/12/26/30635-383703146_large.mp4", // party lights
      "https://cdn.pixabay.com/video/2022/09/07/130579-747091498_large.mp4", // colorful neon
    ],
  },
];

/**
 * Pick the best video URL for a given mood + optional custom description.
 * Falls back to a default neon tunnel if nothing matches.
 */
export function getVideoForMood(mood: string, customPrompt?: string): string {
  const text = `${mood} ${customPrompt || ""}`.toLowerCase();

  // First try keyword matching from custom prompt against all moods
  if (customPrompt) {
    for (const mv of MOOD_VIDEOS) {
      if (mv.keywords.some((kw) => text.includes(kw))) {
        return mv.videos[Math.floor(Math.random() * mv.videos.length)];
      }
    }
  }

  // Then match by mood directly
  const match = MOOD_VIDEOS.find((mv) => mv.mood === mood.toLowerCase());
  if (match) {
    return match.videos[Math.floor(Math.random() * match.videos.length)];
  }

  // Fallback
  return MOOD_VIDEOS[0].videos[0];
}

/**
 * Get a CSS class for the mood-based overlay tint
 */
export function getMoodOverlayClass(mood: string): string {
  const overlays: Record<string, string> = {
    chill: "bg-blue-900/40",
    hype: "bg-orange-900/40",
    sad: "bg-indigo-900/50",
    rage: "bg-red-900/50",
    dreamy: "bg-violet-900/40",
    epic: "bg-amber-900/30",
    party: "bg-pink-900/30",
  };
  return overlays[mood.toLowerCase()] || "bg-background/50";
}
