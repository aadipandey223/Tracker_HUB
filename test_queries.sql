-- Quick Test Queries for Supabase SQL Editor
-- Run these in your Supabase SQL Editor to verify everything is working

-- 1. Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Verify RLS is enabled on all tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 3. Check all RLS policies
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- 4. Test inserting a category (replace YOUR_USER_ID with actual user ID from auth.users)
-- First, check your user ID:
SELECT id, email FROM auth.users LIMIT 1;

-- Then insert a test category (replace the UUID):
-- INSERT INTO categories (user_id, name, icon, color, type)
-- VALUES ('YOUR_USER_ID', 'Test Category', '📝', '#FF6B35', 'task');

-- 5. Verify the category was inserted
SELECT * FROM categories;

-- 6. Test inserting a task
-- INSERT INTO tasks (user_id, title, description, due_date, priority, status, category)
-- VALUES ('YOUR_USER_ID', 'Test Task', 'This is a test', CURRENT_DATE, 'High', 'Not Started', 'Test Category');

-- 7. Verify the task was inserted
SELECT * FROM tasks;

-- 8. Check habit logs structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'habit_logs'
ORDER BY ordinal_position;

-- 9. Count records in each table
SELECT 
  'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'tasks', COUNT(*) FROM tasks
UNION ALL
SELECT 'habits', COUNT(*) FROM habits
UNION ALL
SELECT 'habit_logs', COUNT(*) FROM habit_logs
UNION ALL
SELECT 'mental_states', COUNT(*) FROM mental_states
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'debts', COUNT(*) FROM debts
UNION ALL
SELECT 'monthly_budgets', COUNT(*) FROM monthly_budgets
UNION ALL
SELECT 'vision_boards', COUNT(*) FROM vision_boards
UNION ALL
SELECT 'vision_board_items', COUNT(*) FROM vision_board_items;

-- 10. Verify indexes are created
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
