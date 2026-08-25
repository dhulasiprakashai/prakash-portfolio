-- Run this in Supabase SQL Editor.
create extension if not exists pgcrypto;

-- 1. PROFILE TABLE
create table if not exists public.profile (
  id text primary key default 'default',
  name text not null default '',
  headline text not null default '',
  about text default '',
  email text default '',
  phone text default '',
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

-- Ensure table has phone column if it was created before
alter table public.profile add column if not exists phone text;

-- 2. ABOUT TABLE
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

-- 3. PROJECTS TABLE
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text,
  description text default '',
  full_description text default '',
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

-- Ensure projects has slug and full_description and other Phase 6 fields
alter table public.projects add column if not exists slug text;
alter table public.projects add column if not exists full_description text;
alter table public.projects add column if not exists problem text default '';
alter table public.projects add column if not exists solution text default '';
alter table public.projects add column if not exists features text default '';
alter table public.projects add column if not exists architecture text default '';
alter table public.projects add column if not exists screenshots text[] default '{}';
alter table public.projects add column if not exists challenges text default '';
alter table public.projects add column if not exists results text default '';

-- 4. SKILLS TABLE
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  icon text default '',
  sort_order integer default 99,
  published boolean default true,
  created_at timestamptz default now()
);

-- 5. EXPERIENCE TABLE
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

-- 6. EDUCATION TABLE
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

-- 7. SERVICES TABLE
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

-- 8. STATS TABLE
create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  description text default '',
  sort_order integer default 99,
  published boolean default true,
  created_at timestamptz default now()
);

-- 9. CONTACT MESSAGES TABLE
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text default '',
  message text not null,
  status text not null default 'new',
  created_at timestamptz default now()
);

-- 10. SITE SETTINGS TABLE
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

-- Initialize default singletons
insert into public.profile (id) values ('default') on conflict (id) do nothing;
insert into public.about (id, main_heading) values ('default', 'I DON''T JUST WRITE CODE. I BUILD SOLUTIONS.') on conflict (id) do nothing;
insert into public.site_settings (id) values ('default') on conflict (id) do nothing;

-- Enable Row Level Security (RLS) on all tables
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

-- DROP ALL OLD POLICIES FOR CLEAN SLATE
drop policy if exists "public read profile" on public.profile;
drop policy if exists "public insert profile" on public.profile;
drop policy if exists "public update profile" on public.profile;
drop policy if exists "public delete profile" on public.profile;
drop policy if exists "authenticated write profile" on public.profile;

drop policy if exists "public read about" on public.about;
drop policy if exists "authenticated write about" on public.about;

drop policy if exists "public read published projects" on public.projects;
drop policy if exists "public insert projects" on public.projects;
drop policy if exists "public update projects" on public.projects;
drop policy if exists "public delete projects" on public.projects;
drop policy if exists "authenticated write projects" on public.projects;

drop policy if exists "public read published skills" on public.skills;
drop policy if exists "authenticated write skills" on public.skills;

drop policy if exists "public read published experience" on public.experience;
drop policy if exists "authenticated write experience" on public.experience;

drop policy if exists "public read published education" on public.education;
drop policy if exists "authenticated write education" on public.education;

drop policy if exists "public read published services" on public.services;
drop policy if exists "authenticated write services" on public.services;

drop policy if exists "public read published stats" on public.stats;
drop policy if exists "authenticated write stats" on public.stats;

drop policy if exists "public insert contact_messages" on public.contact_messages;
drop policy if exists "authenticated write contact_messages" on public.contact_messages;

drop policy if exists "public read site_settings" on public.site_settings;
drop policy if exists "authenticated write site_settings" on public.site_settings;

-- CREATE NEW POLICIES

-- PROFILE policies
create policy "public read profile" on public.profile for select using (true);
create policy "authenticated write profile" on public.profile for all to authenticated using (true) with check (true);

-- ABOUT policies
create policy "public read about" on public.about for select using (published = true);
create policy "authenticated write about" on public.about for all to authenticated using (true) with check (true);

-- PROJECTS policies
create policy "public read published projects" on public.projects for select using (published = true);
create policy "authenticated write projects" on public.projects for all to authenticated using (true) with check (true);

-- SKILLS policies
create policy "public read published skills" on public.skills for select using (published = true);
create policy "authenticated write skills" on public.skills for all to authenticated using (true) with check (true);

-- EXPERIENCE policies
create policy "public read published experience" on public.experience for select using (published = true);
create policy "authenticated write experience" on public.experience for all to authenticated using (true) with check (true);

-- EDUCATION policies
create policy "public read published education" on public.education for select using (published = true);
create policy "authenticated write education" on public.education for all to authenticated using (true) with check (true);

-- SERVICES policies
create policy "public read published services" on public.services for select using (published = true);
create policy "authenticated write services" on public.services for all to authenticated using (true) with check (true);

-- STATS policies
create policy "public read published stats" on public.stats for select using (published = true);
create policy "authenticated write stats" on public.stats for all to authenticated using (true) with check (true);

-- CONTACT MESSAGES policies
create policy "public insert contact_messages" on public.contact_messages for insert with check (true);
create policy "authenticated write contact_messages" on public.contact_messages for all to authenticated using (true) with check (true);

-- SITE SETTINGS policies
create policy "public read site_settings" on public.site_settings for select using (true);
create policy "authenticated write site_settings" on public.site_settings for all to authenticated using (true) with check (true);


-- 11. STORAGE BUCKET POLICIES
alter table storage.objects enable row level security;

drop policy if exists "Allow public upload" on storage.objects;
drop policy if exists "Allow public update" on storage.objects;
drop policy if exists "Allow public select" on storage.objects;
drop policy if exists "Allow public delete" on storage.objects;
drop policy if exists "Allow auth upload" on storage.objects;
drop policy if exists "Allow auth update" on storage.objects;
drop policy if exists "Allow auth select" on storage.objects;
drop policy if exists "Allow auth delete" on storage.objects;

-- Allow public read of objects in portfolio bucket
create policy "Allow public select" on storage.objects for select using (bucket_id = 'portfolio');

-- Only authenticated users can upload/update/delete in the portfolio bucket
create policy "Allow auth upload" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio');
create policy "Allow auth update" on storage.objects for update to authenticated using (bucket_id = 'portfolio') with check (bucket_id = 'portfolio');
create policy "Allow auth delete" on storage.objects for delete to authenticated using (bucket_id = 'portfolio');

-- Grant permissions to anon, authenticated, and service_role
grant all on public.profile to anon, authenticated, service_role;
grant all on public.about to anon, authenticated, service_role;
grant all on public.projects to anon, authenticated, service_role;
grant all on public.skills to anon, authenticated, service_role;
grant all on public.experience to anon, authenticated, service_role;
grant all on public.education to anon, authenticated, service_role;
grant all on public.services to anon, authenticated, service_role;
grant all on public.stats to anon, authenticated, service_role;
grant all on public.contact_messages to anon, authenticated, service_role;
grant all on public.site_settings to anon, authenticated, service_role;
