-- Update monthly_budgets table schema to match application requirements
-- Run this in your Supabase SQL Editor

-- First, check if the table exists and its current structure
-- You can run: \d monthly_budgets

-- If the table doesn't exist, create it:
CREATE TABLE IF NOT EXISTS monthly_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    month TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'total_balance',
    budget_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    spent_amount DECIMAL(10, 2) DEFAULT 0,
    budget_limit DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- If the table exists but is missing columns, add them:
-- (These will fail silently if columns already exist)
ALTER TABLE monthly_budgets ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'total_balance';
ALTER TABLE monthly_budgets ADD COLUMN IF NOT EXISTS budget_amount DECIMAL(10, 2) NOT NULL DEFAULT 0;
ALTER TABLE monthly_budgets ADD COLUMN IF NOT EXISTS budget_limit DECIMAL(10, 2) DEFAULT 0;

-- Enable Row Level Security
ALTER TABLE monthly_budgets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies if they don't exist
DO $$ 
BEGIN
    -- Check if policies exist before creating them
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'monthly_budgets' AND policyname = 'Users can view their own budgets') THEN
        CREATE POLICY "Users can view their own budgets" ON monthly_budgets FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'monthly_budgets' AND policyname = 'Users can insert their own budgets') THEN
        CREATE POLICY "Users can insert their own budgets" ON monthly_budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'monthly_budgets' AND policyname = 'Users can update their own budgets') THEN
        CREATE POLICY "Users can update their own budgets" ON monthly_budgets FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'monthly_budgets' AND policyname = 'Users can delete their own budgets') THEN
        CREATE POLICY "Users can delete their own budgets" ON monthly_budgets FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'monthly_budgets' 
ORDER BY ordinal_position;