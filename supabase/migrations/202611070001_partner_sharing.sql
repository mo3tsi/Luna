-- Apply to an existing Luna database before deploying the updated frontend.

begin;

-- Give the frontend explicit privileges. Row Level Security still restricts
-- every operation to rows the signed-in user is allowed to access.
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.cycles, public.daily_logs, public.partner_links to authenticated;

create or replace function public.redeem_invite(code text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_id uuid := auth.uid();
begin
  if caller_id is null then
    raise exception 'Sign in to connect to a partner.';
  end if;

  update public.partner_links
  set partner_id = caller_id,
      status = 'accepted',
      accepted_at = now()
  where invite_code = upper(trim(code))
    and status = 'pending'
    and owner_id <> caller_id
    and created_at > now() - interval '24 hours';

  if not found then
    raise exception 'Invite code is invalid, already used, or expired.';
  end if;
end;
$$;

revoke all on function public.redeem_invite(text) from public, anon;
grant execute on function public.redeem_invite(text) to authenticated;

-- A security-invoker view alone cannot join another user's private tables.
-- This function checks the accepted link before returning the limited fields.
create or replace function public.get_partner_summary()
returns table (
  partner_id uuid,
  owner_id uuid,
  owner_display_name text,
  average_cycle_length int,
  average_period_length int,
  last_period_start date
)
language sql
stable
security definer
set search_path = ''
as $$
  select distinct pl.partner_id, pl.owner_id, p.display_name,
    p.average_cycle_length, p.average_period_length,
    (select max(c.start_date) from public.cycles c where c.user_id = pl.owner_id)
  from public.partner_links pl
  join public.profiles p on p.id = pl.owner_id
  where pl.partner_id = (select auth.uid())
    and pl.status = 'accepted';
$$;

revoke all on function public.get_partner_summary() from public, anon;
grant execute on function public.get_partner_summary() to authenticated;

create or replace view public.partner_summary with (security_invoker = true) as
select * from public.get_partner_summary();

revoke all on public.partner_summary from public, anon;
grant select on public.partner_summary to authenticated;

commit;
