# Binary Timber — CRM & Customer Intake Platform: Scoping

Status: **Draft for review** · Branch: `feat/crm-intake` · Owner: Nick Wight

This document scopes the evolution of the Binary Timber site from a static marketing
page into an authenticated application: a **customer intake + portal** on the front,
and an **internal CRM** on the back. Security is a first-class requirement, with a
roadmap toward **SOC 2 Type II** readiness.

---

## 1. Vision & scope boundary

**Today:** Static HTML/CSS/JS marketing site on Vercel + one serverless function
(`api/contact.js`) that emails contact-form submissions via Resend.

**Target:** Same public marketing site, plus:
- **Customer portal** — customers create accounts, complete an intake, and view/edit
  their own project settings.
- **Admin/CRM** — you (and future team members) see all customers, their intake
  submissions, and project records.

**Explicitly out of scope for now** (tracked on the roadmap — §7 Backlog): billing/payments,
contract e-signing, ticketing, customer-to-customer visibility, mobile apps, public API.

### Personas & roles

| Role | Who | Can do |
|------|-----|--------|
| `visitor` | Anyone | View marketing page, submit public contact form, sign up |
| `customer` | Authenticated client | Complete intake, view/edit **their own** project settings only |
| `admin` | You / staff | View all customers + submissions; manage records; MFA required |

Deny-by-default: a `customer` can never read another customer's data. Enforced at the
**database layer** (Postgres Row-Level Security), not just in app code.

---

## 2. Architecture

```
                    ┌───────────────────────────────────────┐
                    │            Vercel (Next.js)            │
  Browser  ──TLS──▶ │  App Router                            │
                    │   /            marketing (public)      │
                    │   /contact     public contact form     │
                    │   /login /signup   Supabase Auth       │
                    │   /portal/*    customer (auth: customer)│
                    │   /admin/*     CRM (auth: admin + MFA)  │
                    │   Server Actions / Route Handlers       │
                    └───────────────┬───────────────────────┘
                                    │ service role (server only)
                                    ▼
                    ┌───────────────────────────────────────┐
                    │              Supabase                  │
                    │  Auth (email+password, MFA/TOTP)       │
                    │  Postgres (RLS deny-by-default)        │
                    │  Storage (optional, later)             │
                    └───────────────────────────────────────┘
                                    │
                    Resend (transactional email — existing)
```

**Key decisions**
- **Next.js App Router** — server components/actions keep secrets server-side; the
  marketing page becomes a static route (no perf regression); one Vercel deploy.
- **Supabase** — managed auth + Postgres + RLS in one SOC 2-compliant vendor. RLS gives
  us per-customer data isolation at the database, the strongest place to enforce it.
- **Two Supabase keys:** the `anon` key (browser, RLS-gated) and the `service_role` key
  (**server only, never shipped to the client**) for admin operations.

---

## 3. Data model (v1)

Postgres. `auth.users` is managed by Supabase; our tables reference `auth.users.id`.

```
profiles
  id           uuid  PK, FK → auth.users.id
  role         text  enum('customer','admin')  default 'customer'
  full_name    text
  company      text
  created_at   timestamptz default now()

intake_submissions
  id           uuid  PK default gen_random_uuid()
  customer_id  uuid  FK → auth.users.id
  status       text  enum('new','reviewing','accepted','archived') default 'new'
  payload      jsonb            -- intake answers + a snapshot of the computed
                                 -- estimate/buildScope at submit-or-edit time
  created_at   timestamptz default now()
  updated_at   timestamptz default now()  -- added post-v1: customers can edit their
                                           -- submission (RLS update policy, resets
                                           -- status to 'new' on every edit)

project_settings
  id           uuid  PK default gen_random_uuid()
  customer_id  uuid  FK → auth.users.id
  name         text
  settings     jsonb            -- flexible per-project config
  updated_at   timestamptz default now()

audit_log                         -- append-only, admin-read-only
  id           bigint PK
  actor_id     uuid
  action       text              -- e.g. 'intake.submit', 'settings.update'
  target       text
  metadata     jsonb
  created_at   timestamptz default now()
```

**RLS policy shape (every table, deny-by-default):**
- `customer`: `USING (customer_id = auth.uid())` for select/insert/update on their rows.
- `admin`: full read (write where appropriate) via a role check.
- `audit_log`: insert via server only; select restricted to `admin`; **no** update/delete.

---

## 4. Security practices — set up now (SOC 2-aligned)

SOC 2 is ~80% documented policy + consistent evidence and ~20% technical controls.
We can't "code" a SOC 2 cert, but we can build the technical controls and the paper
trail from day one so a future audit (via Vanta/Drata + a CPA firm) is cheap. Mapped to
the Trust Services Criteria (mostly **Security / Common Criteria**).

**Access control & auth**
- [x] RLS deny-by-default on every table; least-privilege DB roles.
- [x] `service_role`/secret key used **only** in server code; never in client bundles.
- [ ] MFA (TOTP) required for `admin`; offered to customers. **Next up.**
- [x] Server-side authorization checks on every mutating action (never trust the client)
      — includes the cost estimate, recomputed server-side from the catalog on every
      intake submit rather than trusted from the client.

**Secrets & configuration**
- [x] All secrets in Vercel/Supabase env vars; `.env*` gitignored.
- [x] Secret scanning in CI (`gitleaks`) + GitHub secret scanning & push protection.
- [ ] Documented key-rotation procedure; separate keys per environment.
- [x] Business credentials (dashboard logins, DB passwords, API key backups) kept in a
      dedicated space in the password manager, separate from personal items — currently
      a folder in personal Bitwarden. **Note:** a folder is organizational only, not an
      access-control boundary (can't be shared independently). Migrate to a Bitwarden
      Organization + Collection the moment a second person (contractor, co-founder) needs
      access to any business system.

**Software supply chain**
- [x] Lockfile committed; Renovate for updates (grouped weekly, auto-merge low-risk).
- [x] CI runs lint + typecheck + build + `pnpm audit` + CodeQL on every PR.
- [x] Branch protection on `main`: no direct pushes, PR + passing CI required.

**Data protection**
- [x] Encryption at rest (Supabase default) + TLS in transit (Vercel default).
- [ ] Data classification + retention policy (`docs/DATA-POLICY.md`, to write).
- [x] No PII in application logs — errors logged are generic (send failures, etc.),
      not submission content.

**Auditability & operations**
- [ ] Immutable `audit_log` for sensitive actions — table + RLS exist (admin-read-only,
      no client write path), nothing writes to it yet. **Next up, alongside `/admin`.**
- [ ] Vendor/subprocessor register (Vercel, Supabase, Resend) — `docs/VENDORS.md`.
- [ ] Incident-response runbook stub — `docs/INCIDENT-RESPONSE.md`.

**OWASP alignment.** The app is built against the **OWASP Top 10 (2021)** as a baseline
threat lens, and targets **OWASP ASVS Level 1** for v1 (Level 2 as the product matures).
Most Top 10 categories are already covered by the controls above; the mapping and the few
net-new requirements:

| OWASP (2021) | Control in this app |
|---|---|
| A01 Broken Access Control | RLS deny-by-default + server-side authz on every mutation |
| A02 Cryptographic Failures | TLS in transit, encryption at rest, secrets server-only |
| A03 Injection | Parameterized Supabase queries; **zod input validation** on all inputs |
| A04 Insecure Design | Scoping + threat modeling before build |
| A05 Security Misconfiguration | **Secure HTTP headers**, least-privilege keys, env separation |
| A06 Vulnerable Components | Dependabot + `npm audit` + CodeQL |
| A07 Auth Failures | Supabase Auth, admin MFA, session mgmt, **rate-limiting on auth** |
| A08 Data/Software Integrity | Committed lockfile, CI gates, trusted deploys |
| A09 Logging/Monitoring Failures | Immutable `audit_log`, structured logs, alerting |
| A10 SSRF | Validate/whitelist outbound calls; no user-controlled fetch |

Net-new controls this adds to the checklist:
- [x] **zod validation on every input** — implemented for the intake form
      (`app/portal/actions.ts`); the contact form still uses manual checks and should
      be brought in line.
- [ ] **Rate-limiting on auth endpoints** — Supabase Auth has its own built-in limits,
      but nothing app-specific has been added.
- [ ] **Secure HTTP response headers** (CSP, HSTS, `X-Content-Type-Options`, etc.) —
      not yet configured in `next.config.mjs`.

**Reality check:** Full SOC 2 Type II also needs org-level policies (HR, change
management, risk assessment, ~6–12 months of evidence) and an auditor. Those are
tracked separately; this repo owns the technical + engineering-process controls.

---

## 5. v1 — thin vertical slice

Goal: prove the architecture and the security model end to end with the smallest
possible feature set. Everything else is deferred.

**In scope** — status as of this build:
1. [x] Next.js migration: marketing page served as-is under `/`; app scaffolding in place.
2. [x] Supabase project + schema + RLS policies above.
3. [x] Auth: invite-only sign-up (no public signup route) / login / logout / forgot-password.
4. [x] Customer can submit an intake form → stored in `intake_submissions`, **editable**
   (a v1 restriction that was lifted once tested — see below).
5. [~] Customer `/portal` shows their submission (editable) — but not a separate
   `project_settings` record; that table exists in the schema but has no UI yet.
6. [ ] Admin `/admin` lists all submissions (read-only), behind `admin` role + MFA —
   still a stub. **Next up.**
7. [ ] `audit_log` writes on intake submit + settings update — table + RLS exist,
   nothing writes to it yet.
8. [x] CI pipeline + branch protection + secret scanning.

**Scope that shifted from the original plan** (built once real usage made the need
clear, not originally in v1):
- **AI Software Dev feature/platform picker** with a live, market-researched cost
  estimate (`lib/feature-catalog.ts`) — the intake form is now much richer than plain
  free text for that division
- **Public `/pricing`** page — same calculator, no sign-in required
- **Email notifications on submit *and* edit** — originally deferred to a later phase,
  built now since the customer/admin loop needed it to be useful in practice
- **Build-scope brief** generated per submission (recommended stack + security
  checklist from selected features) — a head start on what was "admin edit of
  records," feeding a future `/admin` view instead of being fully deferred

**Definition of done for v1**
- [x] A brand-new customer can sign up (via invite), submit intake, and see it stored.
- [ ] That customer provably cannot read another customer's data — RLS is deny-by-default
  and enforces this by construction, but there's no automated **test** proving it yet.
- [ ] You can log in as admin (with MFA) and see all submissions — admin login works;
  MFA and the submissions list are still open.
- [x] CI is green; no secrets in the repo; `main` is protected.

---

## 6. Migration plan (marketing site → Next.js)

1. `create-next-app` (TypeScript, App Router, ESLint) into the repo.
2. Port `index.html` → `app/page.tsx` + move `css/styles.css` into the app; keep visual
   output identical (verify against current site in the browser preview).
3. Keep `public/` assets. Retire `vercel.json`'s static config (Next.js handles routing).
4. Reimplement the existing contact form as a Server Action calling Resend (removes the
   standalone `api/contact.js`, or keep it as a route handler).
5. Add Supabase client/server helpers, middleware for protected routes.
6. Layer in auth, schema, portal, admin per §5.

Each step is a small PR against `feat/crm-intake` (or sub-branches), so the marketing
site keeps working throughout.

---

## 7. Phased roadmap

- **Phase 0:** scoping + decisions. ✅ Done.
- **Phase 1:** Next.js migration, marketing parity, CI + branch protection. ✅ Done, live.
- **Phase 2:** Supabase, auth, RLS, v1 vertical slice (§5). **Mostly done, live in
  prod** — auth, schema/RLS, intake (with the feature picker + pricing calculator
  pulled forward from Phase 3), edit capability, email notifications. Remaining:
  `/admin` submissions list, MFA, the RLS isolation test. ← we are here
- **Phase 3:** CRM depth — pipeline statuses, notes/activity feed, `project_settings`
  UI. Email notifications already shipped in Phase 2, ahead of schedule.
- **Phase 4:** SOC 2 hardening — policies, audit tooling (Vanta/Drata), pen test.
- **Backlog (future phases, unscheduled):** billing/payments, contract e-signing,
  ticketing/support, customer-to-customer collaboration, mobile app, public API.
- **Backlog task — email domain migration:** verify `binarytimber.com` in Resend
  (SPF/DKIM/DMARC) and switch the transactional `from` from `hello@chefhub.dev` to
  `hello@binarytimber.com`. See §8. Do not flip code until the domain shows Verified.

---

## 8. Open decisions / needed inputs

| # | Decision | Notes |
|---|----------|-------|
| 1 | Production domain: **`binarytimber.com`** (confirmed) | Needed for auth redirect URLs + email `from`. |
| 2 | Transactional email `from` | **Migrate to `hello@binarytimber.com`.** Sender is now env-driven (`RESEND_FROM`, defaults to `hello@chefhub.dev`). Task: verify `binarytimber.com` in Resend (SPF/DKIM/DMARC records added in **Vercel** DNS — domain uses `ns1/ns2.vercel-dns.com`), then set `RESEND_FROM=hello@binarytimber.com` in Vercel env vars. No code change/deploy needed to switch. |
| 3 | Customer sign-up | **Invite-only** ✅ decided — safer early + cleaner SOC 2 story. |
| 4 | Package manager | **pnpm** ✅ decided. |
| 5 | Environments | **Separate Supabase projects** for dev vs. prod ✅ decided. |

---

## 9. Assumptions

- Solo developer initially; keep operational overhead low.
- Vercel + Supabase free/pro tiers are acceptable for early stage.
- No regulated data (HIPAA/PCI) in scope — general business + project data only.
