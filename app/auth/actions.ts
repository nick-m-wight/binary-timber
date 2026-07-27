"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = { error: string | null };
export type ForgotPasswordState = { sent: boolean; error: string | null };

async function redirectByRole(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
): Promise<never> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return redirect(profile?.role === "admin" ? "/admin" : "/portal");
}

export async function login(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Invalid email or password." };
  }

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) {
    return { error: "Something went wrong. Please try again." };
  }

  return await redirectByRole(supabase, userId);
}

export async function setPassword(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: error.message };
  }

  // A user only reaches set-password via a fresh invite, before any admin
  // promotion has happened — always a 'customer' at this point.
  redirect("/portal");
}

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { sent: false, error: "Email is required." };
  }

  const supabase = await createClient();
  // Supabase deliberately never reveals whether the email is registered —
  // this always "succeeds". Don't branch the UI on whether the account
  // exists; that would leak registered emails to an attacker.
  await supabase.auth.resetPasswordForEmail(email);

  return { sent: true, error: null };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
