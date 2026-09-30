alter table public.worship_plans
  add column if not exists plan_html text;
