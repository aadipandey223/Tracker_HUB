# Internationalization - Remaining Pages TODO

## Status
✅ **COMPLETED**: Main Dashboard page
⏳ **PENDING**: Habits, Tasks, Finance, Vision Board pages

## What's Already Done
- Main Dashboard page (hero, stats, all 3 cards)
- All 6 languages have dashboard translations
- Settings page already has i18n support

## What Needs to Be Done

### 1. **Tasks Page** (`Pages/Task.jsx`)
**Text to Translate:**
- Page title: "Tasks"
- Buttons: "Add Task", "New Task"
- Filters: "All", "Priority", "Status", "Category"
- Status labels: "Not Started", "In Progress", "Done"
- Priority labels: "High", "Medium", "Low"
- Stats labels: "Total Tasks", "Completed", "In Progress", "Overdue"
- Form labels: "Title", "Description", "Due Date", "Priority", "Status", "Category"
- Actions: "Edit", "Delete", "Mark as Done"

**Steps:**
1. Add `import { useTranslation } from 'react-i18next';`
2. Add `const { t } = useTranslation();` in component
3. Replace all hardcoded text with `{t('tasks.keyName')}`
4. Add translation keys to all 6 language files

### 2. **Habits Page** (`src/pages/Habits.jsx`)
**Text to Translate:**
- Page title: "Habits"
- Buttons: "Add Habit", "Log Habit"
- Frequency labels: "Daily", "Weekly", "Monthly"
- Stats: "Active Habits", "Streak", "Completion Rate"
- Calendar labels: Days of week, months
- Form labels: "Habit Name", "Description", "Frequency", "Goal"
- Actions: "Edit", "Delete", "Mark Complete"

**Steps:**
1. Add `import { useTranslation } from 'react-i18next';`
2. Add `const { t } = useTranslation();` in component
3. Replace all hardcoded text with `{t('habits.keyName')}`
4. Add translation keys to all 6 language files

### 3. **Finance Page** (`src/pages/Finance.jsx`)
**Text to Translate:**
- Page title: "Finance Dashboard"
- Subtitle: "Track your income, expenses, and financial goals"
- Buttons: "Export Data"
- Month navigation
- Metric labels: "Income", "Expenses", "Balance", "Total Balance", "Debt", "Savings Rate"
- Chart titles: "Expenses by Category", "Income vs Expenses", "Income by Category"
- Table titles: "Planned Expenses", "Planned Income", "Debt Tracker"
- Column headers: "Category", "Source", "Planned", "Actual", "Variance", "Total Debt", "Paid", "Outstanding", "Progress"

**Steps:**
1. Add `import { useTranslation } from 'react-i18next';`
2. Add `const { t } = useTranslation();` in component
3. Replace all hardcoded text with `{t('finance.keyName')}`
4. Add translation keys to all 6 language files

### 4. **Vision Board Page** (`Pages/visionBoard.jsx`)
**Text to Translate:**
- Page title: "Vision Board"
- Buttons: "Create Board", "Add Item", "Edit", "Delete"
- Form labels: "Board Name", "Description", "Goal", "Target Date"
- Item labels: "Title", "Description", "Image", "Status"
- Actions: "View", "Edit", "Delete", "Duplicate"

**Steps:**
1. Add `import { useTranslation } from 'react-i18next';`
2. Add `const { t } = useTranslation();` in component
3. Replace all hardcoded text with `{t('visionBoard.keyName')}`
4. Add translation keys to all 6 language files

## Translation Keys Structure

Add these sections to all language files (`en.json`, `es.json`, `fr.json`, `de.json`, `hi.json`, `zh.json`):

```json
{
  "tasks": {
    "title": "Tasks",
    "addTask": "Add Task",
    "newTask": "New Task",
    "editTask": "Edit Task",
    "deleteTask": "Delete Task",
    "markAsDone": "Mark as Done",
    "filters": "Filters",
    "priority": "Priority",
    "status": "Status",
    "category": "Category",
    "dueDate": "Due Date",
    "description": "Description",
    "notStarted": "Not Started",
    "inProgress": "In Progress",
    "totalTasks": "Total Tasks",
    "completedTasks": "Completed Tasks",
    "overdueTasks": "Overdue Tasks"
  },
  "habits": {
    "title": "Habits",
    "addHabit": "Add Habit",
    "editHabit": "Edit Habit",
    "deleteHabit": "Delete Habit",
    "logHabit": "Log Habit",
    "habitName": "Habit Name",
    "frequency": "Frequency",
    "daily": "Daily",
    "weekly": "Weekly",
    "monthly": "Monthly",
    "streak": "Streak",
    "completionRate": "Completion Rate",
    "activeHabits": "Active Habits",
    "goal": "Goal"
  },
  "finance": {
    "title": "Finance Dashboard",
    "subtitle": "Track your income, expenses, and financial goals",
    "exportData": "Export Data",
    "plannedExpenses": "Planned Expenses",
    "plannedIncome": "Planned Income",
    "debtTracker": "Debt Tracker",
    "category": "Category",
    "source": "Source",
    "planned": "Planned",
    "actual": "Actual",
    "variance": "Variance",
    "totalDebt": "Total Debt",
    "paid": "Paid",
    "outstanding": "Outstanding",
    "progress": "Progress",
    "expensesByCategory": "Expenses by Category",
    "incomeVsExpenses": "Income vs Expenses",
    "incomeByCategory": "Income by Category"
  },
  "visionBoard": {
    "title": "Vision Board",
    "createBoard": "Create Board",
    "addItem": "Add Item",
    "editBoard": "Edit Board",
    "deleteBoard": "Delete Board",
    "boardName": "Board Name",
    "targetDate": "Target Date",
    "viewBoard": "View Board",
    "duplicate": "Duplicate"
  }
}
```

## Quick Implementation Guide

For each page, follow this pattern:

### Before:
```jsx
export default function TasksPage() {
  return (
    <div>
      <h1>Tasks</h1>
      <button>Add Task</button>
    </div>
  );
}
```

### After:
```jsx
import { useTranslation } from 'react-i18next';

export default function TasksPage() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('tasks.title')}</h1>
      <button>{t('tasks.addTask')}</button>
    </div>
  );
}
```

## Priority Order
1. **Finance Page** - Most visible, has many labels
2. **Tasks Page** - Core functionality
3. **Habits Page** - Core functionality  
4. **Vision Board** - Secondary feature

## Estimated Effort
- Each page: ~30-45 minutes
- Total: ~2-3 hours for all pages
- Translation verification: ~30 minutes

## Testing Checklist
For each page after implementation:
- [ ] Change language in Settings
- [ ] Navigate to the page
- [ ] Verify all text changes to selected language
- [ ] Check buttons, labels, headers, tooltips
- [ ] Test with all 6 languages

## Notes
- The i18n infrastructure is already set up
- Language selection in Settings already works
- Just need to add `useTranslation` hook and replace text
- All translation files are in `src/i18n/locales/`

Would you like me to implement these translations for all remaining pages now?
