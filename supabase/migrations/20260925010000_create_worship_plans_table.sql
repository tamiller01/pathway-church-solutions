-- Worship plans table: stores saved worship plans generated in the Worship Planner
create table if not exists public.worship_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Untitled Worship Plan',
  theme text,
  scripture text,
  style text,
  notes text,
  plan_json jsonb not null,
  assignments jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.worship_plans enable row level security;

-- Matches the permissive access pattern used by the existing `sermons` table
-- (anon key reads/writes, no per-user auth gating yet).
create policy "Public read access on worship_plans"
  on public.worship_plans for select
  using (true);

create policy "Public insert access on worship_plans"
  on public.worship_plans for insert
  with check (true);
