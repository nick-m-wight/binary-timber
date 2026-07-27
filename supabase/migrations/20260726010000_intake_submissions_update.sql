-- Adds editing to intake_submissions: an updated_at column + touch trigger
-- (reusing touch_updated_at() from the initial migration), and an UPDATE
-- policy so a customer can edit their own submission. Still constrained to
-- status = 'new' on the resulting row, same as insert — a customer can
-- never set any other status; editing always resets it to 'new' to flag
-- the change for another admin look.

alter table public.intake_submissions
  add column updated_at timestamptz not null default now();

create trigger intake_submissions_touch_updated_at
  before update on public.intake_submissions
  for each row execute function public.touch_updated_at();

create policy "intake_submissions: update own"
  on public.intake_submissions for update
  using (customer_id = auth.uid())
  with check (customer_id = auth.uid() and status = 'new');
