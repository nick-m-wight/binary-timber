import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";

export default async function PortalPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/auth/login");

  const email = data.claims.email as string | undefined;

  return (
    <main className="app-page">
      <h1>Welcome{email ? `, ${email}` : ""}</h1>
      <p>Intake and project settings land here next.</p>
      <form action={logout}>
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
