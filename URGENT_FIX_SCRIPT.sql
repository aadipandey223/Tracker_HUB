-- ========================================
-- URGENT FIX SCRIPT FOR TRACKER HUB
-- Run this entire script in Supabase SQL Editor
-- ========================================

-- 1. Enable UUID extension (CRITICAL - fixes habit/vision board creation)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Add budget_limit column for finance total balance persistence
ALTER TABLE monthly_budgets 
ADD COLUMN IF NOT EXISTS budget_limit DECIMAL(10, 2) DEFAULT 0;

-- 3. Verify all tables have proper UUID defaults
-- (This ensures ID generation works even if tables were created before extension)

-- Habits table
ALTER TABLE habits 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Vision Boards table
ALTER TABLE vision_boards 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Tasks table  
ALTER TABLE tasks 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Categories table
ALTER TABLE categories 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Habit Logs table
ALTER TABLE habit_logs 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Mental States table
ALTER TABLE mental_states 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Transactions table
ALTER TABLE transactions 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Debts table
ALTER TABLE debts 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Monthly Budgets table
ALTER TABLE monthly_budgets 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Vision Board Items table
ALTER TABLE vision_board_items 
ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_monthly_budgets_month ON monthly_budgets(month);
CREATE INDEX IF NOT EXISTS idx_monthly_budgets_user_month ON monthly_budgets(user_id, month);

-- 5. Add helpful comments
COMMENT ON COLUMN monthly_budgets.budget_limit IS 'Total balance/starting balance for the month';

-- ========================================
-- VERIFICATION QUERIES
-- Run these after the above to verify everything works
-- ========================================

-- Test habit creation (should return a row with a valid UUID)
-- INSERT INTO habits (name, user_id, frequency, color, icon) 
-- VALUES ('Test Habit', auth.uid(), 'daily', '#ff6b35', '✓')
-- RETURNING id, name;

-- Test vision board creation (should return a row with a valid UUID)
-- INSERT INTO vision_boards (title, category, user_id) 
-- VALUES ('Test Board', 'Personal Development', auth.uid())
-- RETURNING id, title;

-- Verify budget_limit column exists
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'monthly_budgets' AND column_name = 'budget_limit';

-- ========================================
-- SUCCESS MESSAGE
-- ========================================
SELECT 'All fixes applied successfully! You can now:
1. Create habits without errors
2. Create vision boards without errors  
3. Save and load finance total balance
4. Export only CSV files (already fixed in code)
5. See larger finance charts (already fixed in code)' as status;
