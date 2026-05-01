import { useState } from "react";
import { Sparkles, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import MoodSelector from "@/components/MoodSelector";
import GenerationControls from "@/components/GenerationControls";
import MusicTypeToggle from "@/components/MusicTypeToggle";
import AudioPlayer from "@/components/AudioPlayer";
import GeneratingOverlay from "@/components/GeneratingOverlay";
import TrendingNow from "@/components/TrendingNow";
import TrendingTracks from "@/components/TrendingTracks";
import { generateTitle, generateTrackFromAPI, type GeneratedTrack, type MusicType } from "@/lib/music-api";
import { useTrendingTags } from "@/hooks/use-trending-tags";
import { DEMO_TRACKS } from "@/lib/demo-tracks";
import heroBg from "@/assets/hero-bg.jpg";

const HomePage = () => {
  const [mood, setMood] = useState("chill");
  const [musicType, setMusicType] = useState<MusicType>("phonk");
  const [customPrompt, setCustomPrompt] = useState("");
  const [bpm, setBpm] = useState(120);
  const [length, setLength] = useState(90);
  const [intensity, setIntensity] = useState(6);
  const [vocalType, setVocalType] = useState<"male" | "female">("male");
  const [generating, setGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<GeneratedTrack | null>(null);

  const { tags: trendingTags, allTags, loading: trendingLoading, getTagsForPrompt } = useTrendingTags(mood);

  const handleGenerate = async () => {
    const exactLength = Math.min(length, 180);
    setGenerating(true);

    const trendingTagsStr = getTagsForPrompt(mood);

    const apiResult = await generateTrackFromAPI({
      mood, customPrompt, bpm, length: exactLength, intensity, vocalType, musicType,
      trendingTags: trendingTagsStr || undefined,
    });

    if (!apiResult) {
      toast.error("Generation failed — check your SUNO_API_KEY in Lovable Cloud secrets");
    }

    const demoMatch = DEMO_TRACKS.find((t) => t.mood === mood) || DEMO_TRACKS[0];
    const audioUrl = apiResult?.audioUrl || demoMatch.audioUrl;
    const duration = apiResult?.duration || exactLength;

    const track: GeneratedTrack = {
      id: crypto.randomUUID(),
      title: generateTitle(mood, musicType),
      mood,
      musicType,
      tags: [mood, musicType, intensity > 7 ? "aggressive" : "smooth"],
      audioUrl,
      duration,
      bpm,
      createdAt: new Date().toISOString(),
    };

    setGeneratedTrack(track);
    setGenerating(false);
  };

  const isPhonk = musicType === "phonk";

  return (
    <div className="pb-24 md:pb-8 relative">
      {generating && <GeneratingOverlay musicType={musicType} />}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>
        <div className="relative container mx-auto px-4 pt-16 pb-12 text-center space-y-4">
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-wider text-glow-purple leading-tight">
            Turn Your Mood Into<br />
            <span
              className={`bg-clip-text text-transparent ${
                isPhonk
                  ? "gradient-phonk"
                  : "bg-gradient-to-r from-sky-400 to-teal-400"
              }`}
            >
              {isPhonk ? "Fire Phonk Beats" : "Viral Songs"}
            </span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            {isPhonk
              ? "AI-powered phonk generator. Heavy 808s, cowbells, Memphis vibes. Every track unique and ready for your content."
              : "AI-powered song generator. Full vocals, catchy hooks, viral-ready. Built for content creators and influencers."}
          </p>
        </div>
      </section>

      {/* Generator */}
      <section className="container mx-auto px-4 space-y-8 relative z-10 -mt-4">

        {/* Trending Tracks (Last.fm, daily) */}
        <TrendingTracks />

        {/* Trending Now (mood tags) */}
        {(trendingLoading || allTags.length > 0) && (
          <TrendingNow tags={trendingTags} loading={trendingLoading} />
        )}

        <div className="space-y-3">
          <h2 className="font-heading text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Music Type
          </h2>
          <MusicTypeToggle value={musicType} onChange={setMusicType} />
        </div>

        <div className="space-y-4">
          <h2 className="font-heading text-sm font-semibold tracking-widest text-muted-foreground uppercase">
            Select Your Mood
          </h2>
          <MoodSelector selected={mood} onSelect={setMood} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-sm font-semibold tracking-widest text-muted-foreground uppercase">
              Describe Your Scene
            </h2>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  {isPhonk
                    ? 'Describe your vibe. e.g. "drifting through neon Tokyo at 3AM" or "gym rage mode"'
                    : 'Describe your scene. e.g. "heartbreak in the rain" or "summer rooftop party vibes"'}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            placeholder={isPhonk
              ? 'e.g. "rainy night drift", "gym rage mode", "hype street racing"...'
              : 'e.g. "heartbreak ballad", "summer anthem", "viral party banger"...'}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="bg-muted/30 border-border/50 resize-none h-20 placeholder:text-muted-foreground/40"
          />
        </div>

        <GenerationControls
          bpm={bpm} setBpm={setBpm}
          length={length} setLength={setLength}
          intensity={intensity} setIntensity={setIntensity}
          vocalType={vocalType} setVocalType={setVocalType}
          musicType={musicType}
        />

        <div className="flex justify-center pt-2">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={generating}
            className={`font-heading text-sm sm:text-base tracking-wider px-8 sm:px-10 py-6 rounded-xl hover:scale-105 transition-transform text-white ${
              isPhonk
                ? "gradient-phonk glow-purple animate-pulse-glow"
                : "bg-gradient-to-r from-sky-500 to-teal-400 shadow-[0_0_25px_hsl(195_90%_50%/0.35)] hover:shadow-[0_0_35px_hsl(195_90%_50%/0.5)]"
            }`}
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isPhonk ? "Generate Fire Phonk" : "Generate Viral Song"}
          </Button>
        </div>

        {generatedTrack && (
          <div className="pt-4">
            <AudioPlayer
              track={generatedTrack}
              onRegenerate={handleGenerate}
              onSave={() => {}}
            />
          </div>
        )}

        {!generatedTrack && (
          <div className="space-y-4 pt-4">
            <h2 className="font-heading text-sm font-semibold tracking-widest text-muted-foreground uppercase">
              Demo Tracks — Hit Play
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DEMO_TRACKS.map((track) => (
                <div
                  key={track.id}
                  className="rounded-xl glass neon-border p-4 space-y-3 hover:glow-purple transition-all cursor-pointer"
                  onClick={() => {
                    setGeneratedTrack(track);
                    setMood(track.mood);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">{track.title}</h4>
                    <span className="text-xs text-muted-foreground font-heading">{track.bpm} BPM</span>
                  </div>
                  <div className="flex gap-1.5">
                    {track.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Tap to play</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
