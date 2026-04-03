import { useState } from "react";
import { Library as LibraryIcon, Music2 } from "lucide-react";
import TrackCard from "@/components/TrackCard";
import AudioPlayer from "@/components/AudioPlayer";
import type { GeneratedTrack } from "@/lib/music-api";

const LibraryPage = () => {
  const [tracks] = useState<GeneratedTrack[]>([]);
  const [activeTrack, setActiveTrack] = useState<GeneratedTrack | null>(null);

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8 space-y-6">
      <div className="flex items-center gap-3">
        <LibraryIcon className="w-6 h-6 text-primary" />
        <h1 className="font-heading text-2xl font-bold tracking-wider">My Library</h1>
      </div>

      {activeTrack && (
        <AudioPlayer track={activeTrack} compact />
      )}

      {tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
            <Music2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-lg">No tracks yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Generate your first phonk beat and save it here
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} onPlay={setActiveTrack} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
