-- Organization boundary for the private pilot. Each user starts in one organization;
-- membership is modeled separately so organization invitations can be added safely later.
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

alter table public.profiles
  add column if not exists organization_id uuid references public.organizations(id) on delete set null;

-- Give existing users isolated organizations before content receives its organization scope.
do $$
declare
  profile_row record;
  new_organization_id uuid;
begin
  for profile_row in select id, email from public.profiles where organization_id is null loop
    insert into public.organizations (name, owner_id)
    values (coalesce(nullif(split_part(profile_row.email, '@', 1), ''), 'Church') || ' Organization', profile_row.id)
    returning id into new_organization_id;

    update public.profiles set organization_id = new_organization_id where id = profile_row.id;
    insert into public.organization_members (organization_id, user_id)
    values (new_organization_id, profile_row.id)
    on conflict do nothing;
  end loop;
end
$$;

create or replace function public.ensure_profile_organization()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_organization_id uuid;
begin
  if new.organization_id is null then
    insert into public.organizations (name, owner_id)
    values (coalesce(nullif(split_part(new.email, '@', 1), ''), 'Church') || ' Organization', new.id)
    returning id into new_organization_id;
    new.organization_id := new_organization_id;
  end if;
  return new;
end;
$$;

drop trigger if exists ensure_profile_organization on public.profiles;
create trigger ensure_profile_organization
  before insert on public.profiles
  for each row execute function public.ensure_profile_organization();

create or replace function public.ensure_profile_membership()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.organization_members (organization_id, user_id)
  values (new.organization_id, new.id)
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists ensure_profile_membership on public.profiles;
create trigger ensure_profile_membership
after insert or update of organization_id on public.profiles
for each row execute function public.ensure_profile_membership();

alter table public.sermons
  add column if not exists organization_id uuid references public.organizations(id) on delete set null;
alter table public.worship_plans
  add column if not exists organization_id uuid references public.organizations(id) on delete set null;
alter table public.plans
  add column if not exists organization_id uuid references public.organizations(id) on delete set null;
alter table public.sunday_schedules
  add column if not exists organization_id uuid references public.organizations(id) on delete cascade;

update public.sermons content
set organization_id = profiles.organization_id
from public.profiles
where content.organization_id is null and content.user_id = profiles.id;
update public.worship_plans content
set organization_id = profiles.organization_id
from public.profiles
where content.organization_id is null and content.user_id = profiles.id;
update public.plans content
set organization_id = profiles.organization_id
from public.profiles
where content.organization_id is null and content.user_id = profiles.id;
update public.sunday_schedules schedules
set organization_id = profiles.organization_id
from public.profiles
where schedules.organization_id is null and schedules.user_id = profiles.id;

create index if not exists profiles_organization_id_idx on public.profiles (organization_id);
create index if not exists organization_members_user_id_idx on public.organization_members (user_id);
create index if not exists sermons_organization_id_created_at_idx on public.sermons (organization_id, created_at desc);
create index if not exists worship_plans_organization_id_created_at_idx on public.worship_plans (organization_id, created_at desc);
create index if not exists plans_organization_id_created_at_idx on public.plans (organization_id, created_at desc);
create index if not exists sunday_schedules_organization_id_date_idx on public.sunday_schedules (organization_id, service_date);

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;

create policy "Members can view their organization"
  on public.organizations for select to authenticated
  using (id in (select organization_id from public.organization_members where user_id = auth.uid()));

create policy "Users can view own organization membership"
  on public.organization_members for select to authenticated
  using (user_id = auth.uid());

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('sermons', 'worship_plans', 'plans', 'sunday_schedules')
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

create policy "Organization members can read sermons"
  on public.sermons for select to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and organization_id = sermons.organization_id
        and (user_id = auth.uid() or role in ('reviewer', 'admin', 'super_admin'))
    )
  );

create policy "Sermon creators can insert in their organization"
  on public.sermons for insert to authenticated
  with check (
    user_id = auth.uid()
    and organization_id = (select organization_id from public.profiles where id = auth.uid())
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('pastor', 'admin', 'super_admin'))
  );

create policy "Organization members can read worship plans"
  on public.worship_plans for select to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and organization_id = worship_plans.organization_id
        and (user_id = auth.uid() or role in ('reviewer', 'admin', 'super_admin'))
    )
  );

create policy "Worship creators can insert in their organization"
  on public.worship_plans for insert to authenticated
  with check (
    user_id = auth.uid()
    and organization_id = (select organization_id from public.profiles where id = auth.uid())
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('pastor', 'admin', 'super_admin'))
  );

create policy "Organization members can read discipleship plans"
  on public.plans for select to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and organization_id = plans.organization_id
        and (user_id = auth.uid() or role in ('reviewer', 'admin', 'super_admin'))
    )
  );

create policy "Discipleship creators can insert in their organization"
  on public.plans for insert to authenticated
  with check (
    user_id = auth.uid()
    and organization_id = (select organization_id from public.profiles where id = auth.uid())
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('pastor', 'discipleship_leader', 'admin', 'super_admin'))
  );

create policy "Organization members can read Sunday schedules"
  on public.sunday_schedules for select to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and organization_id = sunday_schedules.organization_id
        and (user_id = auth.uid() or role in ('reviewer', 'admin', 'super_admin'))
    )
  );

create policy "Schedule creators can manage their organization schedules"
  on public.sunday_schedules for all to authenticated
  using (
    user_id = auth.uid()
    and organization_id = (select organization_id from public.profiles where id = auth.uid())
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('pastor', 'admin', 'super_admin'))
  )
  with check (
    user_id = auth.uid()
    and organization_id = (select organization_id from public.profiles where id = auth.uid())
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('pastor', 'admin', 'super_admin'))
  );
