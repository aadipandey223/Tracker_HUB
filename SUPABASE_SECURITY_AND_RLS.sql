-- SECURITY & RLS POLICIES for Tracker Hub
-- Run this script in your Supabase SQL Editor.

-- 1. PROFILES TABLE (Public Read, Owner Write)
-- This table is often required for storing public user data linked to auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  avatar_url text,
  website text,
  updated_at timestamp with time zone,
  constraint username_length check (char_length(username) >= 3)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Function and trigger to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid conflicts
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. APPLICATION TABLES (Private: Owner Access Only)
-- We enable RLS and strictly limit access to the owner (user_id = auth.uid())

-- List of tables to secure
-- habits, habit_logs, tasks, transactions, debts, categories, monthly_budgets, mental_states, vision_boards, vision_board_items

-- MACRO for repeating policies (Conceptually, since SQL doesn't have macros, we write them out)

-- === habits ===
alter table if exists public.habits enable row level security;
create policy "Users can view own habits" on habits for select using (auth.uid() = user_id);
create policy "Users can insert own habits" on habits for insert with check (auth.uid() = user_id);
create policy "Users can update own habits" on habits for update using (auth.uid() = user_id);
create policy "Users can delete own habits" on habits for delete using (auth.uid() = user_id);

-- === habit_logs ===
alter table if exists public.habit_logs enable row level security;
create policy "Users can view own habit_logs" on habit_logs for select using (auth.uid() = user_id);
create policy "Users can insert own habit_logs" on habit_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own habit_logs" on habit_logs for update using (auth.uid() = user_id);
create policy "Users can delete own habit_logs" on habit_logs for delete using (auth.uid() = user_id);

-- === tasks ===
alter table if exists public.tasks enable row level security;
create policy "Users can view own tasks" on tasks for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on tasks for delete using (auth.uid() = user_id);

-- === transactions ===
alter table if exists public.transactions enable row level security;
create policy "Users can view own transactions" on transactions for select using (auth.uid() = user_id);
create policy "Users can insert own transactions" on transactions for insert with check (auth.uid() = user_id);
create policy "Users can update own transactions" on transactions for update using (auth.uid() = user_id);
create policy "Users can delete own transactions" on transactions for delete using (auth.uid() = user_id);

-- === debts ===
alter table if exists public.debts enable row level security;
create policy "Users can view own debts" on debts for select using (auth.uid() = user_id);
create policy "Users can insert own debts" on debts for insert with check (auth.uid() = user_id);
create policy "Users can update own debts" on debts for update using (auth.uid() = user_id);
create policy "Users can delete own debts" on debts for delete using (auth.uid() = user_id);

-- === categories ===
alter table if exists public.categories enable row level security;
create policy "Users can view own categories" on categories for select using (auth.uid() = user_id);
create policy "Users can insert own categories" on categories for insert with check (auth.uid() = user_id);
create policy "Users can update own categories" on categories for update using (auth.uid() = user_id);
create policy "Users can delete own categories" on categories for delete using (auth.uid() = user_id);

-- === monthly_budgets ===
alter table if exists public.monthly_budgets enable row level security;
create policy "Users can view own monthly_budgets" on monthly_budgets for select using (auth.uid() = user_id);
create policy "Users can insert own monthly_budgets" on monthly_budgets for insert with check (auth.uid() = user_id);
create policy "Users can update own monthly_budgets" on monthly_budgets for update using (auth.uid() = user_id);
create policy "Users can delete own monthly_budgets" on monthly_budgets for delete using (auth.uid() = user_id);

-- === mental_states ===
alter table if exists public.mental_states enable row level security;
create policy "Users can view own mental_states" on mental_states for select using (auth.uid() = user_id);
create policy "Users can insert own mental_states" on mental_states for insert with check (auth.uid() = user_id);
create policy "Users can update own mental_states" on mental_states for update using (auth.uid() = user_id);
create policy "Users can delete own mental_states" on mental_states for delete using (auth.uid() = user_id);

-- === vision_boards ===
alter table if exists public.vision_boards enable row level security;
create policy "Users can view own vision_boards" on vision_boards for select using (auth.uid() = user_id);
create policy "Users can insert own vision_boards" on vision_boards for insert with check (auth.uid() = user_id);
create policy "Users can update own vision_boards" on vision_boards for update using (auth.uid() = user_id);
create policy "Users can delete own vision_boards" on vision_boards for delete using (auth.uid() = user_id);

-- === vision_board_items ===
alter table if exists public.vision_board_items enable row level security;
create policy "Users can view own vision_board_items" on vision_board_items for select using (auth.uid() = user_id);
create policy "Users can insert own vision_board_items" on vision_board_items for insert with check (auth.uid() = user_id);
create policy "Users can update own vision_board_items" on vision_board_items for update using (auth.uid() = user_id);
create policy "Users can delete own vision_board_items" on vision_board_items for delete using (auth.uid() = user_id);


-- 3. STORAGE POLICIES
-- NOTE: Please ensure you have a storage bucket named 'files' created in the dashboard.
-- Policies cannot easily create buckets, only secure them.

-- Allow users to view their own files
create policy "Users can view their own files"
on storage.objects for select
using ( bucket_id = 'files' and auth.uid()::text = (storage.objects.metadata->>'user_id') );

-- Allow users to upload their own files
create policy "Users can upload their own files"
on storage.objects for insert
with check ( bucket_id = 'files' and auth.uid()::text = (storage.objects.metadata->>'user_id') );

-- Allow users to update their own files
create policy "Users can update their own files"
on storage.objects for update
using ( bucket_id = 'files' and auth.uid()::text = (storage.objects.metadata->>'user_id') );

-- Allow users to delete their own files
create policy "Users can delete their own files"
on storage.objects for delete
using ( bucket_id = 'files' and auth.uid()::text = (storage.objects.metadata->>'user_id') );

