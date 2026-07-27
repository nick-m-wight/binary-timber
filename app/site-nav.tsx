/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Absolute paths (/#about, not #about) so these work correctly from any
// page, not just when rendered on / itself.
//
// Session-aware: an already-authenticated visitor (e.g. clicked the logo
// from /portal to get back to the marketing site) sees a direct link back
// to their portal/admin instead of "Sign In" — otherwise they'd have to
// re-enter credentials just to get back to their own submission.
export default async function SiteNav() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub as string | undefined;

  let authLink = { href: "/auth/login", label: "Sign In" };
  if (userId) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
    authLink =
      profile?.role === "admin"
        ? { href: "/admin", label: "Admin" }
        : { href: "/portal", label: "My Portal" };
  }

  return (
    <nav aria-label="Main navigation">
      <Link href="/" className="logo" aria-label="Binary Timber Holdings — Home">
        <img src="/hort.png" alt="Binary Timber Holdings" className="logo-img" />
      </Link>
      <ul>
        <li><Link href="/#about">About</Link></li>
        <li><Link href="/#projects">Projects</Link></li>
        <li><Link href="/#showcase">Showcase</Link></li>
        <li><Link href="/#contact">Contact</Link></li>
        <li><Link href="/pricing">Pricing</Link></li>
        <li><Link href={authLink.href}>{authLink.label}</Link></li>
      </ul>
    </nav>
  );
}
