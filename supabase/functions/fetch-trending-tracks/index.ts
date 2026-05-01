const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LASTFM_API_KEY = Deno.env.get("LASTFM_API_KEY");
const LASTFM_BASE = "https://ws.audioscrobbler.com/2.0/";

interface TrendingTrack {
  name: string;
  artist: string;
  tags: string[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!LASTFM_API_KEY) {
      return new Response(
        JSON.stringify({ tracks: [], note: "LASTFM_API_KEY not configured" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const url = `${LASTFM_BASE}?method=chart.gettoptracks&api_key=${LASTFM_API_KEY}&format=json&limit=20`;
    const res = await fetch(url);
    if (!res.ok) {
      return new Response(
        JSON.stringify({ tracks: [], note: `Last.fm error ${res.status}` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const json = await res.json();
    const raw = json?.tracks?.track ?? [];

    const tracks: TrendingTrack[] = raw.slice(0, 20).map((t: any) => {
      const tags: string[] = (t?.toptags?.tag ?? [])
        .map((tag: any) => String(tag?.name ?? "").toLowerCase())
        .filter(Boolean)
        .slice(0, 3);
      return {
        name: String(t?.name ?? "Unknown"),
        artist: String(t?.artist?.name ?? "Unknown"),
        tags,
      };
    });

    return new Response(
      JSON.stringify({ tracks, fetchedAt: new Date().toISOString() }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          // Cache 24 hours
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      },
    );
  } catch (err: any) {
    console.error("fetch-trending-tracks error:", err);
    return new Response(
      JSON.stringify({ tracks: [], error: String(err?.message || err) }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
