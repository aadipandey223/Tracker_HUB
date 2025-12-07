-- ========================================
-- COMPLETE FIX SCRIPT - RUN THIS NOW
-- ========================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Fix all table UUID defaults
ALTER TABLE habits ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE vision_boards ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE tasks ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE categories ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE habit_logs ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE mental_states ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE transactions ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE debts ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE monthly_budgets ALTER COLUMN id SET DEFAULT uuid_generate_v4();
ALTER TABLE vision_board_items ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- 3. Add budget_limit column
ALTER TABLE monthly_budgets ADD COLUMN IF NOT EXISTS budget_limit DECIMAL(10, 2) DEFAULT 0;

-- 4. Fix RLS policies for habits
DROP POLICY IF EXISTS "Users can insert their own habits" ON habits;
CREATE POLICY "Users can insert their own habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own habits" ON habits;
CREATE POLICY "Users can view their own habits" ON habits FOR SELECT USING (auth.uid() = user_id);

-- 5. Fix RLS policies for vision_boards
DROP POLICY IF EXISTS "Users can insert their own vision boards" ON vision_boards;
CREATE POLICY "Users can insert their own vision boards" ON vision_boards FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own vision boards" ON vision_boards;
CREATE POLICY "Users can view their own vision boards" ON vision_boards FOR SELECT USING (auth.uid() = user_id);

-- Done!
SELECT '✅ All fixes applied! Now LOG IN to your app and try creating a habit.' as status;
