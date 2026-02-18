-- Dashboard analytics + API key management schema
create extension if not exists pgcrypto;

create table if not exists public.bss_usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event_name text not null,
  category text not null default 'api',
  path text,
  tool_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists bss_usage_events_user_created_idx
  on public.bss_usage_events (user_id, created_at desc);

create table if not exists public.bss_api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Default key',
  key_hash text not null unique,
  key_prefix text not null,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists bss_api_keys_user_created_idx
  on public.bss_api_keys (user_id, created_at desc);

alter table public.bss_usage_events enable row level security;
alter table public.bss_api_keys enable row level security;

create policy if not exists "users_select_own_usage_events"
  on public.bss_usage_events
  for select
  using (auth.uid() = user_id);

create policy if not exists "users_insert_own_usage_events"
  on public.bss_usage_events
  for insert
  with check (auth.uid() = user_id);

create policy if not exists "users_select_own_api_keys"
  on public.bss_api_keys
  for select
  using (auth.uid() = user_id);

create policy if not exists "users_insert_own_api_keys"
  on public.bss_api_keys
  for insert
  with check (auth.uid() = user_id);

create policy if not exists "users_update_own_api_keys"
  on public.bss_api_keys
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
