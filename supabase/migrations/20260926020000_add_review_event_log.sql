create table if not exists public.plan_review_events (
  id uuid primary key default gen_random_uuid(),
  plan_type text not null check (plan_type in ('sermons', 'worship-plans', 'discipleship-plans')),
  plan_id uuid not null,
  actor_id uuid not null references auth.users(id) on delete cascade,
  action text not null check (action in ('request_review', 'edit', 'approve', 'flag', 'return', 'publish', 'override_publish')),
  from_status text not null,
  to_status text not null,
  risk_level text not null check (risk_level in ('normal', 'high')),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists plan_review_events_plan_idx
  on public.plan_review_events (plan_type, plan_id, created_at desc);

create index if not exists plan_review_events_actor_idx
  on public.plan_review_events (actor_id, created_at desc);

alter table public.plan_review_events enable row level security;
