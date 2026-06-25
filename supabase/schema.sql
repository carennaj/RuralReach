-- RuralReach Database Schema
-- Run this in your Supabase SQL Editor (Database > SQL Editor > New query)

-- ─────────────────────────────────────────────
-- Profiles (extends Supabase auth.users)
-- ─────────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text not null check (role in ('homeowner', 'provider')),
  created_at timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- Provider profiles
-- ─────────────────────────────────────────────
create table public.provider_profiles (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade unique,
  bio text,
  zip_codes text[] default '{}',      -- zip codes the provider is willing to serve
  specialties text[] default '{}',    -- service categories
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- Job postings
-- ─────────────────────────────────────────────
create table public.job_postings (
  id uuid default gen_random_uuid() primary key,
  homeowner_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text not null,
  zip_code text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'closed')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- Job responses
-- ─────────────────────────────────────────────
create table public.job_responses (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references public.job_postings(id) on delete cascade,
  provider_id uuid references public.profiles(id) on delete cascade,
  message text not null,
  created_at timestamp with time zone default now()
);

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.provider_profiles enable row level security;
alter table public.job_postings enable row level security;
alter table public.job_responses enable row level security;

-- profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- provider_profiles
create policy "Provider profiles are viewable by everyone"
  on public.provider_profiles for select using (true);

create policy "Providers can insert their own provider profile"
  on public.provider_profiles for insert with check (auth.uid() = user_id);

create policy "Providers can update their own provider profile"
  on public.provider_profiles for update using (auth.uid() = user_id);

-- job_postings
create policy "Jobs are viewable by everyone"
  on public.job_postings for select using (true);

create policy "Homeowners can create job postings"
  on public.job_postings for insert with check (auth.uid() = homeowner_id);

create policy "Homeowners can update their own job postings"
  on public.job_postings for update using (auth.uid() = homeowner_id);

-- job_responses
create policy "Job responses are viewable by everyone"
  on public.job_responses for select using (true);

create policy "Providers can create responses"
  on public.job_responses for insert with check (auth.uid() = provider_id);

-- ─────────────────────────────────────────────
-- Auto-create profile on signup trigger
-- ─────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'role'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
