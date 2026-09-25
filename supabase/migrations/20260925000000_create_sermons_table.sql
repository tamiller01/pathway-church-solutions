-- Sermons table: stores saved sermons generated in the Sermon Builder
create table if not exists public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Untitled Sermon',
  passage text,
  topic text,
  audience text,
  tone text,
  key_points text,
  outline_type text,
  sermon_html text,
  created_at timestamptz not null default now()
);

alter table public.sermons enable row level security;

-- Matches the permissive access pattern used by the existing `plans` table
-- (anon key reads/writes, no per-user auth gating yet).
create policy "Public read access on sermons"
  on public.sermons for select
  using (true);

create policy "Public insert access on sermons"
  on public.sermons for insert
  with check (true);
