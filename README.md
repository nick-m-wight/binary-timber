# Binary Timber Holdings

Marketing site for Binary Timber Holdings, LLC — evolving into an authenticated
**customer intake + portal** and internal **CRM**. Built with Next.js (App Router)
and deployed on Vercel.

See **[docs/SCOPING.md](docs/SCOPING.md)** for the architecture, data model, security
posture (SOC 2-aligned, OWASP Top 10 / ASVS L1), and phased roadmap.

## Stack

- **Next.js 15** (App Router, TypeScript) on **Vercel**
- **pnpm** (pinned via `packageManager`; run through Corepack)
- Supabase (auth + Postgres + RLS) — _added in Phase 2_

## Local development

pnpm is pinned in `package.json`. If pnpm isn't on your PATH, run it through
Corepack (bundled with Node ≥ 20) — no global install needed:

```bash
corepack pnpm@11.17.0 install
corepack pnpm@11.17.0 dev
```

If `corepack enable` works on your machine (may need admin on Windows), you can drop
the prefix and just use `pnpm install`, `pnpm dev`, etc.

The dev server runs at http://localhost:3000.

### Scripts

| Command | What it does |
|---------|--------------|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint (Next core-web-vitals) |
| `pnpm typecheck` | `tsc --noEmit` |

## Environment variables

Copy `.env.example` → `.env.local` and fill in real values. **Never commit
`.env.local`** — all `.env*` files are gitignored except the example.

- `RESEND_API_KEY` — transactional email for the contact form.

## Deploy

Connected to Vercel; every push to `main` auto-deploys. Vercel auto-detects Next.js
(no `vercel.json` needed). Set environment variables in **Vercel → Project → Settings
→ Environment Variables**.

## CI & security

`.github/workflows/ci.yml` runs on every push and PR:

- **Lint · Typecheck · Build**
- **Production dependency audit** (`pnpm audit --prod --audit-level=high`) — blocking
- **Full audit** — informational
- **Secret scan** (gitleaks) over history / PR diff

`main` should be protected (require PR review + passing CI, no direct pushes). See
`docs/SCOPING.md` §4.

## Remaining launch TODOs

- Verify `binarytimber.com` in Resend (DNS records go in the **Vercel** dashboard —
  the domain uses Vercel nameservers), then set `RESEND_FROM=hello@binarytimber.com`
  in Vercel env vars. No code change needed. See `docs/SCOPING.md` §8.
- Replace `public/hort.png` OG image with a confirmed 1200×630 asset if desired.
- Generate the full favicon set (`favicon.ico`, `apple-touch-icon.png`) from
  `public/favicon.svg` via [realfavicongenerator.net](https://realfavicongenerator.net).
