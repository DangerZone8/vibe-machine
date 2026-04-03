import { useState } from "react";
import { Settings as SettingsIcon, Key, ExternalLink, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const SettingsPage = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("phonkvibe-api-key") || "");
  const [provider, setProvider] = useState(() => localStorage.getItem("phonkvibe-provider") || "suno");

  const handleSave = () => {
    localStorage.setItem("phonkvibe-api-key", apiKey);
    localStorage.setItem("phonkvibe-provider", provider);
    toast.success("Settings saved!");
  };

  const providers = [
    { id: "suno", name: "Suno AI", desc: "Best for high-quality phonk generation", url: "https://suno.com" },
    { id: "udio", name: "Udio", desc: "Great for experimental sounds", url: "https://udio.com" },
    { id: "custom", name: "Custom API", desc: "Any compatible music generation API", url: "" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pb-24 md:pb-8 space-y-8 max-w-2xl">
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-6 h-6 text-primary" />
        <h1 className="font-heading text-2xl font-bold tracking-wider">Settings</h1>
      </div>

      {/* API Key Section */}
      <div className="rounded-xl glass neon-border p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold">AI Music API</h2>
        </div>

        <p className="text-sm text-muted-foreground">
          Connect your own AI music generation API key to create real phonk beats. Without a key,
          the app runs in demo mode with simulated generation.
        </p>

        {/* Provider selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-muted-foreground">Provider</Label>
          <div className="grid gap-2">
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
                className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                  provider === p.id
                    ? "border-primary/50 bg-primary/10"
                    : "border-border/50 bg-muted/20 hover:bg-muted/40"
                }`}
              >
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary" />
                  </a>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* API Key input */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-muted-foreground">API Key</Label>
          <Input
            type="password"
            placeholder="sk-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-muted/30 border-border/50"
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Shield className="w-3 h-3" /> Your key is stored locally and never sent to our servers
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
