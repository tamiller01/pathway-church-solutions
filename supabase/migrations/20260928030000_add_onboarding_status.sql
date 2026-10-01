alter table public.profiles
  add column if not exists onboarding_completed boolean not null default false;

-- Existing pilot users already have accounts and organizations; do not interrupt them.
update public.profiles
set onboarding_completed = true
where organization_id is not null;
