"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  computeEstimate,
  generateBuildScope,
  isValidFeatureId,
  isValidPlatformId,
} from "@/lib/feature-catalog";

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

  revalidatePath("/portal");
  return { error: null };
}
