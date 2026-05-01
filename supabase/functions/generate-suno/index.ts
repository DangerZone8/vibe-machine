const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const HF_API_KEY = Deno.env.get("HUGGINGFACE_API_KEY");
const HF_URL =
  "https://api-inference.huggingface.co/models/facebook/musicgen-melody";

function buildPrompt(mood: string, vocalType: string, custom?: string): string {
  const vocals = vocalType === "female" ? "female" : "male";
  const moodPart = (custom?.trim() || mood || "dark").slice(0, 80);
  const p = `heavy phonk beat, distorted 808 bass, loud cowbell melody, Memphis style, dark lo-fi atmosphere, ${moodPart}, ${vocals} vocals with gritty words, heavy drops and build-ups, viral reel energy`;
  return p.slice(0, 400);
}

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!HF_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "Add HUGGINGFACE_API_KEY to Lovable Cloud secrets",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const body = await req.json().catch(() => ({}));
    const length = Math.min(Math.max(Number(body.length) || 90, 30), 180);
    const mood = String(body.mood || body.prompt || "dark phonk");
    const vocalType = String(body.vocalType || "male");
    const custom = body.customPrompt ? String(body.customPrompt) : undefined;
    const title = body.title ? String(body.title) : "Phonk Track";

    const prompt = buildPrompt(mood, vocalType, custom);
    console.log("hf musicgen prompt:", prompt);

    const hfRes = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    console.log("hf status:", hfRes.status, "ct:", hfRes.headers.get("content-type"));

    if (!hfRes.ok) {
      const errText = await hfRes.text().catch(() => "");
      console.error("hf error body:", errText.slice(0, 500));
      return new Response(
        JSON.stringify({
          error: "Hugging Face generation failed",
          status: hfRes.status,
          detail: errText.slice(0, 500),
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const contentType = hfRes.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const j = await hfRes.json().catch(() => ({}));
      console.error("hf returned json instead of audio:", j);
      return new Response(
        JSON.stringify({ error: "Model unavailable", detail: j }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const buf = new Uint8Array(await hfRes.arrayBuffer());
    const mime = contentType.includes("wav") ? "audio/wav" : "audio/mpeg";
    const dataUrl = `data:${mime};base64,${bytesToBase64(buf)}`;

    return new Response(
      JSON.stringify({ audioUrl: dataUrl, duration: length, title }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err: any) {
    console.error("generate-suno error:", err);
    return new Response(
      JSON.stringify({ error: String(err?.message || err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
