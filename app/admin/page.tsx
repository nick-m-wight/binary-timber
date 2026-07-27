import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import AppNav from "../app-nav";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/auth/login");

  const userId = data.claims.sub as string;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (profile?.role !== "admin") redirect("/portal");

  return (
    <>
      <AppNav />
      <main className="app-page">
        <h1>Admin</h1>
        <p>Customer submissions list lands here next.</p>
        <form action={logout}>
          <button type="submit">Sign out</button>
        </form>
      </main>
    </>
  );
}
