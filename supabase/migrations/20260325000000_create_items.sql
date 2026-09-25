-- items table: per-user notes, RLS enforced
create extension if not exists "pgcrypto";

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists items_user_id_created_at_idx
  on public.items (user_id, created_at desc);

alter table public.items enable row level security;

-- Users can only see their own rows
create policy "items_select_own"
  on public.items
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can only insert rows for themselves
create policy "items_insert_own"
  on public.items
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can only update their own rows
create policy "items_update_own"
  on public.items
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can only delete their own rows
create policy "items_delete_own"
  on public.items
  for delete
  to authenticated
  using (auth.uid() = user_id);
