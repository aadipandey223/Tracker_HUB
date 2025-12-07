-- ========================================
-- FIX RLS POLICIES FOR HABITS AND VISION BOARDS
-- Run this in Supabase SQL Editor
-- ========================================

-- First, let's check what's wrong with the INSERT policies
-- The issue is that the policy checks auth.uid() but the app might not be passing user_id correctly

-- Drop and recreate INSERT policies for habits
DROP POLICY IF EXISTS "Users can insert their own habits" ON habits;
CREATE POLICY "Users can insert their own habits" 
ON habits FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Drop and recreate INSERT policies for vision_boards
DROP POLICY IF EXISTS "Users can insert their own vision boards" ON vision_boards;
CREATE POLICY "Users can insert their own vision boards" 
ON vision_boards FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Also ensure SELECT policies exist (needed to see created items)
DROP POLICY IF EXISTS "Users can view their own habits" ON habits;
CREATE POLICY "Users can view their own habits" 
ON habits FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own vision boards" ON vision_boards;
CREATE POLICY "Users can view their own vision boards" 
ON vision_boards FOR SELECT 
USING (auth.uid() = user_id);

-- Verify the user is authenticated
SELECT 
    CASE 
        WHEN auth.uid() IS NULL THEN '❌ ERROR: You are not logged in! Please log in to your app first.'
        ELSE '✅ SUCCESS: You are logged in as user: ' || auth.uid()::text
    END as authentication_status;

-- ========================================
-- VERIFICATION: Test habit creation
-- ========================================
-- Uncomment and run this to test:
-- INSERT INTO habits (name, user_id, frequency, color, icon) 
-- VALUES ('Test Habit RLS', auth.uid(), 'daily', '#ff6b35', '✓')
-- RETURNING id, name, user_id;

-- If the above works, your RLS policies are fixed!
-- If it fails, you might not be logged in or there's another issue.

-- ========================================
-- ALTERNATIVE: Temporarily disable RLS for testing
-- (NOT RECOMMENDED for production, but useful for debugging)
-- ========================================
-- Uncomment these lines ONLY if you want to test without RLS:
-- ALTER TABLE habits DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE vision_boards DISABLE ROW LEVEL SECURITY;

-- Remember to re-enable after testing:
-- ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE vision_boards ENABLE ROW LEVEL SECURITY;
