alter table public.worship_plans
  add column if not exists service_date date;

create index if not exists worship_plans_service_date_idx
  on public.worship_plans (service_date)
  where service_date is not null;
