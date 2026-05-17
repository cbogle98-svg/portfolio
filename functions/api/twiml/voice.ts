// Cloudflare Pages Function: TwiML for inbound voice calls
//
// Twilio voice webhook target. Returns TwiML XML instructing voicemail-only flow.
//
// POST /api/twiml/voice  (Twilio uses POST by default for voice URLs)
//
// Configured as the Voice URL on the Twilio number for Stephenville Roofing Pros
// (pre-contract: all calls → voicemail with notification email to Cody).
//
// We use BOTH callbacks so we get notified regardless of transcription outcome:
//   - recordingStatusCallback fires when recording is complete (always)
//   - transcribeCallback fires only if transcription succeeds (separate, additive)
// The recording-status callback is the source of truth for "got a voicemail";
// the transcribe callback is purely additive (updates the lead with text if it works).

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const origin = url.origin;
  const recordingCb = `${origin}/api/twiml/voicemail-completed`;
  const transcribeCb = `${origin}/api/twiml/voicemail-completed?type=transcription`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Thanks for calling Stephenville Roofing Pros. Please leave a message with your name, address, and a brief description of the roofing issue, then press pound. A local roofer will return your call within 24 hours.</Say>
  <Record maxLength="180" timeout="10" finishOnKey="#" playBeep="true" transcribe="true" transcribeCallback="${transcribeCb}" recordingStatusCallback="${recordingCb}" recordingStatusCallbackEvent="completed" />
  <Say voice="Polly.Joanna">We didn't receive a message. Goodbye.</Say>
</Response>`;

  return new Response(twiml, {
    headers: { "content-type": "text/xml; charset=utf-8" },
  });
};
