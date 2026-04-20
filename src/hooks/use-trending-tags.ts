import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TrendingTag {
  tag: string;
  mood_category: string;
  score: number;
}

export function useTrendingTags(mood?: string) {
  const [tags, setTags] = useState<TrendingTag[]>([]);
  const [allTags, setAllTags] = useState<TrendingTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const cutoff = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
      const { data } = await (supabase as any)
        .from("trending_tags")
        .select("tag, mood_category, score")
        .gte("fetched_at", cutoff)
        .order("score", { ascending: false })
        .limit(50);

      const rows = (data ?? []) as TrendingTag[];
      setAllTags(rows);
      setLoading(false);
    }
    fetch();
  }, []);

  useEffect(() => {
    if (!mood) {
      setTags(allTags.slice(0, 10));
      return;
    }
    const filtered = allTags.filter((t) => t.mood_category === mood);
    setTags(filtered.length >= 3 ? filtered.slice(0, 8) : allTags.slice(0, 8));
  }, [mood, allTags]);

  function getTagsForPrompt(mood: string): string {
    const filtered = allTags.filter((t) => t.mood_category === mood).slice(0, 5);
    const fallback = allTags.slice(0, 5);
    const chosen = filtered.length >= 2 ? filtered : fallback;
    return chosen.map((t) => t.tag).join(", ");
  }

  return { tags, allTags, loading, getTagsForPrompt };
}
