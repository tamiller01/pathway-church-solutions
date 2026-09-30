alter table public.sermons
  add column if not exists review_status text not null default 'draft'
    check (review_status in ('draft', 'in_review', 'changes_requested', 'approved', 'flagged', 'published')),
  add column if not exists risk_level text not null default 'normal'
    check (risk_level in ('normal', 'high')),
  add column if not exists review_note text,
  add column if not exists submitted_at timestamptz,
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists published_by uuid references auth.users(id) on delete set null,
  add column if not exists published_at timestamptz;

alter table public.worship_plans
  add column if not exists review_status text not null default 'draft'
    check (review_status in ('draft', 'in_review', 'changes_requested', 'approved', 'flagged', 'published')),
  add column if not exists risk_level text not null default 'normal'
    check (risk_level in ('normal', 'high')),
  add column if not exists review_note text,
  add column if not exists submitted_at timestamptz,
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists published_by uuid references auth.users(id) on delete set null,
  add column if not exists published_at timestamptz;

alter table public.plans
  add column if not exists review_status text not null default 'draft'
    check (review_status in ('draft', 'in_review', 'changes_requested', 'approved', 'flagged', 'published')),
  add column if not exists risk_level text not null default 'normal'
    check (risk_level in ('normal', 'high')),
  add column if not exists review_note text,
  add column if not exists submitted_at timestamptz,
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists published_by uuid references auth.users(id) on delete set null,
  add column if not exists published_at timestamptz;

create index if not exists sermons_review_status_created_at_idx
  on public.sermons (review_status, created_at desc);

create index if not exists worship_plans_review_status_created_at_idx
  on public.worship_plans (review_status, created_at desc);

create index if not exists plans_review_status_created_at_idx
  on public.plans (review_status, created_at desc);
