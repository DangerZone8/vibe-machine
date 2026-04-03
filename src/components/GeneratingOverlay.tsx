import { Music, Loader2, Film } from "lucide-react";

const messages = [
  "Farming new aura... generating goated phonk + video",
  "Drift cooking up a nasty beat...",
  "Loading the 808s & matching visuals...",
  "Chopping Memphis samples...",
  "Adding cowbell sauce...",
  "Distorting the bass...",
  "Syncing video vibes...",
  "Cooking something fire...",
];

const GeneratingOverlay = () => {
  const msg = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center">
      <div className="text-center space-y-6 animate-slide-up">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 rounded-full gradient-phonk animate-pulse-glow" />
          <div className="absolute inset-2 rounded-full bg-background flex items-center justify-center">
            <div className="flex items-center gap-1">
              <Music className="w-6 h-6 text-primary animate-bounce" />
              <Film className="w-5 h-5 text-secondary animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-heading text-lg font-bold text-glow-purple">{msg}</h2>
          <p className="text-sm text-muted-foreground">Generating your phonk track + matching video...</p>
        </div>

        <div className="flex justify-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1.5 h-8 rounded-full bg-primary/60"
              style={{
                animation: `pulse 1s ease-in-out ${i * 0.15}s infinite`,
                transformOrigin: "bottom",
              }}
            />
          ))}
        </div>

        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin mx-auto" />
      </div>
    </div>
  );
};

export default GeneratingOverlay;
