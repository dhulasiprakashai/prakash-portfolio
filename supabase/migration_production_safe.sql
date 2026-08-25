-- Production-Safe Supabase SQL Migration Script
-- Configures public schema tables, secures access privileges, and implements an admin-only RLS policy system.
-- Do NOT modify or execute any commands on storage.objects.

create extension if not exists pgcrypto;

-- ===================================================
-- 1. PROFILE TABLE (Preserve existing table & data)
-- ===================================================
create table if not exists public.profile (
  id text primary key default 'default',
  name text not null default '',
  headline text not null default '',
  about text default '',
  email text default '',
  location text default '',
  github text default '',
  linkedin text default '',
  avatar_url text,
  hero_image_url text,
  cv_url text,
  availability text default '',
  projects_count integer default 0,
  experience text default '',
  updated_at timestamptz default now()
);

-- Safely add phone column if missing
alter table public.profile add column if not exists phone text;

-- ===================================================
-- 2. ABOUT TABLE
-- ===================================================
create table if not exists public.about (
  id text primary key default 'default',
  section_label text not null default '01 / ABOUT',
  main_heading text not null default '',
  short_intro text default '',
  full_description text default '',
  career_focus text default '',
  published boolean default true,
  updated_at timestamptz default now()
);

-- ===================================================
-- 3. PROJECTS TABLE (Preserve existing table & data)
-- ===================================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  image_url text,
  tech text[] default '{}',
  github_url text,
  live_url text,
  featured boolean default true,
  published boolean default true,
  sort_order integer default 99,
  problem text default '',
  solution text default '',
  features text default '',
  architecture text default '',
  screenshots text[] default '{}',
  challenges text default '',
  results text default '',
  created_at timestamptz default now()
);

-- Safely add slug and full_description if missing
alter table public.projects add column if not exists slug text;
alter table public.projects add column if not exists full_description text;
alter table public.projects add column if not exists problem text default '';
alter table public.projects add column if not exists solution text default '';
alter table public.projects add column if not exists features text default '';
alter table public.projects add column if not exists architecture text default '';
alter table public.projects add column if not exists screenshots text[] default '{}';
alter table public.projects add column if not exists challenges text default '';
alter table public.projects add column if not exists results text default '';

-- ===================================================
-- 4. SKILLS TABLE
-- ===================================================
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  icon text default '',
  sort_order integer default 99,
  published boolean default true,
  created_at timestamptz default now()
);

-- ===================================================
-- 5. EXPERIENCE TABLE
-- ===================================================
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  job_title text not null,
  company text not null,
  location text default '',
  description text default '',
  start_date text default '',
  end_date text default '',
  current boolean default false,
  sort_order integer default 99,
  published boolean default true,
  created_at timestamptz default now()
);

-- ===================================================
-- 6. EDUCATION TABLE
-- ===================================================
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  field_of_study text default '',
  location text default '',
  description text default '',
  start_year text default '',
  end_year text default '',
  current boolean default false,
  sort_order integer default 99,
  published boolean default true,
  created_at timestamptz default now()
);

-- ===================================================
-- 7. SERVICES TABLE
-- ===================================================
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  short_description text default '',
  full_description text default '',
  icon text default '',
  sort_order integer default 99,
  published boolean default true,
  created_at timestamptz default now()
);

-- ===================================================
-- 8. STATS TABLE
-- ===================================================
create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  description text default '',
  sort_order integer default 99,
  published boolean default true,
  created_at timestamptz default now()
);

-- ===================================================
-- 9. CONTACT MESSAGES TABLE
-- ===================================================
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text default '',
  message text not null,
  status text not null default 'new',
  created_at timestamptz default now()
);

-- ===================================================
-- 10. SITE SETTINGS TABLE
-- ===================================================
create table if not exists public.site_settings (
  id text primary key default 'default',
  site_title text not null default 'Portfolio',
  site_description text default '',
  logo_text text default '',
  footer_text text default '',
  contact_email text default '',
  social_links jsonb default '{}'::jsonb,
  availability_status text default '',
  maintenance_mode boolean default false,
  updated_at timestamptz default now()
);

-- ===================================================
-- INITIALIZE DEFAULT SINGLETONS (Safely preserve existing data)
-- ===================================================
-- Omit hardcoded placeholder emails to protect existing Supabase Auth settings
insert into public.profile (id) values ('default') on conflict (id) do nothing;
insert into public.about (id, main_heading) values ('default', 'I DON''T JUST WRITE CODE. I BUILD SOLUTIONS.') on conflict (id) do nothing;
insert into public.site_settings (id) values ('default') on conflict (id) do nothing;

-- ===================================================
-- ADMIN AUTHENTICATION CHECK FUNCTION
-- Safe against recursion and path-injection security vulnerabilities
-- ===================================================
create or replace function public.is_admin()
returns boolean as $$
begin
  return (
    auth.role() = 'authenticated' and
    (auth.jwt() ->> 'email') = (select email from public.profile where id = 'default')
  );
end;
$$ language plpgsql security definer set search_path = public;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, service_role;

-- ===================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ===================================================
alter table public.profile enable row level security;
alter table public.about enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.experience enable row level security;
alter table public.education enable row level security;
alter table public.services enable row level security;
alter table public.stats enable row level security;
alter table public.contact_messages enable row level security;
alter table public.site_settings enable row level security;

-- ===================================================
-- RLS ACCESS CONTROL POLICIES
-- ===================================================

-- 1. Profile (Select: public, Modifications: Admin Only)
drop policy if exists "public read profile" on public.profile;
create policy "public read profile" on public.profile for select using (true);

drop policy if exists "authenticated write profile" on public.profile;
create policy "authenticated write profile" on public.profile for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 2. About (Select: published only, Modifications: Admin Only)
drop policy if exists "public read about" on public.about;
create policy "public read about" on public.about for select using (published = true);

drop policy if exists "authenticated write about" on public.about;
create policy "authenticated write about" on public.about for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 3. Projects (Select: published only, Modifications: Admin Only)
drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects" on public.projects for select using (published = true);

drop policy if exists "authenticated write projects" on public.projects;
create policy "authenticated write projects" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 4. Skills (Select: published only, Modifications: Admin Only)
drop policy if exists "public read published skills" on public.skills;
create policy "public read published skills" on public.skills for select using (published = true);

drop policy if exists "authenticated write skills" on public.skills;
create policy "authenticated write skills" on public.skills for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 5. Experience (Select: published only, Modifications: Admin Only)
drop policy if exists "public read published experience" on public.experience;
create policy "public read published experience" on public.experience for select using (published = true);

drop policy if exists "authenticated write experience" on public.experience;
create policy "authenticated write experience" on public.experience for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 6. Education (Select: published only, Modifications: Admin Only)
drop policy if exists "public read published education" on public.education;
create policy "public read published education" on public.education for select using (published = true);

drop policy if exists "authenticated write education" on public.education;
create policy "authenticated write education" on public.education for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 7. Services (Select: published only, Modifications: Admin Only)
drop policy if exists "public read published services" on public.services;
create policy "public read published services" on public.services for select using (published = true);

drop policy if exists "authenticated write services" on public.services;
create policy "authenticated write services" on public.services for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 8. Stats (Select: published only, Modifications: Admin Only)
drop policy if exists "public read published stats" on public.stats;
create policy "public read published stats" on public.stats for select using (published = true);

drop policy if exists "authenticated write stats" on public.stats;
create policy "authenticated write stats" on public.stats for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 9. Contact Messages (Insert: public, SELECT/Modify: Admin Only)
drop policy if exists "public insert contact_messages" on public.contact_messages;
create policy "public insert contact_messages" on public.contact_messages for insert with check (true);

drop policy if exists "authenticated write contact_messages" on public.contact_messages;
create policy "authenticated write contact_messages" on public.contact_messages for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 10. Site Settings (Select: public, Modifications: Admin Only)
drop policy if exists "public read site_settings" on public.site_settings;
create policy "public read site_settings" on public.site_settings for select using (true);

drop policy if exists "authenticated write site_settings" on public.site_settings;
create policy "authenticated write site_settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ===================================================
-- USER ROLE PRIVILEGE ASSIGNMENTS (Secure Anon access)
-- ===================================================

-- Revoke high-risk privileges from anon
revoke all on public.profile from anon;
revoke all on public.about from anon;
revoke all on public.projects from anon;
revoke all on public.skills from anon;
revoke all on public.experience from anon;
revoke all on public.education from anon;
revoke all on public.services from anon;
revoke all on public.stats from anon;
revoke all on public.contact_messages from anon;
revoke all on public.site_settings from anon;

-- Grant read privileges to anon for rendering portfolio
grant select on public.profile to anon;
grant select on public.about to anon;
grant select on public.projects to anon;
grant select on public.skills to anon;
grant select on public.experience to anon;
grant select on public.education to anon;
grant select on public.services to anon;
grant select on public.stats to anon;
grant select on public.site_settings to anon;

-- Grant message creation privilege only (No Select)
grant insert on public.contact_messages to anon;

-- Grant full admin control to authenticated user context & service_role
grant all on public.profile to authenticated, service_role;
grant all on public.about to authenticated, service_role;
grant all on public.projects to authenticated, service_role;
grant all on public.skills to authenticated, service_role;
grant all on public.experience to authenticated, service_role;
grant all on public.education to authenticated, service_role;
grant all on public.services to authenticated, service_role;
grant all on public.stats to authenticated, service_role;
grant all on public.contact_messages to authenticated, service_role;
grant all on public.site_settings to authenticated, service_role;
