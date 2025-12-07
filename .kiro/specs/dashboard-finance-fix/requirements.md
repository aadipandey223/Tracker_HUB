# Requirements Document

## Introduction

The Finance Dashboard summary card on the main Dashboard page displays incorrect financial metrics. The savings rate shows extreme negative values (e.g., -2475.8%), and the balance calculation doesn't match the Finance page logic. This feature will fix the calculation logic to ensure consistency between the Dashboard summary and the detailed Finance page.

## Glossary

- **Dashboard**: The main landing page showing summary cards for all tracking features
- **FinanceSummaryCard**: The component displayed on the Dashboard that shows a summary of financial metrics
- **Finance Page**: The detailed finance tracking page with full transaction tables and charts
- **Savings Rate**: The percentage of income remaining after expenses and debt payments: (Income - Expenses - Debt Paid) / Income × 100
- **Balance**: The current month's balance calculated as: Total Balance + Income - Expenses - Debt Paid
- **Total Balance**: The starting balance for the month (budget_limit from MonthlyBudget entity)
- **Finance Data**: User-specific financial data stored in localStorage containing income, expense, and debt tables

## Requirements

### Requirement 1

**User Story:** As a user, I want the Dashboard finance summary to show accurate financial metrics, so that I can trust the overview without needing to visit the Finance page

#### Acceptance Criteria

1. WHEN calculating the savings rate THEN the system SHALL use the formula: (Income - Expenses - Debt Paid) / Income × 100
2. WHEN calculating the current balance THEN the system SHALL use the formula: Total Balance + Income - Expenses - Debt Paid
3. WHEN the Dashboard loads THEN the system SHALL fetch the Total Balance from the MonthlyBudget entity for the current month
4. WHEN displaying the Total Balance on the Dashboard THEN the system SHALL show it as a separate metric card
5. WHEN no income exists THEN the system SHALL display the savings rate as 0% instead of calculating division by zero

### Requirement 2

**User Story:** As a user, I want consistent currency formatting across the application, so that financial data is displayed uniformly

#### Acceptance Criteria

1. WHEN displaying currency values on the Dashboard THEN the system SHALL use INR (₹) formatting to match the Finance page
2. WHEN formatting currency amounts THEN the system SHALL use the format: ₹X,XXX.XX with two decimal places
3. WHEN displaying large amounts THEN the system SHALL include thousand separators for readability

### Requirement 3

**User Story:** As a user, I want the Dashboard to display the same Total Balance value as the Finance page, so that I have a consistent view of my starting balance

#### Acceptance Criteria

1. WHEN the Dashboard fetches financial data THEN the system SHALL retrieve the Total Balance from the same source as the Finance page
2. WHEN the Total Balance is displayed THEN the system SHALL pass it to the FinanceSummaryCard component
3. WHEN no Total Balance exists for the current month THEN the system SHALL default to 0

### Requirement 4

**User Story:** As a user, I want to see my debt payments reflected in the Dashboard calculations, so that my savings rate and balance are accurate

#### Acceptance Criteria

1. WHEN calculating financial metrics THEN the system SHALL include debt payments from the debtData array
2. WHEN computing total debt paid THEN the system SHALL sum the "Paid" column (col3) from all debt rows
3. WHEN debt payments exist THEN the system SHALL subtract them from both balance and savings rate calculations
