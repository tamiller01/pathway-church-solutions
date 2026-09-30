-- Add a discipleship-specific creator role. It has Pastor-like permissions for
-- discipleship plans while remaining read-only for Sermons and Worship Plans.
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('pastor', 'discipleship_leader', 'reviewer', 'admin', 'super_admin'));

drop policy if exists "Creators can insert own discipleship plans" on public.plans;
create policy "Creators can insert own discipleship plans"
  on public.plans for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('pastor', 'discipleship_leader', 'admin', 'super_admin')
    )
  );
