import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import PortalContent from "./portal-content";
import type { IntakePayload } from "./actions";

export default async function PortalPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/auth/login");

  const email = data.claims.email as string | undefined;
  const userId = data.claims.sub as string;

  const { data: submissions } = await supabase
    .from("intake_submissions")
    .select("payload")
    .eq("customer_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  const submission = submissions?.[0];

  return (
    <main className="app-page">
      <h1>Welcome{email ? `, ${email}` : ""}</h1>

      <PortalContent submission={submission ? (submission.payload as IntakePayload) : null} />

      <form action={logout}>
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
