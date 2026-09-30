alter table public.sermons
  add column if not exists assigned_reviewer_id uuid references auth.users(id) on delete set null,
  add column if not exists reviewer_opened_at timestamptz;

alter table public.worship_plans
  add column if not exists assigned_reviewer_id uuid references auth.users(id) on delete set null,
  add column if not exists reviewer_opened_at timestamptz;

alter table public.plans
  add column if not exists assigned_reviewer_id uuid references auth.users(id) on delete set null,
  add column if not exists reviewer_opened_at timestamptz;

alter table public.plan_review_events
  drop constraint if exists plan_review_events_action_check;

alter table public.plan_review_events
  add constraint plan_review_events_action_check
  check (action in ('request_review', 'opened', 'edit', 'approve', 'flag', 'return', 'publish', 'override_publish'));
