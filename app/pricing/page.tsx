import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../site-nav";
import PricingCalculator from "./pricing-calculator";

export const metadata: Metadata = {
  title: "Pricing — Binary Timber Holdings",
  description: "Estimate the cost of a custom AI software build by feature.",
};

export default function PricingPage() {
  return (
    <>
      <SiteNav />
      <main className="app-page">
        <h1>AI Software Dev pricing</h1>
        <p>
          Pick the features your project needs for a rough cost range. This is a starting point
          for a conversation, not a binding quote — every project gets scoped properly before
          work begins.
        </p>
        <PricingCalculator />
        <p style={{ marginTop: "2rem", color: "var(--ink-soft)" }}>
          Looking for CNC Manufacturing? <Link href="/#contact">Get in touch</Link> for a custom
          quote.
        </p>
      </main>
    </>
  );
}
