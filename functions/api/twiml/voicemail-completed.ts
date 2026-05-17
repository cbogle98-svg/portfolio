// Cloudflare Pages Function: Twilio callback handler for voicemail events.
//
// Handles TWO callback types from Twilio's <Record> TwiML element, distinguished
// by ?type= query string set in voice.ts:
//
//   POST /api/twiml/voicemail-completed                       — recordingStatusCallback (always fires when recording completes)
//   POST /api/twiml/voicemail-completed?type=transcription    — transcribeCallback (only fires if transcription succeeds)
//
// Architecture rationale: transcribeCallback alone misses the failure case (short or
// silent recordings — Twilio rejects transcription and never fires). Using
// recordingStatusCallback as the primary trigger ensures Cody always gets notified;
// the transcribe callback is purely additive when transcription works.
//
// Env vars (set in CF Pages dashboard):
//   RESEND_API_KEY        — Resend API key (shared with /api/contact)

interface Env {
  RESEND_API_KEY: string;
  NOTIFY_INTERNAL_TOKEN?: string;
}

async function pushNotify(env: Env, payload: { event_type: string; title: string; message: string; url?: string; priority?: 'low' | 'normal' | 'high' }): Promise<void> {
  if (!env.NOTIFY_INTERNAL_TOKEN) return;
  try {
    await fetch('https://bosqueworks-demos.pages.dev/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Notify-Token': env.NOTIFY_INTERNAL_TOKEN },
      body: JSON.stringify(payload),
    });
  } catch { /* non-blocking */ }
}

const RECIPIENT = "cody@bosqueworks.com";
const FROM = "voicemail@bosqueworks.com";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const callbackType = url.searchParams.get("type") || "recording";
  const formData = await context.request.formData();

  if (callbackType === "transcription") {
    return handleTranscription(context.env, formData);
  }
  return handleRecording(context.env, formData);
};

async function handleRecording(env: Env, formData: FormData): Promise<Response> {
  // Twilio's recordingStatusCallback only fires the "completed" event (per our TwiML config),
  // but defend against unexpected statuses just in case.
  const status = formData.get("RecordingStatus")?.toString() || "unknown";
  if (status !== "completed") {
    return new Response(`ignored: recording status ${status}`, { status: 200 });
  }

  const from = formData.get("From")?.toString() || "unknown";
  const to = formData.get("To")?.toString() || "unknown";
  const recordingUrl = formData.get("RecordingUrl")?.toString() || "";
  const duration = formData.get("RecordingDuration")?.toString() || "?";
  const callSid = formData.get("CallSid")?.toString() || "unknown";
  const recordingSid = formData.get("RecordingSid")?.toString() || "unknown";

  // Push notification — fire-and-forget, doesn't block email send
  pushNotify(env, {
    event_type: 'voicemail.received',
    title: `Voicemail from ${from}`,
    message: `${duration}s recording — transcript may follow in a few minutes.`,
    url: recordingUrl,
    priority: 'high',
  });

  return sendEmail(env, {
    subject: `New voicemail from ${from} · Stephenville Roofing Pros`,
    headline: "New voicemail received",
    badge: "RECORDING",
    badgeColor: "#e8742c",
    from,
    to,
    callSid,
    extraRows: [
      ["Duration", `${duration} seconds`],
      ["Recording SID", recordingSid],
    ],
    bodyHtml: `
      <p style="color:#78716c;margin:8px 0 16px;font-size:13px;">Transcript will follow in 1-2 minutes if Twilio's transcription succeeds. Short or unclear recordings sometimes can't be transcribed — you can still listen below.</p>
    `,
    recordingUrl,
  });
}

async function handleTranscription(env: Env, formData: FormData): Promise<Response> {
  const status = formData.get("TranscriptionStatus")?.toString() || "unknown";
  if (status !== "completed") {
    // Transcription failed — Cody already got the recording-notification email,
    // no follow-up needed.
    return new Response(`ignored: transcription status ${status}`, { status: 200 });
  }

  const from = formData.get("From")?.toString() || "unknown";
  const to = formData.get("To")?.toString() || "unknown";
  const recordingUrl = formData.get("RecordingUrl")?.toString() || "";
  const text = formData.get("TranscriptionText")?.toString() || "";
  const callSid = formData.get("CallSid")?.toString() || "unknown";

  if (!text.trim()) {
    return new Response("ignored: empty transcript", { status: 200 });
  }

  return sendEmail(env, {
    subject: `Voicemail transcript ready (${from}) · Stephenville Roofing Pros`,
    headline: "Voicemail transcript",
    badge: "TRANSCRIPT",
    badgeColor: "#0369a1",
    from,
    to,
    callSid,
    extraRows: [],
    bodyHtml: `
      <blockquote style="border-left:3px solid #e8742c;padding:8px 16px;margin:16px 0;background:#faf7f2;color:#44403c;font-size:15px;font-style:italic;">${escapeHtml(text)}</blockquote>
    `,
    recordingUrl,
  });
}

interface EmailArgs {
  subject: string;
  headline: string;
  badge: string;
  badgeColor: string;
  from: string;
  to: string;
  callSid: string;
  extraRows: [string, string][];
  bodyHtml: string;
  recordingUrl: string;
}

async function sendEmail(env: Env, a: EmailArgs): Promise<Response> {
  const callTime = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const rowsHtml = [
    ["From", a.from],
    ["To", a.to],
    ["Received", `${callTime} CT`],
    ...a.extraRows,
  ]
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#78716c;font-size:13px;">${escapeHtml(k)}</td><td style="padding:4px 0;font-weight:600;font-size:13px;">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1c1917;max-width:640px;margin:0 auto;padding:24px;">
  <div style="margin-bottom:8px;">
    <span style="background:${a.badgeColor};color:white;padding:3px 8px;border-radius:4px;font-size:10px;font-weight:700;letter-spacing:0.08em;">${a.badge}</span>
  </div>
  <h2 style="color:#1a2942;margin:0 0 16px 0;font-size:20px;">${escapeHtml(a.headline)} · Stephenville Roofing Pros</h2>
  <table style="border-collapse:collapse;margin:0 0 16px;">${rowsHtml}</table>
  ${a.bodyHtml}
  <p>
    <a href="${a.recordingUrl}" style="background:#1a2942;color:white;padding:10px 16px;text-decoration:none;border-radius:4px;display:inline-block;font-weight:600;">Listen to recording</a>
  </p>
  <p style="font-size:11px;color:#a8a29e;margin-top:24px;">Call SID: ${escapeHtml(a.callSid)}</p>
</body>
</html>
  `.trim();

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: RECIPIENT,
      subject: a.subject,
      html,
    }),
  });

  if (!resp.ok) {
    const body = await resp.text();
    console.error("Resend error:", resp.status, body);
    return new Response(`email_failed: ${resp.status}`, { status: 500 });
  }

  return new Response("OK", { status: 200 });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
