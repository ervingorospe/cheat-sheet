-- ─────────────────────────────────────────────
-- Shared trigger: keep updated_at current on any row change
-- ─────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- ─────────────────────────────────────────────
-- profiles
-- ─────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row the moment a new auth.users row appears —
-- covers email/password sign-up AND every OAuth provider identically.
create or replace function public.handle_new_user()
returns trigger as $$
declare
  full_name text := new.raw_user_meta_data ->> 'full_name';
  parsed_first_name text;
  parsed_last_name text;
begin
  if full_name is not null then
    parsed_first_name := split_part(full_name, ' ', 1);
    parsed_last_name := nullif(trim(substring(full_name from position(' ' in full_name))), '');
  end if;

  insert into public.profiles (id, email, first_name, last_name, avatar_url)
  values (
    new.id,
    new.email,
    parsed_first_name,
    parsed_last_name,
    new.raw_user_meta_data ->> 'avatar_url'
  );

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();


-- ─────────────────────────────────────────────
-- folders
-- ─────────────────────────────────────────────
create table public.folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  parent_folder_id uuid references public.folders(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger folders_set_updated_at
  before update on public.folders
  for each row
  execute function public.set_updated_at();

alter table public.folders enable row level security;

create policy "Users can manage their own folders"
  on public.folders for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function public.prevent_folder_cycle()
returns trigger as $$
begin
  if new.parent_folder_id is not null then
    if new.parent_folder_id = new.id then
      raise exception 'A folder cannot be its own parent';
    end if;

    if exists (
      with recursive ancestors as (
        select id, parent_folder_id from public.folders where id = new.parent_folder_id
        union all
        select f.id, f.parent_folder_id
        from public.folders f
        join ancestors a on f.id = a.parent_folder_id
      )
      select 1 from ancestors where id = new.id
    ) then
      raise exception 'Moving this folder here would create a cycle';
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger folders_prevent_cycle
  before insert or update on public.folders
  for each row
  execute function public.prevent_folder_cycle();


-- ─────────────────────────────────────────────
-- notes
-- ─────────────────────────────────────────────
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  folder_id uuid references public.folders(id) on delete set null,
  title text,
  content text,
  key_points jsonb default '[]'::jsonb,
  doc_links jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger notes_set_updated_at
  before update on public.notes
  for each row
  execute function public.set_updated_at();

alter table public.notes enable row level security;

create policy "Users can manage their own notes"
  on public.notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ─────────────────────────────────────────────
-- indexes — Postgres does not auto-index foreign key columns
-- ─────────────────────────────────────────────
create index idx_folders_user_parent on public.folders (user_id, parent_folder_id);
create index idx_notes_user_folder on public.notes (user_id, folder_id);