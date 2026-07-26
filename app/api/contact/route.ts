import { NextResponse } from "next/server";

const RESEND_API = "https://api.resend.com/emails";

// Logo for the notification email. Must be an absolute, public HTTPS URL — email
// clients can't load relative paths or embedded images. Resolves once the app is
// live on production (binarytimber.com serves /public assets at the root).
const EMAIL_LOGO_URL = "https://binarytimber.com/email-logo.png";

function escapeHtml(str: unknown): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, interest, message, botcheck } = payload ?? {};

  // Honeypot — bots fill hidden fields, humans don't
  if (botcheck) {
    return NextResponse.json({ success: true });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;color:#1a1612;">
      <img src="${EMAIL_LOGO_URL}" alt="Binary Timber Holdings" width="240" style="width:240px;max-width:100%;height:auto;display:block;margin-bottom:1.5rem;">
      <h2 style="font-size:1.2rem;margin-bottom:1.5rem;">
        New inquiry via binarytimber.com
      </h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:0.4rem 1rem 0.4rem 0;font-weight:bold;width:130px;vertical-align:top;">Name</td>
          <td style="padding:0.4rem 0;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:0.4rem 1rem 0.4rem 0;font-weight:bold;vertical-align:top;">Email</td>
          <td style="padding:0.4rem 0;">${escapeHtml(email)}</td>
        </tr>
        <tr>
          <td style="padding:0.4rem 1rem 0.4rem 0;font-weight:bold;vertical-align:top;">Division</td>
          <td style="padding:0.4rem 0;">${escapeHtml(interest)}</td>
        </tr>
      </table>
      <div style="margin-top:1.5rem;">
        <strong>Message:</strong>
        <p style="margin-top:0.5rem;white-space:pre-wrap;">${escapeHtml(message)}</p>
      </div>
    </div>
  `;

  try {
    const response = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Set RESEND_FROM=hello@binarytimber.com in env once the domain is verified
        // in Resend. Falls back to the current verified sender until then. See docs/SCOPING.md §8.
        from: process.env.RESEND_FROM || "hello@chefhub.dev",
        to: "nick.m.wight@gmail.com",
        reply_to: email,
        subject: `New inquiry — ${escapeHtml(interest)} — Binary Timber Holdings`,
        html,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json({ success: true });
    }
    console.error("Resend error:", data);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  } catch (err) {
    console.error("Contact handler error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
