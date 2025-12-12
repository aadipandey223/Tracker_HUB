-- =====================================================
-- FIX CATEGORIES TABLE TO SUPPORT TASK CATEGORIES
-- =====================================================
-- This script fixes the categories table to support task categories
-- by updating the CHECK constraint to allow 'task', 'income', 'expense', and 'debt' types.
-- It also adds an 'icon' column if it doesn't exist.

-- Step 1: Add icon column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'categories' 
        AND column_name = 'icon'
    ) THEN
        ALTER TABLE public.categories ADD COLUMN icon TEXT;
        RAISE NOTICE 'Added icon column to categories table';
    ELSE
        RAISE NOTICE 'Icon column already exists in categories table';
    END IF;
END $$;

-- Step 2: Drop the old CHECK constraint
DO $$ 
BEGIN
    -- Find and drop any existing CHECK constraints on the type column
    ALTER TABLE public.categories DROP CONSTRAINT IF EXISTS categories_type_check;
    RAISE NOTICE 'Dropped old CHECK constraint on type column';
EXCEPTION
    WHEN undefined_object THEN
        RAISE NOTICE 'No existing CHECK constraint found on type column';
END $$;

-- Step 3: Add the new CHECK constraint with all category types
ALTER TABLE public.categories 
ADD CONSTRAINT categories_type_check 
CHECK (type IN ('task', 'income', 'expense', 'debt'));

-- Step 4: Make type column NOT NULL if it isn't already
DO $$ 
BEGIN
    ALTER TABLE public.categories ALTER COLUMN type SET NOT NULL;
    RAISE NOTICE 'Set type column to NOT NULL';
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Type column is already NOT NULL or has NULL values';
END $$;

-- Step 5: Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'categories'
ORDER BY ordinal_position;

-- Success message
SELECT '✅ Categories table updated successfully! You can now create task categories.' as status;
