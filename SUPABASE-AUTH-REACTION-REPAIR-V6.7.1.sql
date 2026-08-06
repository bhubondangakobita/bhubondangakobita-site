-- ভুবনডাঙ্গার কবিতা — ছোট Auth + Reaction Permission Repair V6.7.1
-- Supabase SQL Editor → New query → এই ছোট ফাইলটি একবার Run করুন।
-- Existing users/posts/reactions are preserved.

create extension if not exists pgcrypto;

grant usage on schema public to anon, authenticated;
grant select on table public.profiles, public.posts, public.comments, public.reactions, public.follows to anon, authenticated;
grant insert, update, delete on table public.comments, public.reactions, public.follows to authenticated;
grant select on table public.promo_profiles, public.promo_posts, public.promo_comments, public.promo_reactions to anon, authenticated;
grant insert, update, delete on table public.promo_comments, public.promo_reactions to authenticated;

-- Canonical reaction policies (RLS remains the security boundary).
alter table public.reactions enable row level security;
drop policy if exists "reactions public read" on public.reactions;
create policy "reactions public read" on public.reactions for select using (true);
drop policy if exists "reactions own write" on public.reactions;
create policy "reactions own write" on public.reactions for all to authenticated
using (user_id=auth.uid()) with check (user_id=auth.uid());

-- One secure RPC used by Index and Profile. Same reaction toggles off.
create or replace function public.toggle_post_reaction(target_post text, chosen_reaction text)
returns jsonb
language plpgsql
security definer
set search_path=public,pg_temp
as $$
declare
  me uuid:=auth.uid();
  previous text;
  promo boolean:=false;
begin
  if me is null then raise exception 'লগইন প্রয়োজন' using errcode='42501'; end if;
  if chosen_reaction not in ('like','love','care','haha','wow','sad','angry') then
    raise exception 'সঠিক reaction নির্বাচন করুন';
  end if;
  promo := exists(select 1 from public.promo_posts where id=target_post and active=true);
  if promo then
    select reaction into previous from public.promo_reactions where post_id=target_post and user_id=me;
    if previous=chosen_reaction then
      delete from public.promo_reactions where post_id=target_post and user_id=me;
      return jsonb_build_object('active',false,'reaction',null);
    end if;
    insert into public.promo_reactions(post_id,user_id,reaction) values(target_post,me,chosen_reaction)
    on conflict(post_id,user_id) do update set reaction=excluded.reaction,created_at=now();
  else
    if not exists(select 1 from public.posts where id=target_post) then raise exception 'পোস্ট পাওয়া যায়নি'; end if;
    select reaction into previous from public.reactions where post_id=target_post and user_id=me;
    if previous=chosen_reaction then
      delete from public.reactions where post_id=target_post and user_id=me;
      return jsonb_build_object('active',false,'reaction',null);
    end if;
    insert into public.reactions(post_id,user_id,reaction) values(target_post,me,chosen_reaction)
    on conflict(post_id,user_id) do update set reaction=excluded.reaction,created_at=now();
  end if;
  return jsonb_build_object('active',true,'reaction',chosen_reaction);
end;$$;
revoke all on function public.toggle_post_reaction(text,text) from public;
grant execute on function public.toggle_post_reaction(text,text) to authenticated;

-- Secure social reader, so counts render consistently even on older grant setups.
create or replace function public.get_post_social(target_post text)
returns jsonb
language plpgsql
stable
security definer
set search_path=public,pg_temp
as $$
declare result jsonb;
begin
  if exists(select 1 from public.promo_posts where id=target_post and active=true) then
    select jsonb_build_object(
      'reactions',coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at) from public.promo_reactions r where r.post_id=target_post),'[]'::jsonb),
      'comments',coalesce((select jsonb_agg(to_jsonb(c) order by c.created_at) from public.promo_comments c where c.post_id=target_post and c.status='published' and c.deleted_at is null),'[]'::jsonb)
    ) into result;
  else
    select jsonb_build_object(
      'reactions',coalesce((select jsonb_agg(to_jsonb(r) order by r.created_at) from public.reactions r where r.post_id=target_post),'[]'::jsonb),
      'comments',coalesce((select jsonb_agg(to_jsonb(c) order by c.created_at) from public.comments c where c.post_id=target_post and c.status='published' and c.deleted_at is null),'[]'::jsonb)
    ) into result;
  end if;
  return coalesce(result,jsonb_build_object('reactions','[]'::jsonb,'comments','[]'::jsonb));
end;$$;
revoke all on function public.get_post_social(text) from public;
grant execute on function public.get_post_social(text) to anon, authenticated;

-- Registration trigger: duplicate usernames no longer abort Auth user creation.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path=public,pg_temp
as $$
declare
  base_name text;
  safe_name text;
  display_value text;
begin
  base_name:=lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username',split_part(new.email,'@',1),'user'),'[^a-zA-Z0-9_-]','','g'));
  if base_name='' then base_name:='user'; end if;
  safe_name:=base_name;
  if exists(select 1 from public.profiles where username=safe_name and id<>new.id) then
    safe_name:=left(base_name,38)||'-'||substr(new.id::text,1,8);
  end if;
  display_value:=coalesce(nullif(new.raw_user_meta_data->>'full_name',''),nullif(new.raw_user_meta_data->>'name',''),safe_name,'ভুবনডাঙ্গার সদস্য');
  insert into public.profiles(id,username,display_name)
  values(new.id,safe_name,display_value)
  on conflict(id) do nothing;
  insert into public.user_roles(user_id,role,active)
  values(new.id,'user',true)
  on conflict(user_id) do nothing;
  return new;
end;$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user();

-- Backfill Auth users whose previous trigger failed, without touching existing profiles.
insert into public.profiles(id,username,display_name)
select u.id,
       left(coalesce(nullif(lower(regexp_replace(coalesce(u.raw_user_meta_data->>'username',split_part(u.email,'@',1),'user'),'[^a-zA-Z0-9_-]','','g')),''),'user'),38)||'-'||substr(u.id::text,1,8),
       coalesce(nullif(u.raw_user_meta_data->>'full_name',''),nullif(u.raw_user_meta_data->>'name',''),split_part(u.email,'@',1),'ভুবনডাঙ্গার সদস্য')
from auth.users u
left join public.profiles p on p.id=u.id
where p.id is null
on conflict do nothing;

insert into public.user_roles(user_id,role,active)
select u.id,'user',true from auth.users u
left join public.user_roles r on r.user_id=u.id
where r.user_id is null
on conflict do nothing;
