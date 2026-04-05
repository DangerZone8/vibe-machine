import { useState } from "react";
import { Settings as SettingsIcon, Key, Shield, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SettingsPage = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("phonkvibe-api-key") || "");

  const handleSave = () => {
    localStorage.setItem("phonkvibe-api-key", apiKey);
    toast.success("Settings saved!");
  };

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8 space-y-8 max-w-2xl">
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-6 h-6 text-primary" />
        <h1 className="font-heading text-2xl font-bold tracking-wider">Settings</h1>
      </div>

      <div className="rounded-xl glass neon-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold">Music Generation API</h2>
        </div>

        <p className="text-sm text-muted-foreground">
          PhonkVibe uses a unified music API that supports Suno and Udio models under the hood.
          Without a key the app runs in <strong>demo mode</strong> with sample tracks.
        </p>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-start gap-2">
          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground">
            Get a free API key from a unified music service (e.g.&nbsp;
            <a href="https://udioapi.pro" target="_blank" rel="noopener noreferrer" className="text-primary underline">udioapi.pro</a>
            ). Free tier includes limited generations per day.
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">API Key (optional)</Label>
          <Input
            type="password"
            placeholder="Enter your unified music API key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-muted/30 border-border/50"
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Shield className="w-3 h-3" /> Stored locally, never sent to our servers
          </p>
        </div>

        <Button onClick={handleSave} className="gradient-phonk text-primary-foreground font-heading tracking-wider">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
