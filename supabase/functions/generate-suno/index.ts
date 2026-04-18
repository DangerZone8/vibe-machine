// Suno music generation edge function.
// Accepts { prompt, length, vocalType } and returns { audioUrl, title, duration }.
//
// Suno's official API ("api.sunoapi.org") flow:
//   1) POST /api/v1/generate          -> { taskId }
//   2) GET  /api/v1/generate/record-info?taskId=...
//      Poll until response.data.status === "SUCCESS" (or contains streamAudioUrl/audioUrl)

import { corsHeaders } from "@supabase/supabase-js/cors";

const SUNO_API_KEY = Deno.env.get("SUNO_API_KEY");
const SUNO_BASE = "https://apibox.erweima.ai"; // sunoapi.org gateway; falls back below

interface RequestBody {
  prompt: string;
  length: number;
  vocalType: "male" | "female";
  title?: string;
}

async function sunoFetch(path: string, init: RequestInit) {
  const url = `${SUNO_BASE}${path}`;
  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUNO_API_KEY}`,
      ...(init.headers || {}),
    },
  });
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
    const title = body.title || "PhonkVibe Track";

    // 1) Submit generation
    const submitRes = await sunoFetch("/api/v1/generate", {
      method: "POST",
      body: JSON.stringify({
        prompt: body.prompt,
        customMode: true,
        instrumental: false,
        model: "V4",
        title,
        style: "phonk, memphis, trap, dark, 808, cowbell",
        callBackUrl: "https://example.com/none", // required by API but we poll instead
      }),
    });

    const submitText = await submitRes.text();
    let submitJson: any = {};
    try { submitJson = JSON.parse(submitText); } catch { /* ignore */ }
    console.log("Suno submit response:", submitRes.status, submitText.slice(0, 500));

    if (!submitRes.ok || submitJson?.code !== 200) {
      return new Response(
        JSON.stringify({ error: "Suno submit failed", status: submitRes.status, detail: submitJson || submitText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const taskId = submitJson?.data?.taskId || submitJson?.data?.task_id;
    if (!taskId) {
      return new Response(
        JSON.stringify({ error: "No taskId in submit response", detail: submitJson }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 2) Poll for result (max ~3 minutes)
    const maxAttempts = 60;
    const intervalMs = 3000;
    let audioUrl: string | null = null;
    let duration: number = length;

    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, intervalMs));
      const pollRes = await sunoFetch(`/api/v1/generate/record-info?taskId=${encodeURIComponent(taskId)}`, {
        method: "GET",
      });
      const pollText = await pollRes.text();
      let pollJson: any = {};
      try { pollJson = JSON.parse(pollText); } catch { /* ignore */ }

      const status = pollJson?.data?.status;
      const items = pollJson?.data?.response?.sunoData || pollJson?.data?.response?.data || [];
      const first = Array.isArray(items) ? items[0] : null;

      // Prefer final audioUrl, fall back to streamAudioUrl for early playback
      const candidate =
        first?.audioUrl ||
        first?.audio_url ||
        first?.sourceAudioUrl ||
        first?.streamAudioUrl ||
        first?.stream_audio_url;

      if (candidate) {
        audioUrl = candidate;
        duration = Number(first?.duration) || length;
        if (status === "SUCCESS" || first?.audioUrl) break;
      }

      if (status === "CREATE_TASK_FAILED" || status === "GENERATE_AUDIO_FAILED" || status === "SENSITIVE_WORD_ERROR") {
        return new Response(
          JSON.stringify({ error: "Suno generation failed", status, detail: pollJson }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      console.log(`Suno poll ${i + 1}/${maxAttempts} status=${status} hasAudio=${!!candidate}`);
    }

    if (!audioUrl) {
      return new Response(
        JSON.stringify({ error: "Timed out waiting for Suno generation" }),
        { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ audioUrl, duration, title }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("generate-suno error:", err);
    return new Response(
      JSON.stringify({ error: String(err?.message || err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
