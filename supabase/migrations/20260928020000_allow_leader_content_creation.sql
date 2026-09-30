-- Pastors, Discipleship Leaders, and Admins may create all three content types.
drop policy if exists "Sermon creators can insert in their organization" on public.sermons;
create policy "Sermon creators can insert in their organization"
  on public.sermons for insert to authenticated
  with check (
    user_id = auth.uid()
    and organization_id = (select organization_id from public.profiles where id = auth.uid())
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('pastor', 'discipleship_leader', 'admin', 'super_admin'))
  );

drop policy if exists "Worship creators can insert in their organization" on public.worship_plans;
create policy "Worship creators can insert in their organization"
  on public.worship_plans for insert to authenticated
  with check (
    user_id = auth.uid()
    and organization_id = (select organization_id from public.profiles where id = auth.uid())
    and exists (select 1 from public.profiles where id = auth.uid() and role in ('pastor', 'discipleship_leader', 'admin', 'super_admin'))
  );
