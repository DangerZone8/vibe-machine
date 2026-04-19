// sunoapi.org Suno music generation edge function.
//
// Flow:
//   1) POST https://api.sunoapi.org/api/v1/generate
//      headers: Authorization: Bearer {SUNO_API_KEY}
//      body:    { prompt, customMode: false, instrumental: false, model: "V3_5", callBackUrl }
//   2) GET  https://api.sunoapi.org/api/v1/generate/record-info?taskId={taskId}
//      Poll every 3s until status === "SUCCESS" and a track has audioUrl.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUNO_API_KEY = Deno.env.get("SUNO_API_KEY");
const BASE = "https://api.sunoapi.org/api/v1";

interface RequestBody {
  prompt: string;
  length: number;
  vocalType: "male" | "female";
  title?: string;
}

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${SUNO_API_KEY ?? ""}`,
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
    const uniqueSeed = Math.random().toString(36).substring(2, 10);
    const promptWithSeed = `${body.prompt} Unique seed: ${uniqueSeed}`;

    // 1) Submit generation
    const submitRes = await fetch(`${BASE}/generate`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        prompt: promptWithSeed,
        customMode: false,
        instrumental: false,
        model: "V3_5",
        callBackUrl: "https://example.com/no-op",
      }),
    });

    const submitText = await submitRes.text();
    let submitJson: any = {};
    try { submitJson = JSON.parse(submitText); } catch { /* ignore */ }
    console.log("sunoapi submit:", submitRes.status, submitText.slice(0, 500));

    if (!submitRes.ok) {
      return new Response(
        JSON.stringify({ error: "sunoapi submit failed", status: submitRes.status, detail: submitJson || submitText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const taskId =
      submitJson?.data?.taskId ||
      submitJson?.data?.task_id ||
      submitJson?.taskId;

    if (!taskId) {
      return new Response(
        JSON.stringify({ error: "No taskId in submit response", detail: submitJson }),
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
      const pollRes = await fetch(
        `${BASE}/generate/record-info?taskId=${encodeURIComponent(taskId)}`,
        { method: "GET", headers: authHeaders() },
      );
      const pollText = await pollRes.text();
      let pollJson: any = {};
      try { pollJson = JSON.parse(pollText); } catch { /* ignore */ }

      const data = pollJson?.data ?? {};
      const status: string = (data?.status || "").toString().toUpperCase();
      const tracks =
        data?.response?.sunoData ||
        data?.response?.data ||
        data?.sunoData ||
        [];
      const first = Array.isArray(tracks) ? tracks[0] : null;

      const candidate =
        first?.audioUrl ||
        first?.audio_url ||
        first?.streamAudioUrl ||
        first?.stream_audio_url;

      if (candidate) {
        audioUrl = candidate;
        duration = Number(first?.duration) || length;
        title = first?.title || title;
        if (
          status === "SUCCESS" ||
          status === "FIRST_SUCCESS" ||
          status === "TEXT_SUCCESS" ||
          status === "COMPLETE"
        ) {
          break;
        }
      }

      if (
        status === "CREATE_TASK_FAILED" ||
        status === "GENERATE_AUDIO_FAILED" ||
        status === "CALLBACK_EXCEPTION" ||
        status === "SENSITIVE_WORD_ERROR" ||
        status === "FAILED" ||
        status === "ERROR"
      ) {
        return new Response(
          JSON.stringify({ error: "sunoapi generation failed", status, detail: pollJson }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      console.log(`sunoapi poll ${i + 1}/${maxAttempts} status=${status} hasAudio=${!!candidate}`);
    }

    if (!audioUrl) {
      return new Response(
        JSON.stringify({ error: "Timed out waiting for sunoapi generation" }),
        { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ audioUrl, duration, title }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err: any) {
    console.error("generate-suno (sunoapi) error:", err);
    return new Response(
      JSON.stringify({ error: String(err?.message || err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
