-- ========================================
-- CRITICAL SECURITY FIX - DATA ISOLATION
-- This ensures each user can ONLY see their own data
-- ========================================

-- 1. ENABLE RLS on all tables (if not already enabled)
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_board_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_budgets ENABLE ROW LEVEL SECURITY;

-- 2. DROP ALL EXISTING POLICIES (to start fresh)
DROP POLICY IF EXISTS "Users can view their own habits" ON habits;
DROP POLICY IF EXISTS "Users can insert their own habits" ON habits;
DROP POLICY IF EXISTS "Users can update their own habits" ON habits;
DROP POLICY IF EXISTS "Users can delete their own habits" ON habits;

DROP POLICY IF EXISTS "Users can view their own habit logs" ON habit_logs;
DROP POLICY IF EXISTS "Users can insert their own habit logs" ON habit_logs;
DROP POLICY IF EXISTS "Users can update their own habit logs" ON habit_logs;
DROP POLICY IF EXISTS "Users can delete their own habit logs" ON habit_logs;

DROP POLICY IF EXISTS "Users can view their own mental states" ON mental_states;
DROP POLICY IF EXISTS "Users can insert their own mental states" ON mental_states;
DROP POLICY IF EXISTS "Users can update their own mental states" ON mental_states;
DROP POLICY IF EXISTS "Users can delete their own mental states" ON mental_states;

DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;

DROP POLICY IF EXISTS "Users can view their own categories" ON categories;
DROP POLICY IF EXISTS "Users can insert their own categories" ON categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON categories;

DROP POLICY IF EXISTS "Users can view their own vision boards" ON vision_boards;
DROP POLICY IF EXISTS "Users can insert their own vision boards" ON vision_boards;
DROP POLICY IF EXISTS "Users can update their own vision boards" ON vision_boards;
DROP POLICY IF EXISTS "Users can delete their own vision boards" ON vision_boards;

DROP POLICY IF EXISTS "Users can view their own vision board items" ON vision_board_items;
DROP POLICY IF EXISTS "Users can insert their own vision board items" ON vision_board_items;
DROP POLICY IF EXISTS "Users can update their own vision board items" ON vision_board_items;
DROP POLICY IF EXISTS "Users can delete their own vision board items" ON vision_board_items;

DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON transactions;

DROP POLICY IF EXISTS "Users can view their own debts" ON debts;
DROP POLICY IF EXISTS "Users can insert their own debts" ON debts;
DROP POLICY IF EXISTS "Users can update their own debts" ON debts;
DROP POLICY IF EXISTS "Users can delete their own debts" ON debts;

DROP POLICY IF EXISTS "Users can view their own budgets" ON monthly_budgets;
DROP POLICY IF EXISTS "Users can insert their own budgets" ON monthly_budgets;
DROP POLICY IF EXISTS "Users can update their own budgets" ON monthly_budgets;
DROP POLICY IF EXISTS "Users can delete their own budgets" ON monthly_budgets;

-- 3. CREATE SECURE POLICIES FOR ALL TABLES

-- HABITS
CREATE POLICY "Users can view their own habits" ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

-- HABIT LOGS
CREATE POLICY "Users can view their own habit logs" ON habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own habit logs" ON habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habit logs" ON habit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habit logs" ON habit_logs FOR DELETE USING (auth.uid() = user_id);

-- MENTAL STATES
CREATE POLICY "Users can view their own mental states" ON mental_states FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own mental states" ON mental_states FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mental states" ON mental_states FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own mental states" ON mental_states FOR DELETE USING (auth.uid() = user_id);

-- TASKS
CREATE POLICY "Users can view their own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- CATEGORIES
CREATE POLICY "Users can view their own categories" ON categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own categories" ON categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own categories" ON categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own categories" ON categories FOR DELETE USING (auth.uid() = user_id);

-- VISION BOARDS
CREATE POLICY "Users can view their own vision boards" ON vision_boards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own vision boards" ON vision_boards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vision boards" ON vision_boards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own vision boards" ON vision_boards FOR DELETE USING (auth.uid() = user_id);

-- VISION BOARD ITEMS
CREATE POLICY "Users can view their own vision board items" ON vision_board_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own vision board items" ON vision_board_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vision board items" ON vision_board_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own vision board items" ON vision_board_items FOR DELETE USING (auth.uid() = user_id);

-- TRANSACTIONS
CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);

-- DEBTS
CREATE POLICY "Users can view their own debts" ON debts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own debts" ON debts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own debts" ON debts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own debts" ON debts FOR DELETE USING (auth.uid() = user_id);

-- MONTHLY BUDGETS
CREATE POLICY "Users can view their own budgets" ON monthly_budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own budgets" ON monthly_budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own budgets" ON monthly_budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own budgets" ON monthly_budgets FOR DELETE USING (auth.uid() = user_id);

-- 4. VERIFY POLICIES ARE ACTIVE
SELECT 
    tablename,
    policyname,
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN 'Has USING clause'
        ELSE 'No USING clause'
    END as using_clause,
    CASE 
        WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause'
        ELSE 'No WITH CHECK clause'
    END as with_check_clause
FROM pg_policies 
WHERE tablename IN (
    'habits', 'habit_logs', 'mental_states', 'tasks', 'categories',
    'vision_boards', 'vision_board_items', 'transactions', 'debts', 'monthly_budgets'
)
ORDER BY tablename, cmd;

-- 5. SUCCESS MESSAGE
SELECT '✅ SECURITY FIX APPLIED! All users now have isolated data. Log out and log back in to test.' as status;
