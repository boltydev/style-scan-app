-- StyleScan basic backend schema.
-- Run this once in your Supabase project's SQL Editor (or via `supabase db push`).
--
-- Model:
--   auth.users (built in)  ->  profiles (1:1)  ->  scans (1:many)
--
-- Auth: the app signs in anonymously (supabase.auth.signInAnonymously()),
-- which creates a row in auth.users with no email/password. The trigger
-- below creates a matching profiles row automatically.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row whenever a new auth user is created
-- (covers anonymous sign-in and any future email/password sign-up).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- scans
-- ---------------------------------------------------------------------------
create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  face_shape text not null,
  face_shape_confidence text not null,
  face_shape_notes text,
  skin_tone text not null,
  undertone text not null,
  skin_tone_notes text,
  facial_hair_present boolean not null default false,
  facial_hair_type text,
  facial_hair_notes text,
  summary text,
  created_at timestamptz not null default now()
);

create index if not exists scans_user_id_created_at_idx
  on public.scans (user_id, created_at desc);

alter table public.scans enable row level security;

create policy "Users can view their own scans"
  on public.scans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own scans"
  on public.scans for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own scans"
  on public.scans for delete
  using (auth.uid() = user_id);
