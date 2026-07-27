# Binary Timber Holdings

Marketing site + customer intake platform for Binary Timber Holdings, LLC. Built
with Next.js (App Router), Supabase (auth + Postgres + RLS), and deployed on Vercel.

See **[docs/SCOPING.md](docs/SCOPING.md)** for the architecture, data model, security
posture (SOC 2-aligned, OWASP Top 10 / ASVS L1), and phased roadmap.

## What's live

- **Marketing site** — `/`, plus a public **`/pricing`** calculator (AI Software Dev
  feature picker with a live, market-researched cost estimate)
- **Invite-only auth** — login, logout, forgot-password, all via Supabase Auth
  (`/auth/*`); no public signup
- **Customer portal** (`/portal`) — submit and edit a project intake; feature/platform
  picker for AI Software Dev with a live estimate; a build-scope brief (recommended
  stack + security checklist) is generated per submission
- **Email notifications** — customer + admin both get emailed on submit and on edit
- **`/admin`** — stub; the real submissions list is the next build

## Stack

- **Next.js 15** (App Router, TypeScript) on **Vercel**
- **pnpm** (pinned via `packageManager`; run through Corepack)
- **Supabase** (auth + Postgres, RLS deny-by-default) — separate dev/prod projects
- **Resend** (transactional email, via SMTP for Supabase Auth emails and via API for
  app-triggered notifications)

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

Copy `.env.example` → `.env.local` and fill in real values (use the **dev** Supabase
project locally — never prod). **Never commit `.env.local`** — all `.env*` files are
gitignored except the example.

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Transactional email for app-triggered notifications |
| `RESEND_FROM` | Sender address (defaults to `hello@chefhub.dev` if unset) |
| `ADMIN_EMAIL` | Recipient for contact-form and intake-submission notifications |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe, RLS-gated key |
| `SUPABASE_SECRET_KEY` | Server-only, bypasses RLS — never expose to the client |

In Vercel, `RESEND_*`/`ADMIN_EMAIL` are scoped to Production+Preview together; the
Supabase keys are scoped separately per environment (Production → prod project,
Preview → dev project), so PR preview deploys never touch production data.

## Database migrations

SQL migrations live in `supabase/migrations/`. Workflow:

1. Write/test a migration against the **dev** project via the Supabase SQL Editor
2. Commit the migration file, open a PR
3. On merge to `main`, the **prod** Supabase project (GitHub integration, "Deploy to
   production" enabled, watching `main`) applies it automatically — dev is manual,
   prod is automatic, by design

## Deploy

Connected to Vercel; every push to `main` auto-deploys to production, every other
branch/PR gets its own Preview deployment. Vercel auto-detects Next.js. Set
environment variables in **Vercel → Project → Settings → Environment Variables**.

## CI & security

`.github/workflows/ci.yml` runs on every push and PR:

- **Lint · Typecheck · Build**
- **Production dependency audit** (`pnpm audit --prod --audit-level=high`) — blocking
- **Full audit** — informational
- **Secret scan** (gitleaks) over history / PR diff

Also enabled on the repo: branch protection on `main` (PR + passing CI required),
CodeQL, GitHub secret scanning + push protection, and Renovate for dependency updates
(`renovate.json`, grouped weekly, auto-merge on low-risk updates).

## Next up

- `/admin` — real submissions list (currently a stub)
- MFA for admin login
- See `docs/SCOPING.md` §5/§7 for the full v1 checklist and roadmap
