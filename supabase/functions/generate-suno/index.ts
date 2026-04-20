const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUNO_API_KEY = Deno.env.get("SUNO_API_KEY");
const BASE = "https://api.sunoapi.org/api/v1";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!SUNO_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Add SUNO_API_KEY to Lovable Cloud secrets" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json();
    const length = Math.min(Math.max(Number(body.length) || 90, 30), 180);
    const vocal = body.vocalType === "female" ? "Female" : "Male";
    const mood = body.prompt || "hype aggressive phonk";
    const seed = Math.random().toString(36).substring(2, 8);

    const style = `heavy phonk, distorted 808 bass, cowbell melody, Memphis rap, dark lo-fi, ${mood}`.slice(0, 120);
    const lyrics = `[Verse]\n${vocal} voice, gritty words, phonk energy\n[Hook]\nHeavy drops, fake drops, build up\n[Drop]\n808 slam, cowbell hit`;
    const title = `Phonk ${seed}`;

    const submitRes = await fetch(`${BASE}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SUNO_API_KEY}`,
      },
      body: JSON.stringify({
        customMode: true,
        instrumental: false,
        model: "V3_5",
        prompt: lyrics,
        style: style,
        title: title,
        callBackUrl: "https://example.com/no-op",
      }),
    });

    const submitJson = await submitRes.json();
    console.log("sunoapi submit:", submitRes.status, JSON.stringify(submitJson).slice(0, 300));

    if (!submitRes.ok) {
      return new Response(
        JSON.stringify({ error: "sunoapi submit failed", detail: submitJson }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const taskId = submitJson?.data?.taskId || submitJson?.taskId;

    if (!taskId) {
      return new Response(
        JSON.stringify({ error: "No taskId returned", detail: submitJson }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Poll for result
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const pollRes = await fetch(
        `${BASE}/generate/record-info?taskId=${taskId}`,
        {
          headers: {
            "Authorization": `Bearer ${SUNO_API_KEY}`,
          },
        },
      );
      const pollJson = await pollRes.json();
      const data = pollJson?.data ?? {};
      const status = (data?.status || "").toUpperCase();
      const tracks = data?.response?.sunoData || data?.sunoData || [];
      const first = Array.isArray(tracks) ? tracks[0] : null;
      const audioUrl = first?.audioUrl || first?.audio_url;

      console.log(`poll ${i + 1} status=${status} hasAudio=${!!audioUrl}`);

      if (audioUrl && (status === "SUCCESS" || status === "FIRST_SUCCESS" || status === "COMPLETE")) {
        return new Response(
          JSON.stringify({
            audioUrl,
            duration: Number(first?.duration) || length,
            title: first?.title || title,
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if (status.includes("FAIL") || status.includes("ERROR")) {
        return new Response(
          JSON.stringify({ error: "Generation failed", status, detail: pollJson }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Timed out waiting for generation" }),
      { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );

  } catch (err) {
    console.error("generate-suno error:", err);
    return new Response(
      JSON.stringify({ error: String(err?.message || err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
