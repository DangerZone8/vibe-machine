import { Settings as SettingsIcon, Shield, Info, CheckCircle2 } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8 space-y-8 max-w-2xl">
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-6 h-6 text-primary" />
        <h1 className="font-heading text-2xl font-bold tracking-wider">Settings</h1>
      </div>

      <div className="rounded-xl glass neon-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold">Suno AI — Connected</h2>
        </div>

        <p className="text-sm text-muted-foreground">
          PhonkVibe now generates real tracks via <strong>Suno AI</strong>, called securely
          through a Lovable Cloud edge function. Your API key is stored as a server secret —
          never exposed to the browser.
        </p>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-start gap-2">
          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            Generation may take 30–90 seconds. Tracks are capped at <strong>180 seconds</strong>.
            If a generation fails, the app falls back to a demo track.
          </p>
        </div>

        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Shield className="w-3 h-3" /> API key stored server-side as a secret. Update it from Lovable Cloud → Secrets.
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
