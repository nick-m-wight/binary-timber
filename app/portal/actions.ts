"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type IntakeActionState = { error: string | null };

const intakeSchema = z.object({
  projectName: z.string().trim().min(1, "Project name is required.").max(200),
  division: z.enum(["AI Software", "CNC Manufacturing", "Both"], {
    message: "Choose a division.",
  }),
  description: z.string().trim().min(1, "Project description is required.").max(5000),
});

export type IntakePayload = z.infer<typeof intakeSchema>;

export async function submitIntake(
  _prevState: IntakeActionState,
  formData: FormData,
): Promise<IntakeActionState> {
  const parsed = intakeSchema.safeParse({
    projectName: formData.get("projectName"),
    division: formData.get("division"),
    description: formData.get("description"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/auth/login");

  // status: 'new' is required by the intake_submissions RLS insert policy
  // (customers can only insert as 'new' — see the migration for why).
  const { error } = await supabase.from("intake_submissions").insert({
    customer_id: userId,
    status: "new",
    payload: parsed.data,
  });

  if (error) {
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath("/portal");
  return { error: null };
}
