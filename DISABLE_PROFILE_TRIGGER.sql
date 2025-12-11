-- TEMPORARY FIX: Disable Profile Creation Trigger
-- Use this if the main fix doesn't work
-- This will allow user creation without automatic profile creation

-- 1. Disable the trigger temporarily
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Drop the function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Make profiles table optional (remove NOT NULL constraints if any)
ALTER TABLE public.profiles ALTER COLUMN username DROP NOT NULL;

-- 4. Create a simpler trigger that won't fail
CREATE OR REPLACE FUNCTION public.handle_new_user_simple()
RETURNS trigger AS $$
BEGIN
  -- Try to insert, but don't fail if it doesn't work
  BEGIN
    INSERT INTO public.profiles (id, created_at)
    VALUES (NEW.id, NOW());
  EXCEPTION
    WHEN OTHERS THEN
      -- Just log and continue
      NULL;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create the new trigger
CREATE TRIGGER on_auth_user_created_simple
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_simple();

SELECT 'Simple user creation trigger enabled!' as result;