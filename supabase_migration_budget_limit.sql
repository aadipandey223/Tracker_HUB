-- Migration: Add budget_limit column to monthly_budgets table
-- This column stores the user's total balance for each month

-- Add budget_limit column if it doesn't exist
ALTER TABLE monthly_budgets 
ADD COLUMN IF NOT EXISTS budget_limit DECIMAL(10, 2) DEFAULT 0;

-- Add comment to document the column purpose
COMMENT ON COLUMN monthly_budgets.budget_limit IS 'Total balance/starting balance for the month';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_monthly_budgets_month ON monthly_budgets(month);
CREATE INDEX IF NOT EXISTS idx_monthly_budgets_user_month ON monthly_budgets(user_id, month);
