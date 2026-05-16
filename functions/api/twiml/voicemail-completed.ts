// Cloudflare Pages Function: Twilio transcription callback handler
//
// POST /api/twiml/voicemail-completed
//
// Twilio fires this with form-encoded fields once it finishes processing a
// voicemail recording's transcription. Emails Cody via Resend with the
// transcript + a link to the recording.
//
// Twilio form fields (selected):
//   From                  caller phone (E.164)
//   To                    the Twilio number that was called
//   CallSid               unique call identifier
//   RecordingUrl          .mp3 of the voicemail (Twilio-hosted, auth required)
//   RecordingSid          unique recording ID
//   TranscriptionText     transcript (may be empty if speech wasn't intelligible)
//   TranscriptionStatus   'completed' | 'failed' | ...
//
// Env vars (set in CF Pages dashboard):
//   RESEND_API_KEY        — Resend API key (already configured for /api/contact)

interface Env {
  RESEND_API_KEY: string;
}

const RECIPIENT = "cody@bosqueworks.com";
const FROM = "voicemail@bosqueworks.com";

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const formData = await context.request.formData();

  const from = formData.get("From")?.toString() || "unknown";
  const to = formData.get("To")?.toString() || "unknown";
  const recordingUrl = formData.get("RecordingUrl")?.toString() || "";
  const transcriptionText = formData.get("TranscriptionText")?.toString() || "(no transcription)";
  const transcriptionStatus = formData.get("TranscriptionStatus")?.toString() || "unknown";
  const callSid = formData.get("CallSid")?.toString() || "unknown";

  const callTime = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1c1917; max-width: 640px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #1a2942; margin-top: 0;">New voicemail · Stephenville Roofing Pros</h2>
  <table style="border-collapse: collapse; margin: 16px 0;">
    <tr><td style="padding: 4px 12px 4px 0; color: #78716c;">From</td><td style="padding: 4px 0; font-weight: 600;">${from}</td></tr>
    <tr><td style="padding: 4px 12px 4px 0; color: #78716c;">To</td><td style="padding: 4px 0;">${to}</td></tr>
    <tr><td style="padding: 4px 12px 4px 0; color: #78716c;">Received</td><td style="padding: 4px 0;">${callTime} CT</td></tr>
    <tr><td style="padding: 4px 12px 4px 0; color: #78716c;">Transcript</td><td style="padding: 4px 0; color: #78716c; font-size: 12px;">${transcriptionStatus}</td></tr>
  </table>
  <blockquote style="border-left: 3px solid #e8742c; padding: 8px 16px; margin: 16px 0; background: #faf7f2; color: #44403c; font-size: 15px;">
    ${transcriptionText || "<em>(transcription unavailable — listen to recording below)</em>"}
  </blockquote>
  <p>
    <a href="${recordingUrl}" style="background: #1a2942; color: white; padding: 10px 16px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: 600;">Listen to recording</a>
  </p>
  <p style="font-size: 12px; color: #a8a29e; margin-top: 24px;">Call SID: ${callSid}</p>
</body>
</html>
  `.trim();

  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: RECIPIENT,
      subject: `New voicemail from ${from} · Stephenville Roofing Pros`,
      html,
    }),
  });

  if (!resp.ok) {
    const body = await resp.text();
    console.error("Resend error:", resp.status, body);
    return new Response("email_failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
};
