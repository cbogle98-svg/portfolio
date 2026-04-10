// Cloudflare Pages Function: contact form handler
//
// POST /api/contact
//
// Env vars (set in CF Pages dashboard):
//   RESEND_API_KEY        — Resend API key
//   TURNSTILE_SECRET_KEY  — Cloudflare Turnstile secret key

interface Env {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
}

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  service_interest?: string;
  recipient_email?: string;
  subject_prefix?: string;
  business_name?: string;
  website?: string;
  "cf-turnstile-response"?: string;
}

const json = (status: number, body: object) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: ContactPayload;
  const contentType = request.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      data = await request.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await request.formData();
      data = Object.fromEntries(form.entries()) as ContactPayload;
    } else {
      return json(400, { ok: false, error: "Unsupported content type" });
    }
  } catch {
    return json(400, { ok: false, error: "Invalid request body" });
  }

  // Honeypot
  if (data.website && data.website.trim().length > 0) {
    return json(200, { ok: true });
  }

  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  const message = (data.message || "").trim();
  const phone = (data.phone || "").trim();
  const service = (data.service_interest || "").trim();
  const recipient = (data.recipient_email || "").trim();
  const subjectPrefix = (data.subject_prefix || "New portfolio inquiry").trim();
  const businessName = (data.business_name || "").trim();

  if (!name || !email || !message) {
    return json(400, { ok: false, error: "Name, email, and message are required." });
  }

  if (!recipient) {
    return json(500, { ok: false, error: "Recipient email not configured." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { ok: false, error: "Please enter a valid email address." });
  }

  // Turnstile verification
  const turnstileToken = data["cf-turnstile-response"];
  if (turnstileToken && env.TURNSTILE_SECRET_KEY) {
    const verify = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
          remoteip: request.headers.get("CF-Connecting-IP") || "",
        }),
      }
    );
    const result = (await verify.json()) as { success: boolean };
    if (!result.success) {
      return json(400, { ok: false, error: "Captcha verification failed. Please try again." });
    }
  }

  // Send via Resend
  if (!env.RESEND_API_KEY) {
    return json(500, { ok: false, error: "Email service not configured." });
  }

  const subjectLine = `${subjectPrefix} — ${name}${service ? ` (${service})` : ""}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1C1917; color: #FAFAF9; padding: 20px 24px;">
        <h2 style="margin: 0; font-weight: 300; letter-spacing: 1px;">
          New Inquiry${businessName ? " &mdash; " + escapeHtml(businessName) : ""}
        </h2>
      </div>
      <div style="padding: 24px; background: #FAFAF9; color: #44403C;">
        <p style="margin: 0 0 16px 0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p style="margin: 0 0 16px 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        ${phone ? `<p style="margin: 0 0 16px 0;"><strong>Phone:</strong> <a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></p>` : ""}
        ${service ? `<p style="margin: 0 0 16px 0;"><strong>Interested in:</strong> ${escapeHtml(service)}</p>` : ""}
        <p style="margin: 24px 0 8px 0;"><strong>Message:</strong></p>
        <div style="background: white; border-left: 3px solid #D97706; padding: 16px; white-space: pre-wrap;">${escapeHtml(message)}</div>
        <p style="margin: 24px 0 0 0; color: #A8A29E; font-size: 12px;">
          Sent from your portfolio contact form. Reply directly to respond to ${escapeHtml(name)}.
        </p>
      </div>
    </div>
  `;

  const textBody = `New inquiry${businessName ? " — " + businessName : ""}

Name: ${name}
Email: ${email}${phone ? "\nPhone: " + phone : ""}${service ? "\nInterested in: " + service : ""}

Message:
${message}

— Sent from your portfolio contact form.`;

  const resendResp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: "Bosque Works Forms <forms@mail.bosqueworks.com>",
      to: [recipient],
      reply_to: email,
      subject: subjectLine,
      html: htmlBody,
      text: textBody,
    }),
  });

  if (!resendResp.ok) {
    const errBody = await resendResp.text();
    console.error("Resend send failed:", resendResp.status, errBody);
    return json(502, { ok: false, error: "Failed to send message. Please call instead." });
  }

  return json(200, { ok: true });
};
