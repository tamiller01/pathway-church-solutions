create table if not exists public.sunday_schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_date date not null,
  worship_plan_id uuid references public.worship_plans(id) on delete set null,
  sermon_id uuid references public.sermons(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, service_date),
  check (worship_plan_id is not null or sermon_id is not null)
);

create index if not exists sunday_schedules_user_date_idx
  on public.sunday_schedules (user_id, service_date);

create index if not exists sunday_schedules_date_idx
  on public.sunday_schedules (service_date);

alter table public.sunday_schedules enable row level security;

create policy "Schedule owners and internal roles can read Sunday schedules"
  on public.sunday_schedules for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('reviewer', 'admin', 'super_admin')
    )
  );

create policy "Content creators can manage their own Sunday schedules"
  on public.sunday_schedules for all to authenticated
  using (
    user_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('pastor', 'admin', 'super_admin')
    )
  )
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('pastor', 'admin', 'super_admin')
    )
  );
