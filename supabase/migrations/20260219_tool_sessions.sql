create table if not exists public.bss_tool_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  tool_id text not null,
  inputs jsonb not null,
  result jsonb not null,
  is_enhanced boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bss_tool_sessions_user_idx on public.bss_tool_sessions (user_id, created_at desc);

alter table public.bss_tool_sessions enable row level security;

create policy "Users can view own tool sessions"
  on public.bss_tool_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own tool sessions"
  on public.bss_tool_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own tool sessions"
  on public.bss_tool_sessions for delete
  using (auth.uid() = user_id);
