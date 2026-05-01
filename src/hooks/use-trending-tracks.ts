import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TrendingTrack {
  name: string;
  artist: string;
  tags: string[];
}

const CACHE_KEY = "phonkvibe_trending_tracks_v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export function useTrendingTracks() {
  const [tracks, setTracks] = useState<TrendingTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed?.ts && Date.now() - parsed.ts < CACHE_TTL_MS && Array.isArray(parsed.tracks)) {
            if (!cancelled) {
              setTracks(parsed.tracks);
              setLoading(false);
            }
            return;
          }
        }
      } catch {/* ignore cache errors */}

      try {
        const { data, error } = await supabase.functions.invoke("fetch-trending-tracks", { body: {} });
        if (error) throw error;
        const list: TrendingTrack[] = data?.tracks ?? [];
        if (!cancelled) {
          setTracks(list);
          setLoading(false);
        }
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), tracks: list }));
      } catch (e) {
        console.warn("[trending-tracks] failed:", e);
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { tracks, loading };
}
