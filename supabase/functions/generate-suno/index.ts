// GoAPI Suno music generation edge function.
//
// Flow:
//   1) POST https://api.goapi.ai/api/suno/v1/music
//      headers: X-API-Key: {SUNO_API_KEY}
//      body:    { custom_mode, input: { gpt_description_prompt, make_instrumental, mv } }
//   2) GET  https://api.goapi.ai/api/suno/v1/music/{taskId}
//      Poll every 3s until status === "completed" / clip has audio_url

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUNO_API_KEY = Deno.env.get("SUNO_API_KEY");
const GOAPI_BASE = "https://api.goapi.ai/api/suno/v1/music";

interface RequestBody {
  prompt: string;
  length: number;
  vocalType: "male" | "female";
  title?: string;
}

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "X-API-Key": SUNO_API_KEY ?? "",
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!SUNO_API_KEY) {
      return new Response(
        JSON.stringify({ error: "SUNO_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = (await req.json()) as RequestBody;
    if (!body?.prompt || typeof body.prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing prompt" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const length = Math.min(Math.max(Number(body.length) || 90, 30), 180);

    // Force unique generation each call — GoAPI dedupes similar prompts otherwise.
    const uniqueSeed = Math.random().toString(36).substring(2, 10);
    const promptWithSeed = `${body.prompt} Unique seed: ${uniqueSeed}`;

    // 1) Submit generation
    const submitRes = await fetch(GOAPI_BASE, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        custom_mode: false,
        mv: "chirp-v3-5",
        input: {
          gpt_description_prompt: promptWithSeed,
          make_instrumental: false,
          duration: length,
        },
      }),
    });

    const submitText = await submitRes.text();
    let submitJson: any = {};
    try { submitJson = JSON.parse(submitText); } catch { /* ignore */ }
    console.log("GoAPI submit:", submitRes.status, submitText.slice(0, 500));

    if (!submitRes.ok) {
      return new Response(
        JSON.stringify({ error: "GoAPI submit failed", status: submitRes.status, detail: submitJson || submitText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // GoAPI returns { code, data: { task_id, ... } } or similar
    const taskId =
      submitJson?.data?.task_id ||
      submitJson?.data?.taskId ||
      submitJson?.task_id ||
      submitJson?.id;

    if (!taskId) {
      return new Response(
        JSON.stringify({ error: "No task_id in submit response", detail: submitJson }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 2) Poll for result (~3 minutes max)
    const maxAttempts = 60;
    const intervalMs = 3000;
    let audioUrl: string | null = null;
    let duration: number = length;
    let title = body.title || "PhonkVibe Track";

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, intervalMs));
      const pollRes = await fetch(`${GOAPI_BASE}/${encodeURIComponent(taskId)}`, {
        method: "GET",
        headers: authHeaders(),
      });
      const pollText = await pollRes.text();
      let pollJson: any = {};
      try { pollJson = JSON.parse(pollText); } catch { /* ignore */ }

      // GoAPI shape: { code, data: { status, clips: [{ audio_url, ... }] } }
      const data = pollJson?.data ?? pollJson;
      const status: string = (data?.status || "").toString().toLowerCase();
      const clips = data?.clips || data?.output?.clips || [];
      const first = Array.isArray(clips) ? clips[0] : null;

      const candidate =
        first?.audio_url ||
        first?.audioUrl ||
        first?.source_audio_url ||
        first?.stream_audio_url;

      if (candidate) {
        audioUrl = candidate;
        duration = Number(first?.metadata?.duration || first?.duration) || length;
        title = first?.title || title;
        if (status === "completed" || status === "complete" || status === "succeeded" || status === "success") {
          break;
        }
      }

      if (status === "failed" || status === "error") {
        return new Response(
          JSON.stringify({ error: "GoAPI generation failed", status, detail: pollJson }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      console.log(`GoAPI poll ${i + 1}/${maxAttempts} status=${status} hasAudio=${!!candidate}`);
    }

    if (!audioUrl) {
      return new Response(
        JSON.stringify({ error: "Timed out waiting for GoAPI generation" }),
        { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ audioUrl, duration, title }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("generate-suno (GoAPI) error:", err);
    return new Response(
      JSON.stringify({ error: String(err?.message || err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
