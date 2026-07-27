"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  computeEstimate,
  generateBuildScope,
  generateBuildScopeHtml,
  isValidFeatureId,
  isValidPlatformId,
} from "@/lib/feature-catalog";
import { escapeHtml, sendEmail, EMAIL_LOGO_URL } from "@/lib/email";

const ADMIN_EMAIL = "nick.m.wight@gmail.com";

function formatUSD(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export type IntakeActionState = { error: string | null };

const intakeSchema = z
  .object({
    projectName: z.string().trim().min(1, "Project name is required.").max(200),
    division: z.enum(["AI Software", "CNC Manufacturing", "Both"], {
      message: "Choose a division.",
    }),
    description: z.string().trim().min(1, "Project description is required.").max(5000),
    selectedFeatures: z
      .array(z.string())
      .refine((ids) => ids.every(isValidFeatureId), "Invalid feature selection.")
      .default([]),
    platform: z.string().refine(isValidPlatformId, "Invalid platform selection.").optional(),
  })
  .superRefine((data, ctx) => {
    const needsPicker = data.division === "AI Software" || data.division === "Both";
    if (needsPicker && !data.platform) {
      ctx.addIssue({ code: "custom", message: "Choose a platform.", path: ["platform"] });
    }
  });

export type IntakeInput = z.infer<typeof intakeSchema>;

// What actually gets stored: the raw answers plus a point-in-time snapshot
// of the computed estimate/build-scope, so a later catalog price change
// doesn't silently rewrite what a customer was already quoted.
export type IntakePayload = IntakeInput & {
  estimate?: { low: number; high: number };
  buildScope?: string;
};

export async function submitIntake(
  _prevState: IntakeActionState,
  formData: FormData,
): Promise<IntakeActionState> {
  const parsed = intakeSchema.safeParse({
    projectName: formData.get("projectName"),
    division: formData.get("division"),
    description: formData.get("description"),
    selectedFeatures: formData.getAll("features"),
    platform: formData.get("platform") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/auth/login");

  const needsPicker = parsed.data.division === "AI Software" || parsed.data.division === "Both";

  // Estimate is recomputed here from the canonical catalog — never trust a
  // client-submitted total for something that becomes a real dollar figure.
  const payload: IntakePayload = { ...parsed.data };
  if (needsPicker) {
    payload.estimate = computeEstimate(parsed.data.selectedFeatures, parsed.data.platform);
    payload.buildScope = generateBuildScope(parsed.data.selectedFeatures, parsed.data.platform);
  }

  // status: 'new' is required by the intake_submissions RLS insert policy
  // (customers can only insert as 'new' — see the migration for why).
  const { error } = await supabase.from("intake_submissions").insert({
    customer_id: userId,
    status: "new",
    payload,
  });

  if (error) {
    return { error: "Something went wrong. Please try again." };
  }

  // Notify both sides. Best-effort — the submission already succeeded, so a
  // failed email here shouldn't fail the whole action or block the customer.
  const customerEmail = data.claims.email as string | undefined;
  const estimateHtml = payload.estimate
    ? `<div style="margin-top:1rem;"><strong>Estimated range</strong><p style="margin:0.4rem 0 0;">${formatUSD(payload.estimate.low)} &ndash; ${formatUSD(payload.estimate.high)}</p></div>`
    : "";

  const summaryTable = `
    <table style="width:100%;border-collapse:collapse;margin-top:1rem;">
      <tr>
        <td style="padding:0.4rem 1rem 0.4rem 0;font-weight:bold;width:130px;vertical-align:top;">Project</td>
        <td style="padding:0.4rem 0;">${escapeHtml(payload.projectName)}</td>
      </tr>
      <tr>
        <td style="padding:0.4rem 1rem 0.4rem 0;font-weight:bold;vertical-align:top;">Division</td>
        <td style="padding:0.4rem 0;">${escapeHtml(payload.division)}</td>
      </tr>
      <tr>
        <td style="padding:0.4rem 1rem 0.4rem 0;font-weight:bold;vertical-align:top;">Description</td>
        <td style="padding:0.4rem 0;white-space:pre-wrap;">${escapeHtml(payload.description)}</td>
      </tr>
    </table>
  `;

  const emailHeader = `<img src="${EMAIL_LOGO_URL}" alt="Binary Timber Holdings" width="240" style="width:240px;max-width:100%;height:auto;display:block;margin-bottom:1.5rem;">`;

  const results = await Promise.allSettled([
    customerEmail
      ? sendEmail({
          to: customerEmail,
          subject: "We've received your project inquiry — Binary Timber Holdings",
          html: `
            <div style="font-family:Georgia,serif;max-width:600px;color:#1a1612;">
              ${emailHeader}
              <h2 style="font-size:1.2rem;margin-bottom:0.5rem;">Thanks for reaching out</h2>
              <p>Here's a summary of what you submitted — we'll be in touch soon.</p>
              ${summaryTable}
              ${estimateHtml}
            </div>
          `,
        })
      : Promise.resolve({ success: false }),
    sendEmail({
      to: ADMIN_EMAIL,
      replyTo: customerEmail,
      subject: `New intake submission — ${escapeHtml(payload.projectName)}`,
      html: `
        <div style="font-family:Georgia,serif;max-width:600px;color:#1a1612;">
          ${emailHeader}
          <h2 style="font-size:1.2rem;margin-bottom:0.5rem;">New intake submission</h2>
          <p><strong>From:</strong> ${escapeHtml(customerEmail ?? "unknown")}</p>
          ${summaryTable}
          ${estimateHtml}
          ${needsPicker ? generateBuildScopeHtml(parsed.data.selectedFeatures, parsed.data.platform) : ""}
        </div>
      `,
    }),
  ]);

  for (const r of results) {
    if (r.status === "rejected" || !r.value.success) {
      console.error("intake notification email failed:", r.status === "rejected" ? r.reason : "send returned failure");
    }
  }

  revalidatePath("/portal");
  return { error: null };
}
