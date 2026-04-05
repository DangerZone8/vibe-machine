import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

type VocalType = "male" | "female";

interface GenerationControlsProps {
  bpm: number;
  setBpm: (v: number) => void;
  length: number;
  setLength: (v: number) => void;
  intensity: number;
  setIntensity: (v: number) => void;
  vocalChops: boolean;
  setVocalChops: (v: boolean) => void;
  vocalType: VocalType;
  setVocalType: (v: VocalType) => void;
}

const GenerationControls = ({
  bpm, setBpm, length, setLength, intensity, setIntensity, vocalChops, setVocalChops,
  vocalType, setVocalType,
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

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium text-muted-foreground">Vocal Chops</Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add chopped Memphis-style vocal samples to the beat</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Switch checked={vocalChops} onCheckedChange={setVocalChops} />
        </div>
      </div>

      {/* Vocals Section — exclusive choice */}
      <div className="space-y-3">
        <h3 className="font-heading text-sm font-semibold tracking-widest text-muted-foreground uppercase">
          🎤 Vocals (choose one)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setVocalType("male")}
            className={`flex flex-col gap-0.5 p-3 rounded-lg border text-left transition-all ${
              vocalType === "male"
                ? "bg-primary/10 border-primary ring-1 ring-primary"
                : "bg-muted/30 border-border/50"
            }`}
          >
            <Label className="text-sm font-medium text-foreground pointer-events-none">Male Vocals</Label>
            <span className="text-[11px] text-muted-foreground">Gritty aggressive Memphis rap — short words, phrases or repeated hooks</span>
          </button>
          <button
            type="button"
            onClick={() => setVocalType("female")}
            className={`flex flex-col gap-0.5 p-3 rounded-lg border text-left transition-all ${
              vocalType === "female"
                ? "bg-primary/10 border-primary ring-1 ring-primary"
                : "bg-muted/30 border-border/50"
            }`}
          >
            <Label className="text-sm font-medium text-foreground pointer-events-none">Female Vocals</Label>
            <span className="text-[11px] text-muted-foreground">Chopped dark rap — short words, phrases or repeated hooks</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerationControls;
