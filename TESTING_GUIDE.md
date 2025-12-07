# Testing Guide - After Running Fix Script

## Step 1: Run the SQL Fix Script

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the entire contents of `URGENT_FIX_SCRIPT.sql`
4. Click "Run" or press Ctrl+Enter
5. You should see a success message

## Step 2: Test Each Fix

### ✅ Test 1: Habit Creation
1. Go to Habits page
2. Click "Add Habit" button
3. Enter a habit name (e.g., "Morning Exercise")
4. Click OK
5. **Expected:** Habit appears in the list without errors
6. **If it fails:** Check browser console (F12) for the exact error

### ✅ Test 2: Vision Board Creation  
1. Go to Vision Board page
2. Click "New Board" button
3. Choose a template or skip
4. Enter board details
5. Click "Create Board"
6. **Expected:** Board appears in the grid without errors
7. **If it fails:** Check browser console for the exact error

### ✅ Test 3: Finance Total Balance
1. Go to Finance page
2. Click on the purple "Total Balance" box
3. Enter a number (e.g., 50000)
4. Press Enter or click outside
5. Navigate to a different month using arrows
6. Navigate back to the original month
7. **Expected:** Your balance is still there
8. **If it fails:** 
   - Check if the SQL migration ran successfully
   - Check browser console for errors
   - Check Network tab to see if API call was made

### ✅ Test 4: CSV Export Only
1. Go to Finance page
2. Add some income/expense data
3. Click "Export Data" button
4. **Expected:** Only ONE file downloads (CSV format)
5. **If it fails:** Check Downloads folder - there should be no JSON file

### ✅ Test 5: Finance Chart Sizing
1. Go to Finance page
2. Scroll down to the charts section
3. Go to Tasks page
4. Compare the chart heights
5. **Expected:** Finance charts should be similar height to task charts
6. **If they're different:** Clear browser cache and refresh

### ✅ Test 6: Task Editing
1. Go to Tasks page
2. Click on a task title and type something
3. Change the priority using the dropdown
4. Change the status using the dropdown
5. Change the due date using the calendar
6. Refresh the page (F5)
7. **Expected:** All your changes are still there
8. **If changes don't persist:**
   - Open browser console (F12)
   - Try editing again and watch for errors
   - Check Network tab - you should see PUT/PATCH requests
   - Verify you're logged in

## Step 3: Common Issues & Solutions

### Issue: "Failed to create habit/board" still appears
**Solution:**
1. Make sure you ran the ENTIRE SQL script
2. Check if uuid-ossp extension is enabled:
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';
   ```
3. If not listed, run:
   ```sql
   CREATE EXTENSION "uuid-ossp";
   ```

### Issue: Total balance doesn't save
**Solution:**
1. Verify the column exists:
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'monthly_budgets' AND column_name = 'budget_limit';
   ```
2. If empty, run:
   ```sql
   ALTER TABLE monthly_budgets ADD COLUMN budget_limit DECIMAL(10, 2) DEFAULT 0;
   ```

### Issue: Task edits don't save
**Solution:**
1. Check browser console for errors
2. Verify RLS policies allow UPDATE:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'tasks' AND cmd = 'UPDATE';
   ```
3. Make sure you're logged in (check top right corner)
4. Try logging out and back in

### Issue: Charts are still small
**Solution:**
1. Hard refresh the page: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Check if the file was actually updated (open DevTools → Sources → find FinanceChart.jsx)

## Step 4: Verify Everything Works

Run through this checklist:

- [ ] Created a habit successfully
- [ ] Created a vision board successfully
- [ ] Set total balance and it persisted after navigation
- [ ] Exported finance data and got only CSV file
- [ ] Finance charts are larger (similar to task charts)
- [ ] Edited a task and changes persisted after refresh
- [ ] Dashboard shows correct counts
- [ ] No console errors when using the app

## Step 5: If Issues Persist

1. **Check Supabase Logs:**
   - Go to Supabase Dashboard → Logs
   - Look for errors in the last hour
   - Copy any error messages

2. **Check Browser Console:**
   - Press F12
   - Go to Console tab
   - Look for red error messages
   - Copy the full error text

3. **Check Network Tab:**
   - Press F12
   - Go to Network tab
   - Try the failing action again
   - Look for failed requests (red)
   - Click on them to see the error response

4. **Provide This Information:**
   - Which test failed
   - Exact error message from console
   - Error from Supabase logs (if any)
   - Screenshot of the issue

## Quick Reference: SQL Queries

### Check if extension is enabled:
```sql
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';
```

### Check if budget_limit column exists:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'monthly_budgets' AND column_name = 'budget_limit';
```

### Test habit creation manually:
```sql
INSERT INTO habits (name, user_id, frequency, color, icon) 
VALUES ('Test Habit', auth.uid(), 'daily', '#ff6b35', '✓')
RETURNING *;
```

### Check RLS policies:
```sql
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('habits', 'vision_boards', 'tasks', 'monthly_budgets');
```
