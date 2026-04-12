import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

type VocalType = "male" | "female";

interface GenerationControlsProps {
  bpm: number;
  setBpm: (v: number) => void;
  length: number;
  setLength: (v: number) => void;
  intensity: number;
  setIntensity: (v: number) => void;
  vocalType: VocalType;
  setVocalType: (v: VocalType) => void;
}

const GenerationControls = ({
  bpm, setBpm, length, setLength, intensity, setIntensity, vocalType, setVocalType,
}: GenerationControlsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">BPM</Label>
            <span className="font-heading text-sm text-primary">{bpm}</span>
          </div>
          <Slider value={[bpm]} onValueChange={([v]) => setBpm(v)} min={80} max={160} step={5} className="w-full" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">Length</Label>
            <span className="font-heading text-sm text-primary">{length}s</span>
          </div>
          <Slider value={[length]} onValueChange={([v]) => setLength(v)} min={60} max={180} step={15} className="w-full" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">Intensity</Label>
            <span className="font-heading text-sm text-primary">{intensity}/10</span>
          </div>
          <Slider value={[intensity]} onValueChange={([v]) => setIntensity(v)} min={1} max={10} step={1} className="w-full" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-heading text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          🎤 Vocals (choose one)
        </h3>
        <div role="radiogroup" aria-label="Vocals" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              vocalType === "male"
                ? "bg-primary/10 border-primary ring-1 ring-primary"
                : "bg-muted/30 border-border/50"
            }`}
          >
            <input
              type="radio"
              name="vocalType"
              value="male"
              checked={vocalType === "male"}
              onChange={() => setVocalType("male")}
              className="mt-0.5 h-4 w-4 shrink-0 border-border text-primary"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">Male Vocals</span>
              <span className="text-[11px] text-muted-foreground">Gritty aggressive Memphis rap — short words or repeated hooks</span>
            </div>
          </label>

          <label
            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              vocalType === "female"
                ? "bg-primary/10 border-primary ring-1 ring-primary"
                : "bg-muted/30 border-border/50"
            }`}
          >
            <input
              type="radio"
              name="vocalType"
              value="female"
              checked={vocalType === "female"}
              onChange={() => setVocalType("female")}
              className="mt-0.5 h-4 w-4 shrink-0 border-border text-primary"
            />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">Female Vocals</span>
              <span className="text-[11px] text-muted-foreground">Chopped dark rap — short words or repeated hooks</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default GenerationControls;
