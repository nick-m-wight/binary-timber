/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

// Absolute paths (/#about, not #about) so these work correctly from any
// page, not just when rendered on / itself.
export default function SiteNav() {
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
        <li><Link href="/auth/login">Sign In</Link></li>
      </ul>
    </nav>
  );
}
