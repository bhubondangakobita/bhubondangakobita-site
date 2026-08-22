-- Bhubondanga Premium Features schema v1
-- Run in Supabase SQL Editor as database owner.

create extension if not exists pgcrypto;

create table if not exists public.profile_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  updated_at timestamptz not null default now()
);

alter table public.profile_preferences
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists magic_visibility text not null default 'friends',
  add column if not exists story_archive_visibility text not null default 'private',
  add column if not exists notification_preferences jsonb not null default '{}'::jsonb,
  add column if not exists message_permission_required boolean not null default true,
  add column if not exists gender_preference text,
  add column if not exists religion_preference text,
  add column if not exists gift_box_enabled boolean not null default true,
  add column if not exists gift_box_public boolean not null default true,
  add column if not exists profile_private boolean not null default false,
  add column if not exists message_policy text not null default 'everyone',
  add column if not exists follow_policy text not null default 'everyone',
  add column if not exists follow_approval boolean not null default false,
  add column if not exists birthday_timeline_policy text not null default 'followers',
  add column if not exists poke_policy text not null default 'followers',
  add column if not exists tag_policy text not null default 'followers',
  add column if not exists mention_policy text not null default 'everyone',
  add column if not exists friend_request_policy text not null default 'everyone',
  add column if not exists emergency_alerts boolean not null default true,
  add column if not exists humanitarian_alerts boolean not null default true,
  add column if not exists security_alerts boolean not null default true,
  add column if not exists login_alerts boolean not null default true,
  add column if not exists birthday_notifications boolean not null default true,
  add column if not exists poke_notifications boolean not null default true,
  add column if not exists mention_notifications boolean not null default true,
  add column if not exists tag_notifications boolean not null default true,
  add column if not exists newsfeed_language text not null default 'bn',
  add column if not exists ticker_country text not null default 'BD',
  add column if not exists prayer_times_enabled boolean not null default true,
  add column if not exists prayer_calculation_method text not null default 'auto',
  add column if not exists gender_visibility text not null default 'private',
  add column if not exists religion_visibility text not null default 'private',
  add column if not exists online_status_visibility text not null default 'followers',
  add column if not exists activity_status_visibility text not null default 'followers',
  add column if not exists search_engine_profile boolean not null default false,
  add column if not exists profile_download_permission text not null default 'nobody',
  add column if not exists timeline_post_review boolean not null default true,
  add column if not exists premium_preferences jsonb not null default '{}'::jsonb;

alter table public.profile_preferences enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='profile_preferences' and policyname='profile_preferences_owner_select') then
    create policy profile_preferences_owner_select on public.profile_preferences for select to authenticated using (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='profile_preferences' and policyname='profile_preferences_owner_insert') then
    create policy profile_preferences_owner_insert on public.profile_preferences for insert to authenticated with check (user_id = auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='profile_preferences' and policyname='profile_preferences_owner_update') then
    create policy profile_preferences_owner_update on public.profile_preferences for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
  end if;
end $$;

grant select,insert,update on public.profile_preferences to authenticated;

-- Registration additions.
alter table if exists public.profiles
  add column if not exists gender text,
  add column if not exists gender_custom text,
  add column if not exists religion text,
  add column if not exists religion_custom text;

-- PIN verifier only. The user's PIN itself is never stored.
create table if not exists public.diary_credentials (
  user_id uuid primary key references auth.users(id) on delete cascade,
  salt text not null,
  verifier text not null,
  iterations integer not null default 310000 check (iterations >= 200000),
  updated_at timestamptz not null default now()
);
alter table public.diary_credentials enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='diary_credentials' and policyname='diary_credentials_owner_all') then
    create policy diary_credentials_owner_all on public.diary_credentials for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
  end if;
end $$;
grant select,insert,update,delete on public.diary_credentials to authenticated;

-- Diary: drafts are ciphertext-only and algorithm-ineligible. Support submissions are explicit.
create table if not exists public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  is_draft boolean not null,
  algorithm_eligible boolean not null default false,
  title_plaintext text,
  content_plaintext text,
  ciphertext text,
  iv text,
  encryption_version text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint diary_mode_guard check (
    (is_draft = true and algorithm_eligible = false and content_plaintext is null and ciphertext is not null and iv is not null)
    or
    (is_draft = false and algorithm_eligible = true and content_plaintext is not null and ciphertext is null)
  )
);
create index if not exists diary_entries_user_created_idx on public.diary_entries(user_id,created_at desc);
alter table public.diary_entries enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='diary_entries' and policyname='diary_entries_owner_all') then
    create policy diary_entries_owner_all on public.diary_entries for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
  end if;
end $$;
grant select,insert,update,delete on public.diary_entries to authenticated;

-- Anonymous-to-receiver Gift Box ledger.
-- Direct client access is intentionally revoked; only the trusted payment worker/service role writes it.
create table if not exists public.gift_transactions (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references auth.users(id) on delete set null,
  receiver_id uuid not null references auth.users(id) on delete restrict,
  amount_minor integer not null check (amount_minor > 0),
  currency char(3) not null,
  provider text not null default 'stripe',
  provider_checkout_id text unique,
  provider_payment_id text,
  status text not null default 'created' check (status in ('created','pending','paid','failed','refunded','cancelled')),
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  constraint no_self_gift check (sender_id <> receiver_id)
);
create index if not exists gift_transactions_receiver_paid_idx on public.gift_transactions(receiver_id,paid_at desc) where status='paid';
create index if not exists gift_transactions_sender_created_idx on public.gift_transactions(sender_id,created_at desc);
alter table public.gift_transactions enable row level security;
revoke all on public.gift_transactions from anon, authenticated;

-- Public-safe boolean used by the feed/profile. It reveals no private preference fields.
create or replace function public.gift_box_status(p_receiver uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select gift_box_enabled and gift_box_public from public.profile_preferences where user_id=p_receiver), true)
$$;
revoke all on function public.gift_box_status(uuid) from public;
grant execute on function public.gift_box_status(uuid) to anon, authenticated;

-- Receiver-facing ledger deliberately excludes sender_id and provider identifiers.
create or replace function public.my_received_gifts()
returns table(id uuid, amount_minor integer, currency char(3), paid_at timestamptz, status text)
language sql
stable
security definer
set search_path = public
as $$
  select g.id,g.amount_minor,g.currency,g.paid_at,g.status
  from public.gift_transactions g
  where g.receiver_id=auth.uid() and g.status in ('paid','refunded')
  order by g.paid_at desc nulls last, g.created_at desc
$$;
revoke all on function public.my_received_gifts() from public;
grant execute on function public.my_received_gifts() to authenticated;

-- Optional sender-only receipt history; still never exposed to the receiver.
create or replace function public.my_sent_gift_receipts()
returns table(id uuid, amount_minor integer, currency char(3), created_at timestamptz, paid_at timestamptz, status text)
language sql
stable
security definer
set search_path = public
as $$
  select g.id,g.amount_minor,g.currency,g.created_at,g.paid_at,g.status
  from public.gift_transactions g
  where g.sender_id=auth.uid()
  order by g.created_at desc
$$;
revoke all on function public.my_sent_gift_receipts() from public;
grant execute on function public.my_sent_gift_receipts() to authenticated;

-- Follow approval queue used when follow_approval is enabled.
create table if not exists public.follow_requests (
  requester_id uuid not null references auth.users(id) on delete cascade,
  target_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key(requester_id,target_id),
  constraint no_self_follow_request check (requester_id<>target_id)
);
alter table public.follow_requests enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='follow_requests' and policyname='follow_requests_participants_select') then
    create policy follow_requests_participants_select on public.follow_requests for select to authenticated using (requester_id=auth.uid() or target_id=auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='follow_requests' and policyname='follow_requests_requester_insert') then
    create policy follow_requests_requester_insert on public.follow_requests for insert to authenticated with check (requester_id=auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='follow_requests' and policyname='follow_requests_participant_update') then
    create policy follow_requests_participant_update on public.follow_requests for update to authenticated using (requester_id=auth.uid() or target_id=auth.uid()) with check (requester_id=auth.uid() or target_id=auth.uid());
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='follow_requests' and policyname='follow_requests_participant_delete') then
    create policy follow_requests_participant_delete on public.follow_requests for delete to authenticated using (requester_id=auth.uid() or target_id=auth.uid());
  end if;
end $$;
grant select,insert,update,delete on public.follow_requests to authenticated;

-- One server-side permission decision point for profile/message/follow/poke/timeline/tag/mention.
create or replace function public.social_permission_decision(p_target uuid, p_action text)
returns jsonb
language plpgsql
stable
security definer
set search_path=public
as $$
declare
  me uuid := auth.uid();
  pref public.profile_preferences%rowtype;
  i_follow boolean := false;
  target_follows boolean := false;
  friends boolean := false;
  policy text := 'everyone';
  allowed boolean := true;
  approval boolean := false;
begin
  if p_target is null then return jsonb_build_object('allowed',false,'requires_approval',false,'reason','invalid_target'); end if;
  if me = p_target then return jsonb_build_object('allowed',true,'requires_approval',false,'reason','self'); end if;
  select * into pref from public.profile_preferences where user_id=p_target;

  if me is not null then
    select exists(select 1 from public.follows where follower_id=me and following_id=p_target) into i_follow;
    select exists(select 1 from public.follows where follower_id=p_target and following_id=me) into target_follows;
    friends := (i_follow and target_follows);
    begin
      friends := friends or exists(
        select 1 from public.friendships f
        where f.status='accepted' and ((f.user_a=me and f.user_b=p_target) or (f.user_a=p_target and f.user_b=me))
      );
    exception when undefined_table then null;
    end;
  end if;

  case lower(coalesce(p_action,''))
    when 'profile_view' then
      allowed := not coalesce(pref.profile_private,false) or i_follow or friends;
      if me is null and coalesce(pref.profile_private,false) then allowed := false; end if;
    when 'message' then policy := coalesce(pref.message_policy,'everyone');
    when 'follow' then policy := coalesce(pref.follow_policy,'everyone'); approval := coalesce(pref.follow_approval,false);
    when 'poke' then policy := coalesce(pref.poke_policy,'followers');
    when 'timeline_birthday' then policy := coalesce(pref.birthday_timeline_policy,'followers');
    when 'tag' then policy := coalesce(pref.tag_policy,'followers');
    when 'mention' then policy := coalesce(pref.mention_policy,'everyone');
    else return jsonb_build_object('allowed',true,'requires_approval',false,'reason','unknown_action_compatibility');
  end case;

  if lower(coalesce(p_action,'')) <> 'profile_view' then
    allowed := case policy
      when 'everyone' then true
      when 'followers' then i_follow
      when 'following' then target_follows
      when 'friends' then friends
      when 'nobody' then false
      else true
    end;
    if me is null then allowed := false; end if;
  end if;

  return jsonb_build_object('allowed',allowed,'requires_approval',(allowed and lower(coalesce(p_action,''))='follow' and approval),'policy',policy,'is_follower',i_follow,'is_friend',friends);
end $$;
revoke all on function public.social_permission_decision(uuid,text) from public;
grant execute on function public.social_permission_decision(uuid,text) to anon,authenticated;
