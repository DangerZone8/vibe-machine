import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface GenerationControlsProps {
  bpm: number;
  setBpm: (v: number) => void;
  length: number;
  setLength: (v: number) => void;
  intensity: number;
  setIntensity: (v: number) => void;
  vocalChops: boolean;
  setVocalChops: (v: boolean) => void;
}

const GenerationControls = ({
  bpm, setBpm, length, setLength, intensity, setIntensity, vocalChops, setVocalChops,
}: GenerationControlsProps) => {
  return (
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
  );
};

export default GenerationControls;
