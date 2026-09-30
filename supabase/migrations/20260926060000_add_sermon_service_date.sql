alter table public.sermons
  add column if not exists service_date date;

create index if not exists sermons_service_date_idx
  on public.sermons (service_date)
  where service_date is not null;
