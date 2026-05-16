// Cloudflare Pages Function: TwiML for inbound voice calls
//
// Twilio voice webhook target. Returns TwiML XML instructing voicemail-only flow.
//
// POST /api/twiml/voice  (Twilio uses POST by default for voice URLs)
//
// Configured as the Voice URL on the Twilio number for Stephenville Roofing Pros
// (pre-contract: all calls → voicemail with transcription emailed to Cody).

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const transcribeCallbackUrl = `${url.origin}/api/twiml/voicemail-completed`;

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Thanks for calling Stephenville Roofing Pros. Please leave a message with your name, address, and a brief description of the roofing issue. A local roofer will return your call within 24 hours.</Say>
  <Record maxLength="180" transcribe="true" transcribeCallback="${transcribeCallbackUrl}" playBeep="true" />
  <Say voice="Polly.Joanna">We didn't receive a message. Goodbye.</Say>
</Response>`;

  return new Response(twiml, {
    headers: { "content-type": "text/xml; charset=utf-8" },
  });
};
