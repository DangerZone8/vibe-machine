import { Volume2 } from "lucide-react";

interface SoundEnableOverlayProps {
  onEnable: () => void;
}

const SoundEnableOverlay = ({ onEnable }: SoundEnableOverlayProps) => {
  return (
    <button
      onClick={onEnable}
      className="fixed bottom-20 md:bottom-6 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full gradient-phonk glow-purple animate-pulse-glow text-primary-foreground font-heading text-xs tracking-wider shadow-2xl hover:scale-105 transition-transform"
    >
      <Volume2 className="w-4 h-4" />
      Tap to Enable Sound
    </button>
  );
};

export default SoundEnableOverlay;
