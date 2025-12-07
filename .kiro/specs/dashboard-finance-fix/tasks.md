# Implementation Plan

- [-] 1. Update FinanceSummaryCard to accept totalBalance prop and fix calculations

  - Add totalBalance to component props
  - Update balance calculation to: totalBalance + totalIncome - totalExpenses - totalDebtPaid
  - Calculate totalDebtPaid by summing col3 from debtData array
  - Update savings rate calculation to: (totalIncome - totalExpenses - totalDebtPaid) / totalIncome * 100
  - Add zero-income check: return 0% when totalIncome is 0
  - Update currency formatting from $ to ₹ for all amounts
  - Ensure formatCurrency helper function exists or create inline formatting
  - _Requirements: 1.1, 1.2, 1.5, 2.1, 2.2, 2.3, 4.1, 4.2, 4.3_

- [ ] 1.1 Write property test for savings rate calculation
  - **Property 1: Savings rate calculation with debt payments**
  - **Validates: Requirements 1.1, 1.5, 4.1, 4.3**

- [ ] 1.2 Write property test for balance calculation
  - **Property 2: Balance calculation includes all components**
  - **Validates: Requirements 1.2, 4.1, 4.2, 4.3**

- [ ] 1.3 Write property test for currency formatting
  - **Property 3: Currency formatting uses INR**
  - **Validates: Requirements 2.1, 2.2, 2.3**


- [ ] 2. Update Dashboard to pass totalBalance to FinanceSummaryCard
  - Pass totalBalance prop to FinanceSummaryCard component
  - Verify totalBalance is already being fetched from MonthlyBudget entity
  - Ensure totalBalance defaults to 0 when not found
  - _Requirements: 1.3, 3.1, 3.2, 3.3_

- [ ] 2.1 Write unit test for totalBalance prop passing
  - Verify Dashboard passes totalBalance to FinanceSummaryCard
  - Verify default value of 0 when no budget exists
  - _Requirements: 3.2, 3.3_




- [ ] 3. Add Total Balance display card to Dashboard
  - Add a new metric card in the FinanceSummaryCard to display Total Balance
  - Use consistent styling with other metric cards
  - Format using INR currency
  - _Requirements: 1.4_

- [ ] 4. Checkpoint - Verify calculations match Finance page
  - Ensure all tests pass, ask the user if questions arise
