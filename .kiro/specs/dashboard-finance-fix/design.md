# Design Document

## Overview

This design addresses the incorrect financial calculations displayed on the Dashboard's FinanceSummaryCard component. The current implementation has several critical issues:

1. Savings rate calculation doesn't account for debt payments, resulting in extreme negative values
2. Balance calculation is incomplete and doesn't match the Finance page logic
3. Total Balance is not fetched or passed to the component
4. Currency formatting uses USD ($) instead of INR (₹)

The solution involves updating the Dashboard.jsx to fetch and pass Total Balance data, and modifying FinanceSummaryCard.jsx to use the correct calculation formulas that match the Finance page.

## Architecture

The fix involves two main components:

1. **Dashboard.jsx** - Parent component that fetches financial data and passes it to child cards
2. **FinanceSummaryCard.jsx** - Child component that displays financial metrics summary

Data flow:
```
Dashboard.jsx
  ├─ Fetch financeData from localStorage (income, expense, debt tables)
  ├─ Fetch totalBalance from MonthlyBudget entity
  └─ Pass both to FinanceSummaryCard
       └─ Calculate metrics using correct formulas
```

## Components and Interfaces

### Dashboard.jsx Changes

**Current State:**
- Fetches financeData from localStorage
- Fetches totalBalance from MonthlyBudget
- Does NOT pass totalBalance to FinanceSummaryCard

**Required Changes:**
- Pass totalBalance prop to FinanceSummaryCard component

### FinanceSummaryCard.jsx Changes

**Current Props:**
```javascript
{ transactions, debts, financeData }
```

**New Props:**
```javascript
{ transactions, debts, financeData, totalBalance }
```

**Current Calculations:**
```javascript
balance = totalIncome - totalExpenses
savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100
```

**New Calculations:**
```javascript
totalDebtPaid = sum of debtData[].col3
balance = totalBalance + totalIncome - totalExpenses - totalDebtPaid
savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses - totalDebtPaid) / totalIncome) * 100 : 0
```

## Data Models

### financeData Structure (from localStorage)
```javascript
{
  incomeData: [
    { col1: "Source", col2: "Planned", col3: "Actual" }
  ],
  expenseData: [
    { col1: "Category", col2: "Planned", col3: "Actual" }
  ],
  debtData: [
    { col1: "Source", col2: "Total Debt", col3: "Paid" }
  ]
}
```

### MonthlyBudget Entity
```javascript
{
  id: UUID,
  user_id: UUID,
  month: "YYYY-MM",
  budget_limit: number,
  created_at: timestamp
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Savings rate calculation with debt payments

*For any* set of income, expense, and debt data where income > 0, the savings rate SHALL equal (Income - Expenses - Debt Paid) / Income × 100, and when income = 0, the savings rate SHALL equal 0%

**Validates: Requirements 1.1, 1.5, 4.1, 4.3**

### Property 2: Balance calculation includes all components

*For any* financial data, the balance SHALL equal: Total Balance + Income - Expenses - Debt Paid, where Debt Paid is the sum of col3 from all debtData rows

**Validates: Requirements 1.2, 4.1, 4.2, 4.3**

### Property 3: Currency formatting uses INR

*For any* currency value displayed on the Dashboard, the formatted string SHALL contain the ₹ symbol, include thousand separators for values ≥ 1000, and display exactly two decimal places

**Validates: Requirements 2.1, 2.2, 2.3**

## Error Handling

1. **Missing Total Balance**: If no MonthlyBudget record exists for the current month, default to 0
2. **Division by Zero**: When calculating savings rate with zero income, return 0% instead of NaN or Infinity
3. **Missing financeData**: Fall back to legacy transaction/debt entity logic if localStorage data is unavailable
4. **Invalid Number Values**: Use parseFloat with || 0 fallback to handle empty or invalid numeric inputs

## Testing Strategy

### Unit Tests

1. Test savings rate calculation with various income/expense/debt combinations
2. Test savings rate returns 0% when income is 0
3. Test balance calculation with positive and negative scenarios
4. Test currency formatting with various amounts (small, large, negative)
5. Test Total Balance defaults to 0 when not found
6. Test debt payment calculation from debtData array

### Integration Tests

1. Verify Dashboard fetches and passes totalBalance to FinanceSummaryCard
2. Verify FinanceSummaryCard receives and uses totalBalance prop
3. Verify calculations match between Dashboard and Finance page for the same data
4. Verify currency formatting is consistent across all financial displays

### Manual Testing

1. Compare Dashboard metrics with Finance page metrics for the same month
2. Verify savings rate displays reasonable values (not extreme negatives)
3. Verify Total Balance appears on Dashboard
4. Verify all currency values use ₹ symbol
5. Test with edge cases: no income, no expenses, no debt, no total balance
