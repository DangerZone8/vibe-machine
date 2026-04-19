import { Music, Loader as Loader2 } from "lucide-react";
import type { MusicType } from "@/lib/music-api";

const PHONK_MESSAGES = [
  "Drift cooking up a nasty beat...",
  "Loading the 808s...",
  "Chopping Memphis samples...",
  "Adding cowbell sauce...",
  "Distorting the bass...",
  "Cooking something fire...",
  "Slamming the 808s...",
  "Building the drop...",
];

const SONG_MESSAGES = [
  "Writing the hook...",
  "Laying down vocals...",
  "Crafting the chorus...",
  "Building the vibe...",
  "Mixing the track...",
  "Making it viral...",
  "Tuning the melody...",
  "Dropping the bridge...",
];

interface GeneratingOverlayProps {
  musicType?: MusicType;
}

const GeneratingOverlay = ({ musicType = "phonk" }: GeneratingOverlayProps) => {
  const messages = musicType === "phonk" ? PHONK_MESSAGES : SONG_MESSAGES;
  const msg = messages[Math.floor(Math.random() * messages.length)];
  const isPhonk = musicType === "phonk";

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center">
      <div className="text-center space-y-6 animate-slide-up">
        <div className="relative mx-auto w-24 h-24">
          <div
            className={`absolute inset-0 rounded-full animate-pulse-glow ${
              isPhonk ? "gradient-phonk" : "bg-gradient-to-br from-sky-500 to-teal-400"
            }`}
          />
          <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
            <Music className="w-8 h-8 text-primary animate-bounce" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-lg font-bold text-glow-purple">{msg}</h2>
          <p className="text-sm text-muted-foreground">
            {isPhonk ? "Generating your phonk track..." : "Generating your song..."}
          </p>
          <p className="text-xs text-muted-foreground/60">This takes 30–90 seconds — hang tight</p>
        </div>
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin mx-auto" />
      </div>
    </div>
  );
};

export default GeneratingOverlay;
