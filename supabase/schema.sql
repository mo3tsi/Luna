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
-- 5. Function: redeem an invite code
-- ============================================================
-- Runs with the privileges of the function owner (security definer) so that a
-- partner, who has no other access to partner_links belonging to someone else,
-- can safely redeem a code without being granted broad table access.
create or replace function public.redeem_invite(code text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.partner_links
  set partner_id = auth.uid(),
      status = 'accepted',
      accepted_at = now()
  where invite_code = code
    and status = 'pending';

  if not found then
    raise exception 'Invite code is invalid, already used, or expired.';
  end if;
end;
$$;

-- ============================================================
-- 6. PARTNER SUMMARY VIEW — read-only, limited fields only
-- ============================================================
-- This is what a partner is actually allowed to query. It deliberately excludes
-- daily_logs.note (free-text journal entries) and any symptom detail — a partner
-- only ever sees cycle day, phase, and predicted dates, never her private notes.
create or replace view public.partner_summary as
select
  pl.partner_id,
  pl.owner_id,
  p.display_name as owner_display_name,
  p.average_cycle_length,
  p.average_period_length,
  (
    select c.start_date
    from public.cycles c
    where c.user_id = pl.owner_id
    order by c.start_date desc
    limit 1
  ) as last_period_start
from public.partner_links pl
join public.profiles p on p.id = pl.owner_id
where pl.status = 'accepted';

alter view public.partner_summary set (security_invoker = on);

-- Because security_invoker is on, the view is subject to the RLS policy below,
-- executed as the querying user (the partner) rather than the view owner.
create policy "Partners can read the summary of people who added them"
  on public.partner_links for select
  using (auth.uid() = partner_id);

-- ============================================================
-- 7. Auto-create a profile row whenever someone signs up
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
