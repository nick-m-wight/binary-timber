// AI Software Dev feature catalog: prices, platform add-ons, and the
// service/security metadata used to generate a build-scope brief.
// Hardcoded by design for v1 — a price change is a reviewed code change,
// not a live-editable admin setting (see docs/SCOPING.md's "thin slice"
// approach). Ranges are informed estimates, not published rate-card
// numbers; expect to tune them as you get real signal on actual quotes.

export type Feature = {
  id: string;
  label: string;
  priceLow: number;
  priceHigh: number;
  recommendedServices: string[];
  securityNotes: string[];
};

export type Platform = {
  id: string;
  label: string;
  priceLow: number;
  priceHigh: number;
};

export const BASE_ESTIMATE = { low: 8000, high: 15000 };

export const FEATURES: Feature[] = [
  {
    id: "auth",
    label: "User authentication & accounts",
    priceLow: 2000,
    priceHigh: 5000,
    recommendedServices: ["Supabase Auth"],
    securityNotes: [
      "RLS deny-by-default on every table",
      "MFA for privileged/admin roles",
      "Rate-limit auth endpoints",
    ],
  },
  {
    id: "multi-env",
    label: "Multiple environments (dev/staging/prod)",
    priceLow: 1000,
    priceHigh: 3000,
    recommendedServices: [
      "Separate Vercel Preview/Production environments",
      "Separate Supabase dev/prod projects",
    ],
    securityNotes: ["Never put production secrets in a preview or dev environment"],
  },
  {
    id: "admin-dashboard",
    label: "Admin dashboard",
    priceLow: 3000,
    priceHigh: 8000,
    recommendedServices: ["Role-based access via a profiles/roles table"],
    securityNotes: ["Server-side role checks on every admin route, not just hiding UI"],
  },
  {
    id: "payments",
    label: "Payment processing",
    priceLow: 3000,
    priceHigh: 8000,
    recommendedServices: ["Stripe Checkout / Billing"],
    securityNotes: [
      "Never handle raw card data — use Stripe Checkout (PCI SAQ-A)",
      "Verify webhook signatures",
    ],
  },
  {
    id: "file-uploads",
    label: "File/image uploads & storage",
    priceLow: 1500,
    priceHigh: 4000,
    recommendedServices: ["Supabase Storage"],
    securityNotes: ["Validate file type/size server-side", "Signed URLs for private files"],
  },
  {
    id: "realtime",
    label: "Real-time features (live updates, streaming)",
    priceLow: 4000,
    priceHigh: 12000,
    recommendedServices: ["Supabase Realtime"],
    securityNotes: ["RLS applies to realtime subscriptions too — verify it's enforced"],
  },
  {
    id: "background-jobs",
    label: "Background jobs / scheduled tasks",
    priceLow: 1500,
    priceHigh: 4000,
    recommendedServices: ["Vercel Cron", "Inngest/Trigger.dev for complex workflows"],
    securityNotes: ["Cron endpoints must require a secret token — never publicly triggerable"],
  },
  {
    id: "third-party-api",
    label: "Third-party API integration",
    priceLow: 1500,
    priceHigh: 5000,
    recommendedServices: ["Varies by provider"],
    securityNotes: ["API keys server-only, never shipped to the client", "Least-privilege scoped keys"],
  },
  {
    id: "ai-parsing",
    label: "Document/text parsing with AI",
    priceLow: 3000,
    priceHigh: 8000,
    recommendedServices: ["Claude API"],
    securityNotes: ["Validate/sanitize input before sending to the model", "Rate-limit for cost control"],
  },
  {
    id: "ai-vision",
    label: "Image analysis with AI (vision)",
    priceLow: 3000,
    priceHigh: 8000,
    recommendedServices: ["Claude API (vision)"],
    securityNotes: ["Limit upload size before sending to the model", "Rate-limit for cost control"],
  },
  {
    id: "ai-voice",
    label: "Voice/conversational AI integration",
    priceLow: 4000,
    priceHigh: 10000,
    recommendedServices: ["Voice API (e.g. Bland.ai)"],
    securityNotes: ["Rate-limit call volume", "Secure the webhook endpoint receiving call results"],
  },
  {
    id: "ai-ranking",
    label: "AI-powered ranking or scoring",
    priceLow: 3000,
    priceHigh: 7000,
    recommendedServices: ["Claude API", "Scheduled job (see Background jobs)"],
    securityNotes: ["Don't expose ranking prompts/logic if the score could be gamed"],
  },
  {
    id: "ai-nl-logic",
    label: "Natural-language-to-logic (AI-generated rules/formulas)",
    priceLow: 4000,
    priceHigh: 10000,
    recommendedServices: ["Claude API", "Custom sandboxed evaluator"],
    securityNotes: ["Never eval() generated logic — use a safe parser/interpreter", "Validate generated output before execution"],
  },
];

export const PLATFORMS: Platform[] = [
  { id: "web", label: "Web only", priceLow: 0, priceHigh: 0 },
  { id: "ios", label: "iOS", priceLow: 15000, priceHigh: 35000 },
  { id: "android", label: "Android", priceLow: 15000, priceHigh: 35000 },
  { id: "both", label: "iOS and Android", priceLow: 25000, priceHigh: 55000 },
];

const FEATURE_IDS = new Set(FEATURES.map((f) => f.id));
const PLATFORM_IDS = new Set(PLATFORMS.map((p) => p.id));

export function isValidFeatureId(id: string): boolean {
  return FEATURE_IDS.has(id);
}

export function isValidPlatformId(id: string): boolean {
  return PLATFORM_IDS.has(id);
}

export function computeEstimate(featureIds: string[], platformId: string | undefined) {
  const features = FEATURES.filter((f) => featureIds.includes(f.id));
  const platform = PLATFORMS.find((p) => p.id === platformId);

  const low =
    BASE_ESTIMATE.low + features.reduce((sum, f) => sum + f.priceLow, 0) + (platform?.priceLow ?? 0);
  const high =
    BASE_ESTIMATE.high + features.reduce((sum, f) => sum + f.priceHigh, 0) + (platform?.priceHigh ?? 0);

  return { low, high };
}

function collectServicesAndSecurity(featureIds: string[]) {
  const services = new Set<string>();
  const security = new Set<string>();
  for (const f of FEATURES.filter((f) => featureIds.includes(f.id))) {
    f.recommendedServices.forEach((s) => services.add(s));
    f.securityNotes.forEach((s) => security.add(s));
  }
  return { services: [...services], security: [...security] };
}

/** Assembles a markdown build-scope brief from selected features — the
 * recommended stack + security checklist to hand off to the dev. */
export function generateBuildScope(featureIds: string[], platformId: string | undefined): string {
  const { services, security } = collectServicesAndSecurity(featureIds);
  const platform = PLATFORMS.find((p) => p.id === platformId);

  const lines: string[] = [];
  lines.push("## Recommended Stack", "");
  lines.push(...(services.length ? services.map((s) => `- ${s}`) : ["- (base build only)"]));
  lines.push("", "## Platform", "", `- ${platform?.label ?? "Web only"}`);
  lines.push("", "## Security Checklist", "");
  lines.push(...(security.length ? security.map((s) => `- [ ] ${s}`) : ["- (none beyond baseline)"]));

  return lines.join("\n");
}

/** Same brief, as HTML — for the admin notification email. */
export function generateBuildScopeHtml(featureIds: string[], platformId: string | undefined): string {
  const { services, security } = collectServicesAndSecurity(featureIds);
  const platform = PLATFORMS.find((p) => p.id === platformId);
  const list = (items: string[], fallback: string) =>
    `<ul style="margin:0.4rem 0 0;padding-left:1.2rem;">${
      items.length ? items.map((s) => `<li>${s}</li>`).join("") : `<li>${fallback}</li>`
    }</ul>`;

  return `
    <div style="margin-top:1rem;">
      <strong>Recommended stack</strong>
      ${list(services, "Base build only")}
    </div>
    <div style="margin-top:1rem;">
      <strong>Platform</strong>
      <p style="margin:0.4rem 0 0;">${platform?.label ?? "Web only"}</p>
    </div>
    <div style="margin-top:1rem;">
      <strong>Security checklist</strong>
      ${list(security, "None beyond baseline")}
    </div>
  `;
}
