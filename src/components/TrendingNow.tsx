import { TrendingUp } from "lucide-react";
import type { TrendingTag } from "@/hooks/use-trending-tags";

interface TrendingNowProps {
  tags: TrendingTag[];
  loading: boolean;
}

const MOOD_COLORS: Record<string, string> = {
  hype: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  party: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  chill: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  sad: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  rage: "bg-red-500/15 text-red-400 border-red-500/30",
  dreamy: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  epic: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const TrendingNow = ({ tags, loading }: TrendingNowProps) => {
  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-muted-foreground animate-pulse" />
          <span className="font-heading text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Trending Now
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-6 w-16 rounded-full bg-muted/40 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!tags.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-3.5 h-3.5 text-primary" />
        <span className="font-heading text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Trending Now
        </span>
        <span className="text-[10px] text-muted-foreground/50 ml-1">via Last.fm</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t.tag}
            className={`text-[11px] px-2.5 py-1 rounded-full border font-medium capitalize transition-all ${
              MOOD_COLORS[t.mood_category] ?? "bg-muted/30 text-muted-foreground border-border/40"
            }`}
          >
            {t.tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TrendingNow;
