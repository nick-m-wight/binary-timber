-- Initial schema: profiles, intake_submissions, project_settings, audit_log.
-- RLS is deny-by-default on every table (docs/SCOPING.md §3-4) — no policy means
-- no access at all, even via the API. Admin writes and audit_log inserts happen
-- through the secret key server-side, which bypasses RLS by design.

create extension if not exists pgcrypto;

-- ============================================================================
-- Tables
-- ============================================================================

-- profiles — one row per auth.users, holds the customer/admin role
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  role       text not null default 'customer' check (role in ('customer', 'admin')),
  full_name  text,
  company    text,
  created_at timestamptz not null default now()
);

-- intake_submissions — a customer's intake form responses
create table public.intake_submissions (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users (id) on delete cascade,
  status      text not null default 'new'
                check (status in ('new', 'reviewing', 'accepted', 'archived')),
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index intake_submissions_customer_id_idx on public.intake_submissions (customer_id);

-- project_settings — a customer's editable project configuration
create table public.project_settings (
  id          uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users (id) on delete cascade,
  name        text not null default 'My Project',
  settings    jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

create index project_settings_customer_id_idx on public.project_settings (customer_id);

-- audit_log — append-only, admin-read-only, written only by the server
create table public.audit_log (
  id         bigint generated always as identity primary key,
  actor_id   uuid,
  action     text not null,
  target     text,
  metadata   jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_log_actor_id_idx on public.audit_log (actor_id);

-- ============================================================================
-- Helper: is_admin() — used by the RLS policies below.
-- SECURITY DEFINER so it can read profiles regardless of the caller's own
-- RLS grants (avoids recursive-policy issues); search_path pinned to avoid
-- search_path hijacking. Must be defined before any policy uses it.
-- ============================================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================================
-- RLS — deny-by-default: enabling RLS with zero policies blocks all access
-- until a policy explicitly grants it.
-- ============================================================================

alter table public.profiles enable row level security;

create policy "profiles: read own or admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

-- A user can update their own profile (name/company), but not their own role —
-- enforced separately by the prevent_role_change trigger below, since RLS
-- policies can't cleanly compare against the pre-update row.
create policy "profiles: update own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- No insert policy: rows are created only by the handle_new_user trigger
-- (runs as the trigger owner, bypassing RLS) — never directly by a client.

alter table public.intake_submissions enable row level security;

create policy "intake_submissions: read own or admin"
  on public.intake_submissions for select
  using (customer_id = auth.uid() or public.is_admin());

-- Customers can submit intake for themselves only, and only as status 'new' —
-- v1 has no customer or admin edit path for submissions (docs/SCOPING.md §5).
create policy "intake_submissions: insert own"
  on public.intake_submissions for insert
  with check (customer_id = auth.uid() and status = 'new');

alter table public.project_settings enable row level security;

create policy "project_settings: read own or admin"
  on public.project_settings for select
  using (customer_id = auth.uid() or public.is_admin());

create policy "project_settings: insert own"
  on public.project_settings for insert
  with check (customer_id = auth.uid());

-- v1: customers can edit their own settings; admin editing is a later phase.
create policy "project_settings: update own"
  on public.project_settings for update
  using (customer_id = auth.uid())
  with check (customer_id = auth.uid());

alter table public.audit_log enable row level security;

create policy "audit_log: admin read only"
  on public.audit_log for select
  using (public.is_admin());

-- No insert/update/delete policy for anon or authenticated: writes only
-- happen via the secret key server-side, which bypasses RLS. Immutable
-- to every authenticated client, including admins.

-- ============================================================================
-- Triggers
-- ============================================================================

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger project_settings_touch_updated_at
  before update on public.project_settings
  for each row execute function public.touch_updated_at();

-- Auto-create a profile row when a new user signs up. Always 'customer' —
-- admin is never self-service; promote manually via SQL editor (v1, solo
-- admin). SECURITY DEFINER: needed to insert into public.profiles from a
-- trigger on auth.users, since profiles has no client-facing insert policy.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (new.id, 'customer', new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Prevent a customer from escalating their own role via a profile update.
-- Blocks only when the caller is an ordinary logged-in client (auth.role() =
-- 'authenticated', set from the JWT, independent of this function's own
-- elevated privileges). Deliberately allows everything else through
-- (service_role, and the SQL editor's superuser session where auth.role()
-- is null) — those are exactly the two paths used to promote an admin.
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and auth.role() = 'authenticated' then
    raise exception 'Cannot change role directly';
  end if;
  return new;
end;
$$;

create trigger on_profile_role_change
  before update on public.profiles
  for each row execute function public.prevent_role_change();
