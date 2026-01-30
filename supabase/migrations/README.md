# Tracker Hub - Database Migrations

This folder contains all SQL migration files for the Tracker Hub application. These files should be run in **numerical order** in your Supabase SQL Editor.

## 📋 Migration Files (Execution Order)

### Core Migrations (Required)

Run these migrations in order to set up your database:

1. **`01_initial_setup.sql`** - Initial database setup
   - Creates all core tables (categories, tasks, habits, transactions, debts, budgets, vision boards, etc.)
   - Enables Row Level Security (RLS) on all tables
   - Creates RLS policies for user data isolation
   - Adds performance indexes

2. **`02_profiles_and_auth.sql`** - User profiles and authentication
   - Creates profiles table
   - Sets up automatic profile creation trigger
   - Configures RLS policies for profiles

3. **`03_storage_setup.sql`** - Storage buckets and policies
   - Creates 'avatars' bucket for user profile pictures
   - Creates 'files' bucket for user documents
   - Sets up storage access policies

## 🚀 How to Run Migrations

### First Time Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of each migration file **in order**
4. Run each migration by clicking "Run" or pressing `Ctrl+Enter`
5. Verify that each migration completes successfully before moving to the next

### Running Migrations

```sql
-- Step 1: Run initial setup
-- Copy contents of 01_initial_setup.sql and run

-- Step 2: Run profiles and auth
-- Copy contents of 02_profiles_and_auth.sql and run

-- Step 3: Run storage setup
-- Copy contents of 03_storage_setup.sql and run
```

## 🔧 Optional/Utility Scripts

These scripts are located in the root directory and can be run as needed:

- **`FIX_CATEGORIES_TABLE.sql`** - Fix categories table to support all types
- **`FIX_USER_CREATION_ERROR.sql`** - Troubleshoot user creation issues
- **`DISABLE_PROFILE_TRIGGER.sql`** - Temporary fix for profile creation
- **`ADD_CASCADE_DELETE.sql`** - Add CASCADE DELETE to foreign keys
- **`DELETE_USER_DATA.sql`** - Utility to delete user data (use with caution)
- **`CUSTOM_EMAIL_TEMPLATES.sql`** - Email templates for Supabase Auth

## ⚠️ Important Notes

### Before Running Migrations

- **Backup your data** if you have an existing database
- Ensure you have the correct Supabase project selected
- Check that you have admin permissions

### After Running Migrations

- Verify all tables were created: Check the "Table Editor" in Supabase
- Test RLS policies: Try creating/reading data as a test user
- Check storage buckets: Navigate to "Storage" in Supabase dashboard

### If You Encounter Errors

1. **"relation already exists"** - This is normal if running migrations multiple times. The scripts use `IF NOT EXISTS` to prevent errors.

2. **"policy already exists"** - The scripts drop existing policies before recreating them.

3. **"permission denied"** - Ensure you're running the scripts as a Supabase admin.

## 🗂️ Database Schema Overview

### Core Tables

- **`categories`** - Task, income, expense, and debt categories
- **`tasks`** - Task management with priorities and statuses
- **`habits`** - Habit tracking
- **`habit_logs`** - Daily habit completion logs
- **`mental_states`** - Mood and energy tracking
- **`transactions`** - Financial transactions
- **`debts`** - Debt tracking
- **`monthly_budgets`** - Monthly budget management
- **`vision_boards`** - Vision board management
- **`vision_board_items`** - Items within vision boards
- **`profiles`** - User profile information

### Security

All tables have **Row Level Security (RLS)** enabled, ensuring users can only access their own data.

## 📧 Email Templates

The `CUSTOM_EMAIL_TEMPLATES.sql` file contains beautiful HTML email templates for:
- User confirmation emails
- Password reset emails
- Magic link emails

To use these templates:
1. Go to **Authentication → Email Templates** in Supabase
2. Copy the HTML from the SQL file
3. Paste into the appropriate template section

## 🆘 Support

If you encounter issues:
1. Check the Supabase logs in the dashboard
2. Verify your environment variables in `.env`
3. Ensure your Supabase project is on a compatible plan
4. Review the RLS policies if data access issues occur

## 📝 Migration History

- **v1.0** - Initial database setup with all core tables
- **v1.1** - Added profiles and authentication
- **v1.2** - Added storage buckets and policies
