-- DELETE USER DATA SCRIPT
-- Replace 'USER_ID_HERE' with the actual user ID you want to delete
-- Run this in Supabase SQL Editor BEFORE deleting the user

-- 1. First, find the user ID you want to delete
-- SELECT id, email FROM auth.users WHERE email = 'user@example.com';

-- 2. Replace USER_ID_HERE with the actual UUID
DO $$
DECLARE
    target_user_id UUID := 'USER_ID_HERE'; -- Replace with actual user ID
BEGIN
    -- Delete from all tables that reference user_id
    DELETE FROM public.vision_board_items WHERE user_id = target_user_id;
    DELETE FROM public.vision_boards WHERE user_id = target_user_id;
    DELETE FROM public.mental_states WHERE user_id = target_user_id;
    DELETE FROM public.monthly_budgets WHERE user_id = target_user_id;
    DELETE FROM public.categories WHERE user_id = target_user_id;
    DELETE FROM public.debts WHERE user_id = target_user_id;
    DELETE FROM public.transactions WHERE user_id = target_user_id;
    DELETE FROM public.tasks WHERE user_id = target_user_id;
    DELETE FROM public.habit_logs WHERE user_id = target_user_id;
    DELETE FROM public.habits WHERE user_id = target_user_id;
    DELETE FROM public.profiles WHERE id = target_user_id;
    
    RAISE NOTICE 'Successfully deleted all data for user: %', target_user_id;
END $$;

-- 3. After running this script, you can delete the user from Supabase Dashboard