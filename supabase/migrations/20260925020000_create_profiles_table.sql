-- Profiles table: maps auth users to a Pathway Church Solutions system role.
-- Roles per docs/PathwaySolutions Vision "User Roles" section: pastor, reviewer, admin, super_admin.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'pastor' check (role in ('pastor', 'reviewer', 'admin', 'super_admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users may only read/write their own profile row (least-privilege, unlike the public
-- content tables which are intentionally permissive).
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);
