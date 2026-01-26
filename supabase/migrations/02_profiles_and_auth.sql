-- =====================================================
-- MIGRATION 02: PROFILES AND AUTH SETUP
-- Description: Create profiles table and auth trigger
-- Run Order: 2nd (After initial tables)
-- =====================================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text,
  avatar_url text,
  website text,
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

-- Create RLS policies for profiles
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into profiles with error handling
  INSERT INTO public.profiles (id, username, avatar_url, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
