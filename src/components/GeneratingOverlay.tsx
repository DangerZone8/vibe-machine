import { Music, Loader2 } from "lucide-react";

const messages = [
  "Drift cooking up a nasty beat...",
  "Loading the 808s...",
  "Chopping Memphis samples...",
  "Adding cowbell sauce...",
  "Distorting the bass...",
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
            <Music className="w-8 h-8 text-primary animate-bounce" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="font-heading text-lg font-bold text-glow-purple">{msg}</h2>
          <p className="text-sm text-muted-foreground">Generating your phonk track...</p>
        </div>
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin mx-auto" />
      </div>
    </div>
  );
};

export default GeneratingOverlay;
