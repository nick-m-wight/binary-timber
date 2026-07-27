/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

// Nav for authenticated app pages (/portal, /admin) — no "Sign In" (already
// signed in) and no marketing-page anchor links (not relevant navigation
// from within the app).
export default function AppNav() {
  return (
    <nav aria-label="Main navigation">
      <Link href="/" className="logo" aria-label="Binary Timber Holdings — Home">
        <img src="/hort.png" alt="Binary Timber Holdings" className="logo-img" />
      </Link>
      <ul>
        <li><Link href="/pricing">Pricing</Link></li>
      </ul>
    </nav>
  );
}
