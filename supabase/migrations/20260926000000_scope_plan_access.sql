-- Associate saved plans with their creating user. Legacy plans remain unowned and are
-- visible only to Reviewer/Admin/Super Admin roles until explicitly reassigned.
alter table public.sermons
  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.worship_plans
  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.plans
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists sermons_user_id_created_at_idx
  on public.sermons (user_id, created_at desc);

create index if not exists worship_plans_user_id_created_at_idx
  on public.worship_plans (user_id, created_at desc);

create index if not exists plans_user_id_created_at_idx
  on public.plans (user_id, created_at desc);

-- Role changes must go through the admin-only server API, never a user's own profile row.
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Users can create pastor profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id and role = 'pastor');

-- Replace every existing policy on saved-plan tables: permissive policies combine with OR.
do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('sermons', 'worship_plans', 'plans')
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      existing_policy.policyname,
      existing_policy.schemaname,
      existing_policy.tablename
    );
  end loop;
end
$$;

alter table public.sermons enable row level security;
alter table public.worship_plans enable row level security;
alter table public.plans enable row level security;

create policy "Plan owners and reviewers can read sermons"
  on public.sermons for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('reviewer', 'admin', 'super_admin')
    )
  );

create policy "Creators can insert own sermons"
  on public.sermons for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('pastor', 'admin', 'super_admin')
    )
  );

create policy "Plan owners and reviewers can read worship plans"
  on public.worship_plans for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('reviewer', 'admin', 'super_admin')
    )
  );

create policy "Creators can insert own worship plans"
  on public.worship_plans for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('pastor', 'admin', 'super_admin')
    )
  );

create policy "Plan owners and reviewers can read discipleship plans"
  on public.plans for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('reviewer', 'admin', 'super_admin')
    )
  );

create policy "Creators can insert own discipleship plans"
  on public.plans for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('pastor', 'admin', 'super_admin')
    )
  );
