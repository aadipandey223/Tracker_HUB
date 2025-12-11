-- ADD CASCADE DELETE TO FOREIGN KEYS
-- This will automatically delete user data when a user is deleted
-- Run this in Supabase SQL Editor

-- First, drop existing foreign key constraints and recreate with CASCADE
-- Note: This assumes your tables have foreign keys to auth.users

-- For profiles table
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_id_fkey;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For habits table (if it has user_id foreign key)
-- Note: You may need to add this constraint if it doesn't exist
ALTER TABLE public.habits 
DROP CONSTRAINT IF EXISTS habits_user_id_fkey;

ALTER TABLE public.habits 
ADD CONSTRAINT habits_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For habit_logs table
ALTER TABLE public.habit_logs 
DROP CONSTRAINT IF EXISTS habit_logs_user_id_fkey;

ALTER TABLE public.habit_logs 
ADD CONSTRAINT habit_logs_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For tasks table
ALTER TABLE public.tasks 
DROP CONSTRAINT IF EXISTS tasks_user_id_fkey;

ALTER TABLE public.tasks 
ADD CONSTRAINT tasks_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For transactions table
ALTER TABLE public.transactions 
DROP CONSTRAINT IF EXISTS transactions_user_id_fkey;

ALTER TABLE public.transactions 
ADD CONSTRAINT transactions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For debts table
ALTER TABLE public.debts 
DROP CONSTRAINT IF EXISTS debts_user_id_fkey;

ALTER TABLE public.debts 
ADD CONSTRAINT debts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For categories table
ALTER TABLE public.categories 
DROP CONSTRAINT IF EXISTS categories_user_id_fkey;

ALTER TABLE public.categories 
ADD CONSTRAINT categories_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For monthly_budgets table
ALTER TABLE public.monthly_budgets 
DROP CONSTRAINT IF EXISTS monthly_budgets_user_id_fkey;

ALTER TABLE public.monthly_budgets 
ADD CONSTRAINT monthly_budgets_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For mental_states table
ALTER TABLE public.mental_states 
DROP CONSTRAINT IF EXISTS mental_states_user_id_fkey;

ALTER TABLE public.mental_states 
ADD CONSTRAINT mental_states_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For vision_boards table
ALTER TABLE public.vision_boards 
DROP CONSTRAINT IF EXISTS vision_boards_user_id_fkey;

ALTER TABLE public.vision_boards 
ADD CONSTRAINT vision_boards_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- For vision_board_items table
ALTER TABLE public.vision_board_items 
DROP CONSTRAINT IF EXISTS vision_board_items_user_id_fkey;

ALTER TABLE public.vision_board_items 
ADD CONSTRAINT vision_board_items_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Success message
SELECT 'CASCADE DELETE constraints added successfully!' as result;