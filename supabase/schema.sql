-- Luna database schema
-- Run this in your Supabase project's SQL Editor (Project > SQL Editor > New query).
--
-- PRIVACY MODEL
-- --------------
-- Every table has Row Level Security (RLS) turned on. This means Postgres itself
-- refuses to return or modify a row unless a policy explicitly allows it — it does
-- not rely on the app's frontend code being correct. By default:
--   * A user can only see/edit their OWN cycle data.
--   * A partner can see a signed-in user's data ONLY if there is an *accepted* row
--     in partner_links connecting them, and even then only a limited, read-only
--     summary view (partner_summary), never raw notes.
--   * Nobody, including Claude/you the developer, can query another person's data
--     through the anon/public API key. Only the Supabase project owner (you, via
--     the dashboard) could look directly at the raw database — see docs/PRIVACY.md
--     for how to reduce even that.

-- ============================================================
-- 1. PROFILES
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Luna user',
  average_cycle_length int not null default 28,
  average_period_length int not null default 5,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ============================================================
-- 2. CYCLES  (a logged period: start date, optional end date)
-- ============================================================
create table if not exists public.cycles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  start_date date not null,
  end_date date,
  created_at timestamptz not null default now()
);

alter table public.cycles enable row level security;

create policy "Users manage their own cycles"
  on public.cycles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- 3. DAILY LOGS  (symptoms, mood, flow intensity, private notes)
-- ============================================================
create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  log_date date not null,
  flow_intensity text check (flow_intensity in ('spotting','light','medium','heavy')),
  mood text[],
  symptoms text[],
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

alter table public.daily_logs
  add column if not exists sexual_activity text;

alter table public.daily_logs enable row level security;

create policy "Users manage their own daily logs"
  on public.daily_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- 4. PARTNER LINKS  (invite-code based, explicit consent required)
-- ============================================================
create table if not exists public.partner_links (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  partner_id uuid references auth.users(id) on delete cascade,
  invite_code text not null unique,
  status text not null default 'pending' check (status in ('pending','accepted','revoked')),
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

alter table public.partner_links enable row level security;

-- The owner can always see/manage their own invite/link rows.
create policy "Owners manage their own partner links"
  on public.partner_links for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- A partner can see a link row once they've been attached to it
-- (i.e. after they redeem the invite code via the redeem_invite function below).
create policy "Partners can view links they belong to"
  on public.partner_links for select
  using (auth.uid() = partner_id);

-- ============================================================
-- 5. Limited partner access
-- ============================================================
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

-- ============================================================
-- 6. Auto-create a profile row whenever someone signs up
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Luna user'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
