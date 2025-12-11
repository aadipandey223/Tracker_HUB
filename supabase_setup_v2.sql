-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Tables (IF NOT EXISTS)
-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT,
    color TEXT,
    type TEXT CHECK (type IN ('task', 'income', 'expense', 'debt')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    priority TEXT CHECK (priority IN ('High', 'Medium', 'Low', 'Optional')) DEFAULT 'Medium',
    status TEXT CHECK (status IN ('Not Started', 'In Progress', 'Done', 'Canceled')) DEFAULT 'Not Started',
    category TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habits Table
CREATE TABLE IF NOT EXISTS habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    frequency TEXT,
    target_count INTEGER,
    color TEXT,
    icon TEXT,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habit Logs Table
CREATE TABLE IF NOT EXISTS habit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mental States Table
CREATE TABLE IF NOT EXISTS mental_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    mood TEXT,
    energy_level INTEGER,
    stress_level INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Finance Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    category TEXT NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Debts Table
CREATE TABLE IF NOT EXISTS debts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    due_date DATE,
    interest_rate DECIMAL(5, 2),
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monthly Budgets Table
CREATE TABLE IF NOT EXISTS monthly_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    month TEXT NOT NULL,
    category TEXT NOT NULL,
    budget_amount DECIMAL(10, 2) NOT NULL,
    spent_amount DECIMAL(10, 2) DEFAULT 0,
    budget_limit DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vision Boards Table
CREATE TABLE IF NOT EXISTS vision_boards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    background_color TEXT DEFAULT '#f8fafc',
    background_image TEXT,
    is_archived BOOLEAN DEFAULT FALSE,
    is_starred BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    theme TEXT CHECK (theme IN ('light', 'dark', 'gradient')) DEFAULT 'light',
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vision Board Items Table
CREATE TABLE IF NOT EXISTS vision_board_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    board_id UUID REFERENCES vision_boards(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('image', 'text', 'affirmation', 'goal', 'task')) NOT NULL,
    content TEXT,
    image_url TEXT,
    x INTEGER DEFAULT 0,
    y INTEGER DEFAULT 0,
    width INTEGER DEFAULT 200,
    height INTEGER DEFAULT 200,
    rotation INTEGER DEFAULT 0,
    z_index INTEGER DEFAULT 0,
    style JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_board_items ENABLE ROW LEVEL SECURITY;

-- 3. DROP OLD POLICIES
DROP POLICY IF EXISTS "Users can view their own categories" ON categories;
DROP POLICY IF EXISTS "Users can insert their own categories" ON categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON categories;

DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can insert their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;

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

DROP POLICY IF EXISTS "Users can view their own vision boards" ON vision_boards;
DROP POLICY IF EXISTS "Users can insert their own vision boards" ON vision_boards;
DROP POLICY IF EXISTS "Users can update their own vision boards" ON vision_boards;
DROP POLICY IF EXISTS "Users can delete their own vision boards" ON vision_boards;

DROP POLICY IF EXISTS "Users can view their own vision board items" ON vision_board_items;
DROP POLICY IF EXISTS "Users can insert their own vision board items" ON vision_board_items;
DROP POLICY IF EXISTS "Users can update their own vision board items" ON vision_board_items;
DROP POLICY IF EXISTS "Users can delete their own vision board items" ON vision_board_items;

-- 4. RE-CREATE POLICIES
-- RLS Policies for Categories
CREATE POLICY "Users can view their own categories" ON categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own categories" ON categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own categories" ON categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own categories" ON categories FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Tasks
CREATE POLICY "Users can view their own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Habits
CREATE POLICY "Users can view their own habits" ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Habit Logs
CREATE POLICY "Users can view their own habit logs" ON habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own habit logs" ON habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own habit logs" ON habit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own habit logs" ON habit_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Mental States
CREATE POLICY "Users can view their own mental states" ON mental_states FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own mental states" ON mental_states FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mental states" ON mental_states FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own mental states" ON mental_states FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Transactions
CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Debts
CREATE POLICY "Users can view their own debts" ON debts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own debts" ON debts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own debts" ON debts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own debts" ON debts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Monthly Budgets
CREATE POLICY "Users can view their own budgets" ON monthly_budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own budgets" ON monthly_budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own budgets" ON monthly_budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own budgets" ON monthly_budgets FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Vision Boards
CREATE POLICY "Users can view their own vision boards" ON vision_boards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own vision boards" ON vision_boards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vision boards" ON vision_boards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own vision boards" ON vision_boards FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Vision Board Items
CREATE POLICY "Users can view their own vision board items" ON vision_board_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own vision board items" ON vision_board_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vision board items" ON vision_board_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own vision board items" ON vision_board_items FOR DELETE USING (auth.uid() = user_id);

-- 5. Create Indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_id ON habit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(date);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_vision_boards_user_id ON vision_boards(user_id);
CREATE INDEX IF NOT EXISTS idx_vision_board_items_board_id ON vision_board_items(board_id);

-- 6. Storage Setup (for Avatars)
-- Insert 'avatars' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Allow public access to all avatars
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

-- Allow users to upload their own avatar
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);

-- Allow users to update their own avatar
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar" ON storage.objects
    FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- Allow users to delete their own avatar
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar" ON storage.objects
    FOR DELETE USING (bucket_id = 'avatars' AND auth.uid() = owner);
