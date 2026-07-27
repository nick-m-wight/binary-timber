const RESEND_API = "https://api.resend.com/emails";

// Absolute, public HTTPS URL — email clients can't load relative paths.
export const EMAIL_LOGO_URL = "https://binarytimber.com/email-logo.png";

export function escapeHtml(str: unknown): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ success: boolean }> {
  try {
    const response = await fetch(RESEND_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Set RESEND_FROM=hello@binarytimber.com in env once the domain is
        // verified in Resend. Falls back to the current verified sender
        // until then. See docs/SCOPING.md §8.
        from: process.env.RESEND_FROM || "hello@chefhub.dev",
        to,
        reply_to: replyTo,
        subject,
        html,
      }),
    });

    if (response.ok) return { success: true };
    const data = await response.json();
    console.error("Resend error:", data);
    return { success: false };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false };
  }
}
