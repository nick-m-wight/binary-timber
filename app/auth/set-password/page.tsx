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
      <p>Enter a new password below.</p>
      <SetPasswordForm />
    </main>
  );
}
