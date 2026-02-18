-- Stripe billing state + explorer session persistence
create extension if not exists pgcrypto;

create table if not exists public.bss_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  status text not null,
  tier text not null default 'pro',
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bss_subscriptions_user_created_idx
  on public.bss_subscriptions (user_id, created_at desc);

create index if not exists bss_subscriptions_status_idx
  on public.bss_subscriptions (status);

create table if not exists public.bss_webhook_events (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'PROCESSING',
  error text,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bss_explorer_sessions (
  id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  input jsonb not null,
  result jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index if not exists bss_explorer_sessions_user_created_idx
  on public.bss_explorer_sessions (user_id, created_at desc);

alter table public.bss_subscriptions enable row level security;
alter table public.bss_webhook_events enable row level security;
alter table public.bss_explorer_sessions enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'bss_subscriptions'
      and policyname = 'users_select_own_subscriptions'
  ) then
    create policy users_select_own_subscriptions
      on public.bss_subscriptions
      for select
      using (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'bss_explorer_sessions'
      and policyname = 'users_select_own_explorer_sessions'
  ) then
    create policy users_select_own_explorer_sessions
      on public.bss_explorer_sessions
      for select
      using (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'bss_explorer_sessions'
      and policyname = 'users_insert_own_explorer_sessions'
  ) then
    create policy users_insert_own_explorer_sessions
      on public.bss_explorer_sessions
      for insert
      with check (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'bss_explorer_sessions'
      and policyname = 'users_update_own_explorer_sessions'
  ) then
    create policy users_update_own_explorer_sessions
      on public.bss_explorer_sessions
      for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'bss_explorer_sessions'
      and policyname = 'users_delete_own_explorer_sessions'
  ) then
    create policy users_delete_own_explorer_sessions
      on public.bss_explorer_sessions
      for delete
      using (auth.uid() = user_id);
  end if;
end
$$;
