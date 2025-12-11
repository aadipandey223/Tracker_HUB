-- RECREATE FINANCE TABLES FOR TRACKER HUB
-- Run this script in your Supabase SQL Editor to completely recreate finance tables

-- =====================================================
-- STEP 1: DROP EXISTING TABLES (if they exist)
-- =====================================================

-- Drop tables in correct order (child tables first due to foreign keys)
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.debts CASCADE;
DROP TABLE IF EXISTS public.monthly_budgets CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- =====================================================
-- STEP 2: CREATE NEW TABLES WITH CORRECT STRUCTURE
-- =====================================================

-- Categories Table (for organizing expenses/income)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monthly Budgets Table (simplified for total balance tracking)
CREATE TABLE public.monthly_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    month TEXT NOT NULL, -- Format: YYYY-MM
    budget_limit DECIMAL(12, 2) DEFAULT 0, -- Total balance/budget limit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one budget per user per month
    UNIQUE(user_id, month)
);

-- Finance Transactions Table (for detailed income/expense tracking)
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    month TEXT NOT NULL, -- Format: YYYY-MM
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    description TEXT NOT NULL,
    planned_amount DECIMAL(12, 2) DEFAULT 0,
    actual_amount DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Debts Table (for debt tracking)
CREATE TABLE public.debts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    month TEXT NOT NULL, -- Format: YYYY-MM
    description TEXT NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes for better query performance
CREATE INDEX idx_categories_user_id ON public.categories(user_id);
CREATE INDEX idx_categories_type ON public.categories(type);

CREATE INDEX idx_monthly_budgets_user_id ON public.monthly_budgets(user_id);
CREATE INDEX idx_monthly_budgets_month ON public.monthly_budgets(month);
CREATE INDEX idx_monthly_budgets_user_month ON public.monthly_budgets(user_id, month);

CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_month ON public.transactions(month);
CREATE INDEX idx_transactions_type ON public.transactions(type);
CREATE INDEX idx_transactions_user_month ON public.transactions(user_id, month);

CREATE INDEX idx_debts_user_id ON public.debts(user_id);
CREATE INDEX idx_debts_month ON public.debts(month);
CREATE INDEX idx_debts_user_month ON public.debts(user_id, month);

-- =====================================================
-- STEP 4: ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 5: CREATE RLS POLICIES
-- =====================================================

-- Categories Policies
CREATE POLICY "Users can view own categories" ON public.categories
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" ON public.categories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" ON public.categories
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" ON public.categories
    FOR DELETE USING (auth.uid() = user_id);

-- Monthly Budgets Policies
CREATE POLICY "Users can view own budgets" ON public.monthly_budgets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets" ON public.monthly_budgets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets" ON public.monthly_budgets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets" ON public.monthly_budgets
    FOR DELETE USING (auth.uid() = user_id);

-- Transactions Policies
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions" ON public.transactions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions" ON public.transactions
    FOR DELETE USING (auth.uid() = user_id);

-- Debts Policies
CREATE POLICY "Users can view own debts" ON public.debts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own debts" ON public.debts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own debts" ON public.debts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own debts" ON public.debts
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- STEP 6: CREATE UPDATED_AT TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_monthly_budgets_updated_at 
    BEFORE UPDATE ON public.monthly_budgets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON public.transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_debts_updated_at 
    BEFORE UPDATE ON public.debts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STEP 7: INSERT DEFAULT CATEGORIES (OPTIONAL)
-- =====================================================

-- You can uncomment these to add default categories for new users
-- Note: These will only work if you have a user authenticated

/*
-- Default Expense Categories
INSERT INTO public.categories (user_id, name, type, color) VALUES
(auth.uid(), 'Food & Dining', 'expense', '#EF4444'),
(auth.uid(), 'Transportation', 'expense', '#F97316'),
(auth.uid(), 'Shopping', 'expense', '#EAB308'),
(auth.uid(), 'Entertainment', 'expense', '#8B5CF6'),
(auth.uid(), 'Bills & Utilities', 'expense', '#06B6D4'),
(auth.uid(), 'Healthcare', 'expense', '#10B981'),
(auth.uid(), 'Education', 'expense', '#3B82F6'),
(auth.uid(), 'Travel', 'expense', '#F59E0B'),
(auth.uid(), 'Other', 'expense', '#6B7280');

-- Default Income Categories
INSERT INTO public.categories (user_id, name, type, color) VALUES
(auth.uid(), 'Salary', 'income', '#10B981'),
(auth.uid(), 'Freelance', 'income', '#059669'),
(auth.uid(), 'Investment', 'income', '#047857'),
(auth.uid(), 'Business', 'income', '#065F46'),
(auth.uid(), 'Other Income', 'income', '#064E3B');
*/

-- =====================================================
-- STEP 8: VERIFY TABLE CREATION
-- =====================================================

-- Check if all tables were created successfully
SELECT 
    schemaname,
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('categories', 'monthly_budgets', 'transactions', 'debts')
ORDER BY tablename;

-- Check RLS status
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('categories', 'monthly_budgets', 'transactions', 'debts')
ORDER BY tablename;

-- Success message
SELECT 'Finance tables recreated successfully! 🎉' as status;