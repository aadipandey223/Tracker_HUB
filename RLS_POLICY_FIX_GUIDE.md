# RLS Policy Error Fix Guide

## Error: "new row violates row-level security policy for table 'habits'"

This error means the Row Level Security (RLS) policy is blocking the insert because either:
1. You're not logged in
2. The user_id isn't being passed correctly
3. The RLS policy is misconfigured

---

## Solution 1: Verify You're Logged In (MOST COMMON)

### Check if you're logged in:
1. Open your app
2. Look at the top right corner - do you see your profile/email?
3. If not, **LOG IN FIRST** before creating habits

### If you're not logged in:
1. Click the login button
2. Sign in with your credentials
3. Try creating a habit again

---

## Solution 2: Run the RLS Policy Fix Script

**File:** `FIX_RLS_POLICIES.sql`

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `FIX_RLS_POLICIES.sql`
4. Click "Run"
5. Check the output - it will tell you if you're logged in

---

## Solution 3: Check Browser Console

1. Open browser console (F12)
2. Go to Console tab
3. Try creating a habit
4. Look for messages like:
   - "Creating habits with user_id: ..."
   - "No user found - user might not be logged in"
   - "Auth error in create: ..."

### If you see "No user found":
- You're not logged in to the app
- Log in and try again

### If you see "Auth error":
- Your session might have expired
- Log out and log back in

---

## Solution 4: Verify RLS Policies in Supabase

1. Go to Supabase Dashboard
2. Click on "Authentication" → "Policies"
3. Find the "habits" table
4. Check if these policies exist:
   - ✅ "Users can insert their own habits" (INSERT)
   - ✅ "Users can view their own habits" (SELECT)
   - ✅ "Users can update their own habits" (UPDATE)
   - ✅ "Users can delete their own habits" (DELETE)

### If policies are missing:
Run `FIX_RLS_POLICIES.sql` to recreate them

---

## Solution 5: Test in Supabase SQL Editor

Run this query in Supabase SQL Editor:

```sql
-- Check if you're authenticated
SELECT auth.uid() as my_user_id;
```

**If result is NULL:**
- You're not logged in to Supabase
- This is different from being logged in to your app
- The app needs to authenticate with Supabase

**If result shows a UUID:**
- You're authenticated
- Try this test insert:

```sql
INSERT INTO habits (name, user_id, frequency, color, icon) 
VALUES ('Test Habit', auth.uid(), 'daily', '#ff6b35', '✓')
RETURNING *;
```

---

## Solution 6: Temporarily Disable RLS (FOR TESTING ONLY)

⚠️ **WARNING:** This removes security. Only use for testing!

```sql
ALTER TABLE habits DISABLE ROW LEVEL SECURITY;
ALTER TABLE vision_boards DISABLE ROW LEVEL SECURITY;
```

Try creating a habit. If it works, the issue is with RLS policies.

**Remember to re-enable:**
```sql
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_boards ENABLE ROW LEVEL SECURITY;
```

Then run `FIX_RLS_POLICIES.sql` to fix the policies properly.

---

## Solution 7: Check Supabase Logs

1. Go to Supabase Dashboard
2. Click "Logs" in the left sidebar
3. Look for recent errors
4. Check for messages about:
   - Authentication failures
   - RLS policy violations
   - Missing user_id

---

## Quick Checklist

Run through this in order:

1. [ ] Are you logged in to the app? (Check top right corner)
2. [ ] Did you run `URGENT_FIX_SCRIPT.sql`?
3. [ ] Did you run `FIX_RLS_POLICIES.sql`?
4. [ ] Did you refresh the browser (Ctrl+Shift+R)?
5. [ ] Check browser console - any errors?
6. [ ] Check Supabase logs - any errors?

---

## Still Not Working?

### Get Detailed Error Info:

1. **Open browser console** (F12)
2. **Try creating a habit**
3. **Copy the FULL error message** including:
   - The red error text
   - Any "Creating habits with user_id" messages
   - Any authentication errors

4. **Check Supabase logs:**
   - Go to Dashboard → Logs
   - Copy any recent errors

5. **Run this in Supabase SQL Editor:**
```sql
-- Check authentication
SELECT auth.uid() as user_id;

-- Check RLS policies
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'habits';

-- Try manual insert
INSERT INTO habits (name, user_id, frequency, color, icon) 
VALUES ('Manual Test', auth.uid(), 'daily', '#ff6b35', '✓')
RETURNING *;
```

---

## Most Likely Cause

**90% of the time, this error means you're not logged in to the app.**

### How to fix:
1. Look at the top right of your app
2. If you don't see your profile/email, click "Login"
3. Sign in with your credentials
4. Try creating a habit again

The improved error handling in the code will now tell you explicitly if you're not logged in!

---

## Summary of Files

- **`FIX_RLS_POLICIES.sql`** - Fixes RLS policies
- **`URGENT_FIX_SCRIPT.sql`** - Fixes UUID generation (run this first)
- **`src/api/base44Client.supabase.js`** - Updated with better error messages

Run both SQL scripts, make sure you're logged in, and try again!
