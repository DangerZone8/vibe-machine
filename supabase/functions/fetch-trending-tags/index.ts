import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const LASTFM_API_KEY = Deno.env.get("LASTFM_API_KEY");
const LASTFM_BASE = "https://ws.audioscrobbler.com/2.0/";
const CRON_SECRET = Deno.env.get("CRON_SECRET");

const TAG_TO_MOOD: Record<string, string> = {
  "hip-hop": "hype",
  "rap": "hype",
  "trap": "hype",
  "drill": "hype",
  "phonk": "hype",
  "hype": "hype",
  "bass": "hype",
  "edm": "party",
  "dance": "party",
  "pop": "party",
  "club": "party",
  "party": "party",
  "electronic": "party",
  "house": "party",
  "lo-fi": "chill",
  "lofi": "chill",
  "chill": "chill",
  "ambient": "chill",
  "jazz": "chill",
  "soul": "chill",
  "indie": "chill",
  "rnb": "chill",
  "r&b": "chill",
  "sad": "sad",
  "emo": "sad",
  "melancholic": "sad",
  "acoustic": "sad",
  "ballad": "sad",
  "alternative": "sad",
  "rock": "rage",
  "metal": "rage",
  "punk": "rage",
  "aggressive": "rage",
  "hardcore": "rage",
  "rage": "rage",
  "cinematic": "epic",
  "orchestral": "epic",
  "epic": "epic",
  "film": "epic",
  "classical": "epic",
  "dreamy": "dreamy",
  "dream": "dreamy",
  "psychedelic": "dreamy",
  "experimental": "dreamy",
  "ethereal": "dreamy",
};

function mapTagToMood(tag: string): string {
  const lower = tag.toLowerCase().trim();
  for (const [key, mood] of Object.entries(TAG_TO_MOOD)) {
    if (lower.includes(key)) return mood;
  }
  return "hype";
}

async function fetchTopTracks(): Promise<string[]> {
  const url = `${LASTFM_BASE}?method=chart.gettoptracks&api_key=${LASTFM_API_KEY}&format=json&limit=50`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  const tracks = json?.tracks?.track ?? [];

  const tagSet = new Set<string>();
  for (const track of tracks.slice(0, 20)) {
    const artist = track?.artist?.name ?? "";
    const name = track?.name ?? "";
    if (artist) tagSet.add(artist.toLowerCase().split(" ")[0]);
    const words = name.toLowerCase().split(/\s+/);
    for (const w of words) {
      if (w.length > 3 && TAG_TO_MOOD[w]) tagSet.add(w);
    }
  }
  return [...tagSet].slice(0, 30);
}

async function fetchTagsForGenre(genre: string): Promise<string[]> {
  const url = `${LASTFM_BASE}?method=tag.gettoptracks&tag=${encodeURIComponent(genre)}&api_key=${LASTFM_API_KEY}&format=json&limit=10`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    const tracks = json?.tracks?.track ?? [];
    return tracks.slice(0, 5).map((t: any) => (t?.name ?? "").toLowerCase().split(" ")[0]).filter(Boolean);
  } catch {
    return [];
  }
}

const GENRE_SEEDS = [
  "hip-hop", "trap", "phonk", "lo-fi", "pop", "rnb",
  "edm", "drill", "soul", "alternative", "electronic"
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Require shared cron secret to prevent public abuse of service-role mutations
  if (!CRON_SECRET || req.headers.get("x-cron-secret") !== CRON_SECRET) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  if (!LASTFM_API_KEY) {
    return new Response(
      JSON.stringify({ error: "LASTFM_API_KEY not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const fetchedAt = new Date().toISOString();
    const tagRows: { tag: string; mood_category: string; score: number; fetched_at: string }[] = [];

    const topTags = await fetchTopTracks();
    topTags.forEach((tag, i) => {
      tagRows.push({ tag, mood_category: mapTagToMood(tag), score: 100 - i, fetched_at: fetchedAt });
    });

    const genreResults = await Promise.allSettled(
      GENRE_SEEDS.map((g) => fetchTagsForGenre(g))
    );

    genreResults.forEach((result, i) => {
      if (result.status === "fulfilled") {
        const genre = GENRE_SEEDS[i];
        result.value.forEach((tag, j) => {
          if (tag && tag.length > 2) {
            tagRows.push({ tag, mood_category: mapTagToMood(genre), score: 50 - j, fetched_at: fetchedAt });
          }
        });
      }
    });

    GENRE_SEEDS.forEach((genre, i) => {
      tagRows.push({ tag: genre, mood_category: mapTagToMood(genre), score: 80 - i * 5, fetched_at: fetchedAt });
    });

    const uniqueRows = tagRows.filter(
      (row, idx, arr) => arr.findIndex((r) => r.tag === row.tag) === idx && row.tag.length >= 2
    );

    const cutoff = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
    await supabase.from("trending_tags").delete().lt("fetched_at", cutoff);

    const { error } = await supabase.from("trending_tags").insert(uniqueRows);
    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, count: uniqueRows.length, fetchedAt }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("fetch-trending-tags error:", err);
    return new Response(
      JSON.stringify({ error: String(err?.message || err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
