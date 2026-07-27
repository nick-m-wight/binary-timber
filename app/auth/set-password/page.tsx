import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SetPasswordForm from "./set-password-form";

export default async function SetPasswordPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/auth/login");

  return (
    <main className="auth-card">
      <h1>Set your password</h1>
      <p>Welcome — set a password to finish setting up your account.</p>
      <SetPasswordForm />
    </main>
  );
}
