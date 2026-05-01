import { Flame } from "lucide-react";
import { useTrendingTracks } from "@/hooks/use-trending-tracks";

const TrendingTracks = () => {
  const { tracks, loading } = useTrendingTracks();

  if (!loading && tracks.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-primary" />
        <span className="font-heading text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          Trending Tracks
        </span>
        <span className="text-[10px] text-muted-foreground/50 ml-1">via Last.fm · updated daily</span>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 pb-2 scrollbar-thin">
        <div className="flex gap-3 min-w-min">
          {loading
            ? [...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="shrink-0 w-56 h-24 rounded-xl bg-muted/30 animate-pulse"
                />
              ))
            : tracks.map((t, i) => (
                <div
                  key={`${t.artist}-${t.name}-${i}`}
                  className="shrink-0 w-56 rounded-xl glass neon-border p-3 space-y-2 hover:glow-purple transition-all"
                >
                  <div className="flex items-start gap-2">
                    <span className="font-heading text-xs text-primary font-bold w-6 shrink-0">
                      #{i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{t.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{t.artist}</p>
                    </div>
                  </div>
                  {t.tags.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {t.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary capitalize"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingTracks;
