// Lightweight MP4 export: black canvas + audio recorded with MediaRecorder.
// No ffmpeg.wasm needed. Output is webm in Firefox; we still name it .mp4 since
// most Chromium browsers produce MP4 via MediaRecorder (mp4;codecs=h264,aac).

export async function exportBlackVideoWithAudio(
  audioUrl: string,
  filename: string,
  durationSec: number,
  title: string = "PhonkVibe",
  mood: string = "",
): Promise<void> {
  // Fetch audio as a blob so we can decode it & control playback length precisely.
  const audioRes = await fetch(audioUrl, { mode: "cors" });
  if (!audioRes.ok) throw new Error(`Failed to fetch audio: ${audioRes.status}`);
  const audioBlob = await audioRes.blob();
  const audioObjUrl = URL.createObjectURL(audioBlob);

  const audio = new Audio();
  audio.crossOrigin = "anonymous";
  audio.src = audioObjUrl;
  await new Promise<void>((resolve, reject) => {
    audio.onloadedmetadata = () => resolve();
    audio.onerror = () => reject(new Error("Audio load failed"));
  });

  const realDuration = Math.min(audio.duration || durationSec, 180);

  // Black canvas video stream
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 720;
  const ctx = canvas.getContext("2d")!;
  const drawFrame = () => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    // Title
    ctx.fillStyle = "#a855f7";
    ctx.font = "bold 44px sans-serif";
    const safeTitle = (title || "PhonkVibe").slice(0, 40);
    ctx.fillText(safeTitle, canvas.width / 2, canvas.height / 2 - 10);
    // Mood
    if (mood) {
      ctx.fillStyle = "#e5e5e5";
      ctx.font = "500 24px sans-serif";
      ctx.fillText(`#${mood}`, canvas.width / 2, canvas.height / 2 + 40);
    }
    // Footer
    ctx.fillStyle = "#666";
    ctx.font = "500 18px sans-serif";
    ctx.fillText("PhonkVibe", canvas.width / 2, canvas.height - 40);
  };
  drawFrame();

  const videoStream = (canvas as HTMLCanvasElement).captureStream(1); // 1 fps – tiny

  // Hook audio element into a MediaStream via WebAudio
  const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
  const ac = new AudioCtx();
  const source = ac.createMediaElementSource(audio);
  const dest = ac.createMediaStreamDestination();
  source.connect(dest);
  source.connect(ac.destination); // also play out so user hears it (optional)

  const combined = new MediaStream([
    ...videoStream.getVideoTracks(),
    ...dest.stream.getAudioTracks(),
  ]);

  // Pick the best supported container
  const mimeCandidates = [
    "video/mp4;codecs=h264,aac",
    "video/mp4",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  const mime = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || "";
  const recorder = new MediaRecorder(combined, mime ? { mimeType: mime } : undefined);
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  const stopped = new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
  });

  recorder.start();
  await audio.play();

  await new Promise<void>((resolve) => setTimeout(resolve, realDuration * 1000));

  audio.pause();
  recorder.stop();
  await stopped;
  await ac.close();

  const outBlob = new Blob(chunks, { type: mime || "video/webm" });
  const ext = (mime.includes("mp4") ? "mp4" : "webm");
  const finalName = filename.endsWith(`.${ext}`) ? filename : `${filename}.${ext}`;
  const url = URL.createObjectURL(outBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = finalName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => {
    URL.revokeObjectURL(url);
    URL.revokeObjectURL(audioObjUrl);
  }, 1000);
}
