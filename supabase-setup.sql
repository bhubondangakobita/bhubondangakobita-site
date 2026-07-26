-- ভুবনডাঙ্গার কবিতা — Complete Supabase Setup v4
-- Supabase Dashboard → SQL Editor → New query → পুরো ফাইল Run
-- Browser-এ service_role key দেবেন না। এই schema UUID + RLS ভিত্তিক।

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────
-- Core identity and roles
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username = lower(username)),
  display_name text not null default 'ভুবনডাঙ্গার সদস্য',
  bio text not null default '',
  avatar_url text not null default '',
  cover_url text not null default '',
  location text not null default 'বাংলাদেশ',
  website text not null default '',
  gift_enabled boolean not null default false,
  gift_link text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user','admin','founder','moderator')),
  active boolean not null default true,
  assigned_by uuid references auth.users(id) on delete set null,
  assigned_at timestamptz not null default now()
);

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.user_roles where user_id=auth.uid() and active and role in ('founder','admin','moderator')); $$;
create or replace function public.is_admin_or_founder()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.user_roles where user_id=auth.uid() and active and role in ('founder','admin')); $$;
create or replace function public.is_founder()
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.user_roles where user_id=auth.uid() and active and role='founder'); $$;
revoke all on function public.is_staff() from public; grant execute on function public.is_staff() to authenticated;
revoke all on function public.is_admin_or_founder() from public; grant execute on function public.is_admin_or_founder() to authenticated;
revoke all on function public.is_founder() from public; grant execute on function public.is_founder() to authenticated;

-- ─────────────────────────────────────────────────────────────
-- Publishing, reactions, comments, follows and saves
-- ─────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id text primary key,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_username text not null,
  author_name text not null,
  author_avatar text not null default '',
  type text not null default 'poem',
  category text not null default 'কবিতা',
  title text not null,
  body text not null default '',
  original_author text not null default '',
  media_url text not null default '',
  media_type text not null default '',
  card_style text not null default 'pearl',
  visibility text not null default 'public' check (visibility in ('public','followers','private')),
  status text not null default 'published' check (status in ('published','published_flagged','pending_review','rejected','archived','deleted')),
  pinned boolean not null default false,
  likes_count integer not null default 0 check (likes_count >= 0),
  comments_count integer not null default 0 check (comments_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_created_idx on public.posts(created_at desc);
create index if not exists posts_author_idx on public.posts(author_id,created_at desc);
create index if not exists posts_category_idx on public.posts(category,created_at desc);

create table if not exists public.comments (
  id text primary key,
  post_id text not null references public.posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  parent_id text references public.comments(id) on delete cascade,
  author_username text not null,
  author_name text not null,
  body text not null check (char_length(body) between 1 and 5000),
  status text not null default 'published' check (status in ('published','pending_review','rejected','deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments(post_id,created_at);

create table if not exists public.reactions (
  post_id text not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reaction text not null default 'love' check (reaction in ('love','like','support')),
  created_at timestamptz not null default now(),
  primary key(post_id,user_id)
);

create table if not exists public.saved_posts (
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id text not null references public.posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id,post_id)
);

create table if not exists public.follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  following_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(follower_id,following_id),
  check (follower_id <> following_id)
);

-- ─────────────────────────────────────────────────────────────
-- Notifications
-- ─────────────────────────────────────────────────────────────
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  type text not null default 'general',
  message text not null,
  url text not null default '',
  unread boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications(user_id,unread,created_at desc);

-- ─────────────────────────────────────────────────────────────
-- Private messages and message requests
-- ─────────────────────────────────────────────────────────────
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'direct' check (kind in ('direct','group')),
  title text not null default '',
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.conversation_members (
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  member_role text not null default 'member' check (member_role in ('owner','admin','member')),
  request_status text not null default 'accepted' check (request_status in ('pending','accepted','ignored','blocked','left')),
  muted boolean not null default false,
  last_read_at timestamptz,
  joined_at timestamptz not null default now(),
  primary key(conversation_id,user_id)
);
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  reply_to uuid references public.messages(id) on delete set null,
  body text not null default '',
  attachment_url text not null default '',
  attachment_type text not null default '',
  attachment_name text not null default '',
  unsent_for_everyone boolean not null default false,
  created_at timestamptz not null default now(),
  edited_at timestamptz
);
create index if not exists messages_conversation_idx on public.messages(conversation_id,created_at desc);
create table if not exists public.message_hidden_for_user (
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  hidden_at timestamptz not null default now(),
  primary key(message_id,user_id)
);

create or replace function public.is_conversation_member(cid uuid)
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.conversation_members where conversation_id=cid and user_id=auth.uid() and request_status in ('accepted','pending')); $$;
revoke all on function public.is_conversation_member(uuid) from public; grant execute on function public.is_conversation_member(uuid) to authenticated;

-- ─────────────────────────────────────────────────────────────
-- Reports, moderation and audit logs
-- ─────────────────────────────────────────────────────────────
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('post','comment','profile','message','humanitarian','other')),
  target_id text not null,
  reason text not null,
  priority text not null default 'normal' check (priority in ('urgent','high','normal')),
  details text not null default '',
  evidence jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending','reviewing','resolved','dismissed','appealed')),
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);
create index if not exists reports_status_idx on public.reports(status,priority,created_at desc);

create table if not exists public.moderation_queue (
  id uuid primary key default gen_random_uuid(),
  post_id text references public.posts(id) on delete cascade,
  comment_id text references public.comments(id) on delete cascade,
  submitted_by uuid not null references auth.users(id) on delete cascade,
  matched_terms text[] not null default '{}',
  status text not null default 'pending' check (status in ('pending','approved','rejected','edited')),
  note text not null default '',
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text not null default '',
  target_id text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Humanitarian appeals
-- ─────────────────────────────────────────────────────────────
create table if not exists public.humanitarian_requests (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  details text not null,
  category text not null default 'other',
  location text not null default '',
  contact_safe text not null default '',
  priority text not null default 'normal' check (priority in ('urgent','high','normal')),
  status text not null default 'pending' check (status in ('pending','approved','rejected','active','solved','cancelled','expired','closed')),
  pinned boolean not null default false,
  verified_by uuid references auth.users(id) on delete set null,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists humanitarian_status_idx on public.humanitarian_requests(status,priority,created_at desc);

-- ─────────────────────────────────────────────────────────────
-- Archive, stories and memories
-- ─────────────────────────────────────────────────────────────
create table if not exists public.archives (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('post','story','comment')),
  item_id text not null,
  snapshot jsonb not null default '{}'::jsonb,
  archived_at timestamptz not null default now(),
  permanently_deleted_at timestamptz,
  unique(owner_id,item_type,item_id)
);
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  media_url text not null,
  media_type text not null default 'image',
  caption text not null default '',
  visibility text not null default 'public' check (visibility in ('public','followers','private')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now()+interval '24 hours'),
  archived_at timestamptz
);
create index if not exists stories_owner_idx on public.stories(owner_id,created_at desc);

-- ─────────────────────────────────────────────────────────────
-- Editor contributions, awards and site pins
-- ─────────────────────────────────────────────────────────────
create table if not exists public.editor_contributions (
  id uuid primary key default gen_random_uuid(),
  editor_id uuid not null references auth.users(id) on delete cascade,
  original_author text not null,
  work_title text not null,
  source_url text not null default '',
  contribution_type text not null default 'addition',
  accuracy_score numeric(5,2) not null default 0,
  status text not null default 'pending' check (status in ('pending','approved','rejected','corrected')),
  created_at timestamptz not null default now(),
  approved_at timestamptz
);
create table if not exists public.editor_awards (
  id uuid primary key default gen_random_uuid(),
  month_start date not null unique,
  winner_id uuid not null references auth.users(id) on delete cascade,
  score numeric(12,2) not null,
  snapshot jsonb not null default '{}'::jsonb,
  awarded_at timestamptz not null default now(),
  expires_at timestamptz not null default (now()+interval '24 hours')
);
create table if not exists public.site_pins (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('post','editor','humanitarian','notice','profile')),
  target_id text not null,
  title text not null default '',
  url text not null default '',
  created_by uuid not null references auth.users(id) on delete cascade,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- New user trigger
-- ─────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public
as $$
declare uname text;
begin
  uname := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username',split_part(new.email,'@',1),new.id::text),'[^a-zA-Z0-9_-]','','g'));
  if uname='' then uname:='user-'||substr(new.id::text,1,8); end if;
  insert into public.profiles(id,username,display_name)
  values(new.id,uname,coalesce(new.raw_user_meta_data->>'full_name',new.raw_user_meta_data->>'name',uname))
  on conflict(id) do nothing;
  insert into public.user_roles(user_id,role,active) values(new.id,'user',true) on conflict(user_id) do nothing;
  return new;
end;$$;
drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- Enable RLS
-- ─────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.reactions enable row level security;
alter table public.saved_posts enable row level security;
alter table public.follows enable row level security;
alter table public.notifications enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.message_hidden_for_user enable row level security;
alter table public.reports enable row level security;
alter table public.moderation_queue enable row level security;
alter table public.activity_logs enable row level security;
alter table public.humanitarian_requests enable row level security;
alter table public.archives enable row level security;
alter table public.stories enable row level security;
alter table public.editor_contributions enable row level security;
alter table public.editor_awards enable row level security;
alter table public.site_pins enable row level security;

-- Profiles and roles
DROP POLICY IF EXISTS "profiles public read" ON public.profiles;
CREATE POLICY "profiles public read" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "profiles own insert" ON public.profiles;
CREATE POLICY "profiles own insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id=auth.uid());
DROP POLICY IF EXISTS "profiles own update" ON public.profiles;
CREATE POLICY "profiles own update" ON public.profiles FOR UPDATE TO authenticated USING (id=auth.uid() OR public.is_staff()) WITH CHECK (id=auth.uid() OR public.is_staff());
DROP POLICY IF EXISTS "roles own read" ON public.user_roles;
CREATE POLICY "roles own read" ON public.user_roles FOR SELECT TO authenticated USING (user_id=auth.uid() OR public.is_staff());
DROP POLICY IF EXISTS "roles founder write" ON public.user_roles;
CREATE POLICY "roles founder write" ON public.user_roles FOR ALL TO authenticated USING (public.is_founder()) WITH CHECK (public.is_founder());

-- Posts/comments/reactions/saves/follows
DROP POLICY IF EXISTS "posts visible read" ON public.posts;
CREATE POLICY "posts visible read" ON public.posts FOR SELECT USING ((status IN ('published','published_flagged') AND visibility='public') OR author_id=auth.uid() OR public.is_staff());
DROP POLICY IF EXISTS "posts own insert" ON public.posts;
CREATE POLICY "posts own insert" ON public.posts FOR INSERT TO authenticated WITH CHECK (author_id=auth.uid());
DROP POLICY IF EXISTS "posts own update" ON public.posts;
CREATE POLICY "posts own update" ON public.posts FOR UPDATE TO authenticated USING (author_id=auth.uid() OR public.is_staff()) WITH CHECK (author_id=auth.uid() OR public.is_staff());
DROP POLICY IF EXISTS "posts own delete" ON public.posts;
CREATE POLICY "posts own delete" ON public.posts FOR DELETE TO authenticated USING (author_id=auth.uid() OR public.is_staff());
DROP POLICY IF EXISTS "comments public read" ON public.comments;
CREATE POLICY "comments public read" ON public.comments FOR SELECT USING (status='published' OR author_id=auth.uid() OR public.is_staff());
DROP POLICY IF EXISTS "comments own insert" ON public.comments;
CREATE POLICY "comments own insert" ON public.comments FOR INSERT TO authenticated WITH CHECK (author_id=auth.uid());
DROP POLICY IF EXISTS "comments own update" ON public.comments;
CREATE POLICY "comments own update" ON public.comments FOR UPDATE TO authenticated USING (author_id=auth.uid() OR public.is_staff()) WITH CHECK (author_id=auth.uid() OR public.is_staff());
DROP POLICY IF EXISTS "reactions public read" ON public.reactions;
CREATE POLICY "reactions public read" ON public.reactions FOR SELECT USING (true);
DROP POLICY IF EXISTS "reactions own write" ON public.reactions;
CREATE POLICY "reactions own write" ON public.reactions FOR ALL TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());
DROP POLICY IF EXISTS "saved own all" ON public.saved_posts;
CREATE POLICY "saved own all" ON public.saved_posts FOR ALL TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());
DROP POLICY IF EXISTS "follows public read" ON public.follows;
CREATE POLICY "follows public read" ON public.follows FOR SELECT USING (true);
DROP POLICY IF EXISTS "follows own write" ON public.follows;
CREATE POLICY "follows own write" ON public.follows FOR ALL TO authenticated USING (follower_id=auth.uid()) WITH CHECK (follower_id=auth.uid());

-- Notifications
DROP POLICY IF EXISTS "notifications own read" ON public.notifications;
CREATE POLICY "notifications own read" ON public.notifications FOR SELECT TO authenticated USING (user_id=auth.uid());
DROP POLICY IF EXISTS "notifications own update" ON public.notifications;
CREATE POLICY "notifications own update" ON public.notifications FOR UPDATE TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());
DROP POLICY IF EXISTS "notifications actor insert" ON public.notifications;
CREATE POLICY "notifications actor insert" ON public.notifications FOR INSERT TO authenticated WITH CHECK (actor_id=auth.uid() OR public.is_staff());

-- Conversations/messages: participants only
DROP POLICY IF EXISTS "conversation member read" ON public.conversations;
CREATE POLICY "conversation member read" ON public.conversations FOR SELECT TO authenticated USING (public.is_conversation_member(id));
DROP POLICY IF EXISTS "conversation own create" ON public.conversations;
CREATE POLICY "conversation own create" ON public.conversations FOR INSERT TO authenticated WITH CHECK (created_by=auth.uid());
DROP POLICY IF EXISTS "conversation creator update" ON public.conversations;
CREATE POLICY "conversation creator update" ON public.conversations FOR UPDATE TO authenticated USING (created_by=auth.uid()) WITH CHECK (created_by=auth.uid());
DROP POLICY IF EXISTS "members participant read" ON public.conversation_members;
CREATE POLICY "members participant read" ON public.conversation_members FOR SELECT TO authenticated USING (user_id=auth.uid() OR public.is_conversation_member(conversation_id));
DROP POLICY IF EXISTS "members creator insert" ON public.conversation_members;
CREATE POLICY "members creator insert" ON public.conversation_members FOR INSERT TO authenticated WITH CHECK (user_id=auth.uid() OR EXISTS(select 1 from public.conversations c where c.id=conversation_id and c.created_by=auth.uid()));
DROP POLICY IF EXISTS "members own update" ON public.conversation_members;
CREATE POLICY "members own update" ON public.conversation_members FOR UPDATE TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());
DROP POLICY IF EXISTS "messages participant read" ON public.messages;
CREATE POLICY "messages participant read" ON public.messages FOR SELECT TO authenticated USING (public.is_conversation_member(conversation_id));
DROP POLICY IF EXISTS "messages participant insert" ON public.messages;
CREATE POLICY "messages participant insert" ON public.messages FOR INSERT TO authenticated WITH CHECK (sender_id=auth.uid() AND public.is_conversation_member(conversation_id));
DROP POLICY IF EXISTS "messages sender update" ON public.messages;
CREATE POLICY "messages sender update" ON public.messages FOR UPDATE TO authenticated USING (sender_id=auth.uid()) WITH CHECK (sender_id=auth.uid());
DROP POLICY IF EXISTS "hidden own all" ON public.message_hidden_for_user;
CREATE POLICY "hidden own all" ON public.message_hidden_for_user FOR ALL TO authenticated USING (user_id=auth.uid()) WITH CHECK (user_id=auth.uid());

-- Reports/moderation/audit
DROP POLICY IF EXISTS "reports own insert" ON public.reports;
CREATE POLICY "reports own insert" ON public.reports FOR INSERT TO authenticated WITH CHECK (reporter_id=auth.uid());
DROP POLICY IF EXISTS "reports own staff read" ON public.reports;
CREATE POLICY "reports own staff read" ON public.reports FOR SELECT TO authenticated USING (reporter_id=auth.uid() OR public.is_staff());
DROP POLICY IF EXISTS "reports staff update" ON public.reports;
CREATE POLICY "reports staff update" ON public.reports FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
DROP POLICY IF EXISTS "moderation own insert" ON public.moderation_queue;
CREATE POLICY "moderation own insert" ON public.moderation_queue FOR INSERT TO authenticated WITH CHECK (submitted_by=auth.uid());
DROP POLICY IF EXISTS "moderation own staff read" ON public.moderation_queue;
CREATE POLICY "moderation own staff read" ON public.moderation_queue FOR SELECT TO authenticated USING (submitted_by=auth.uid() OR public.is_staff());
DROP POLICY IF EXISTS "moderation staff update" ON public.moderation_queue;
CREATE POLICY "moderation staff update" ON public.moderation_queue FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
DROP POLICY IF EXISTS "activity own staff read" ON public.activity_logs;
CREATE POLICY "activity own staff read" ON public.activity_logs FOR SELECT TO authenticated USING (actor_id=auth.uid() OR public.is_staff());
DROP POLICY IF EXISTS "activity actor insert" ON public.activity_logs;
CREATE POLICY "activity actor insert" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (actor_id=auth.uid() OR public.is_staff());

-- Humanitarian
DROP POLICY IF EXISTS "humanitarian public approved read" ON public.humanitarian_requests;
CREATE POLICY "humanitarian public approved read" ON public.humanitarian_requests FOR SELECT USING (status IN ('approved','active','solved','closed') OR applicant_id=auth.uid() OR public.is_staff());
DROP POLICY IF EXISTS "humanitarian own insert" ON public.humanitarian_requests;
CREATE POLICY "humanitarian own insert" ON public.humanitarian_requests FOR INSERT TO authenticated WITH CHECK (applicant_id=auth.uid());
DROP POLICY IF EXISTS "humanitarian own staff update" ON public.humanitarian_requests;
CREATE POLICY "humanitarian own staff update" ON public.humanitarian_requests FOR UPDATE TO authenticated USING (applicant_id=auth.uid() OR public.is_admin_or_founder()) WITH CHECK (applicant_id=auth.uid() OR public.is_admin_or_founder());

-- Archive/stories/memories
DROP POLICY IF EXISTS "archives owner all" ON public.archives;
CREATE POLICY "archives owner all" ON public.archives FOR ALL TO authenticated USING (owner_id=auth.uid()) WITH CHECK (owner_id=auth.uid());
DROP POLICY IF EXISTS "stories visible read" ON public.stories;
CREATE POLICY "stories visible read" ON public.stories FOR SELECT USING ((visibility='public' AND archived_at IS NULL AND expires_at>now()) OR owner_id=auth.uid());
DROP POLICY IF EXISTS "stories owner write" ON public.stories;
CREATE POLICY "stories owner write" ON public.stories FOR ALL TO authenticated USING (owner_id=auth.uid()) WITH CHECK (owner_id=auth.uid());

-- Editor awards and pins
DROP POLICY IF EXISTS "contributions public approved read" ON public.editor_contributions;
CREATE POLICY "contributions public approved read" ON public.editor_contributions FOR SELECT USING (status='approved' OR editor_id=auth.uid() OR public.is_staff());
DROP POLICY IF EXISTS "contributions own insert" ON public.editor_contributions;
CREATE POLICY "contributions own insert" ON public.editor_contributions FOR INSERT TO authenticated WITH CHECK (editor_id=auth.uid());
DROP POLICY IF EXISTS "contributions staff update" ON public.editor_contributions;
CREATE POLICY "contributions staff update" ON public.editor_contributions FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
DROP POLICY IF EXISTS "awards public read" ON public.editor_awards;
CREATE POLICY "awards public read" ON public.editor_awards FOR SELECT USING (true);
DROP POLICY IF EXISTS "awards founder write" ON public.editor_awards;
CREATE POLICY "awards founder write" ON public.editor_awards FOR ALL TO authenticated USING (public.is_founder()) WITH CHECK (public.is_founder());
DROP POLICY IF EXISTS "pins active read" ON public.site_pins;
CREATE POLICY "pins active read" ON public.site_pins FOR SELECT USING (active AND (expires_at IS NULL OR expires_at>now()));
DROP POLICY IF EXISTS "pins staff write" ON public.site_pins;
CREATE POLICY "pins staff write" ON public.site_pins FOR ALL TO authenticated USING (public.is_admin_or_founder()) WITH CHECK (public.is_admin_or_founder());

-- ─────────────────────────────────────────────────────────────
-- Storage buckets and ownership policies
-- ─────────────────────────────────────────────────────────────
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
('avatars','avatars',true,8388608,array['image/jpeg','image/png','image/webp','image/gif']),
('covers','covers',true,12582912,array['image/jpeg','image/png','image/webp']),
('post-media','post-media',true,52428800,array['image/jpeg','image/png','image/webp','image/gif','audio/mpeg','audio/mp4','audio/wav','video/mp4','video/webm','video/quicktime']),
('recitations','recitations',true,104857600,array['audio/mpeg','audio/mp4','audio/wav','video/mp4','video/webm','video/quicktime']),
('stories','stories',true,52428800,array['image/jpeg','image/png','image/webp','video/mp4','video/webm','video/quicktime']),
('message-attachments','message-attachments',false,52428800,null)
on conflict(id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;

DROP POLICY IF EXISTS "public media read" ON storage.objects;
CREATE POLICY "public media read" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars','covers','post-media','recitations','stories'));
DROP POLICY IF EXISTS "owned media insert" ON storage.objects;
CREATE POLICY "owned media insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('avatars','covers','post-media','recitations','stories','message-attachments') AND (storage.foldername(name))[1]=auth.uid()::text);
DROP POLICY IF EXISTS "owned media update" ON storage.objects;
CREATE POLICY "owned media update" ON storage.objects FOR UPDATE TO authenticated USING ((storage.foldername(name))[1]=auth.uid()::text OR public.is_staff()) WITH CHECK ((storage.foldername(name))[1]=auth.uid()::text OR public.is_staff());
DROP POLICY IF EXISTS "owned media delete" ON storage.objects;
CREATE POLICY "owned media delete" ON storage.objects FOR DELETE TO authenticated USING ((storage.foldername(name))[1]=auth.uid()::text OR public.is_staff());
DROP POLICY IF EXISTS "private attachment read" ON storage.objects;
CREATE POLICY "private attachment read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id='message-attachments' AND (storage.foldername(name))[1]=auth.uid()::text);

-- ─────────────────────────────────────────────────────────────
-- Realtime
-- ─────────────────────────────────────────────────────────────
alter table public.posts replica identity full;
alter table public.comments replica identity full;
alter table public.notifications replica identity full;
alter table public.messages replica identity full;
alter table public.humanitarian_requests replica identity full;
do $$ begin
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='posts') then alter publication supabase_realtime add table public.posts; end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='comments') then alter publication supabase_realtime add table public.comments; end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='notifications') then alter publication supabase_realtime add table public.notifications; end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='messages') then alter publication supabase_realtime add table public.messages; end if;
  if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='humanitarian_requests') then alter publication supabase_realtime add table public.humanitarian_requests; end if;
end $$;

-- Founder role assignment must be performed once in SQL Editor with the real immutable UUID:
-- insert into public.user_roles(user_id,role,active) values('FOUNDER_AUTH_UUID','founder',true)
-- on conflict(user_id) do update set role='founder',active=true;
