import { useState } from "react";
import { Compass } from "lucide-react";
import TrackCard from "@/components/TrackCard";
import AudioPlayer from "@/components/AudioPlayer";
import { DEMO_TRACKS } from "@/lib/demo-tracks";
import type { GeneratedTrack } from "@/lib/music-api";

const DiscoverPage = () => {
  const [activeTrack, setActiveTrack] = useState<GeneratedTrack | null>(null);

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8 space-y-6">
      <div className="flex items-center gap-3">
        <Compass className="w-6 h-6 text-primary" />
        <h1 className="font-heading text-2xl font-bold tracking-wider">Discover</h1>
      </div>
      <p className="text-sm text-muted-foreground">
        Explore community-generated phonk beats for inspiration
      </p>

      {activeTrack && (
        <AudioPlayer track={activeTrack} compact />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {DEMO_TRACKS.map((track) => (
          <TrackCard key={track.id} track={track} onPlay={setActiveTrack} />
        ))}
      </div>
    </div>
  );
};

export default DiscoverPage;
