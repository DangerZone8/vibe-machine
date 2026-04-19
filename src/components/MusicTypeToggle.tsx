import type { MusicType } from "@/lib/music-api";

interface MusicTypeToggleProps {
  value: MusicType;
  onChange: (v: MusicType) => void;
}

const MusicTypeToggle = ({ value, onChange }: MusicTypeToggleProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex rounded-xl p-1 bg-muted/40 border border-border/50 w-full sm:w-auto">
        <button
          onClick={() => onChange("phonk")}
          className={`relative z-10 flex-1 sm:flex-none flex flex-col items-center gap-1 px-6 py-3 rounded-lg text-sm font-heading font-bold tracking-wider transition-all duration-300 ${
            value === "phonk"
              ? "bg-gradient-to-br from-red-600 to-orange-500 text-white shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="text-lg">808</span>
          <span>PHONK</span>
          {value === "phonk" && (
            <span className="text-[9px] opacity-80 font-normal tracking-widest">Heavy 808s • Cowbells • Memphis</span>
          )}
        </button>

        <button
          onClick={() => onChange("song")}
          className={`relative z-10 flex-1 sm:flex-none flex flex-col items-center gap-1 px-6 py-3 rounded-lg text-sm font-heading font-bold tracking-wider transition-all duration-300 ${
            value === "song"
              ? "bg-gradient-to-br from-sky-500 to-teal-400 text-white shadow-lg"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="text-lg">MIC</span>
          <span>SONG</span>
          {value === "song" && (
            <span className="text-[9px] opacity-80 font-normal tracking-widest">Full Vocals • Hooks • Viral</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default MusicTypeToggle;
