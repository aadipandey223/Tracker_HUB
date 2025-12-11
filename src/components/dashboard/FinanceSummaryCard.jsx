import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useSettings } from '@/context/SettingsContext';
import { useTranslation } from 'react-i18next';

export default function FinanceSummaryCard({ transactions = [], debts = [], financeData = null, totalBalance = 0 }) {
  const { t } = useTranslation();
  const { formatCurrency } = useSettings();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();


  // Logic to calculate stats from financeData (Sheet Blob) if available
  // Fallback to legacy transactions/debts logic if not

  let totalIncome = 0;
  let totalExpenses = 0;
  let totalDebt = 0;
  let totalDebtPaid = 0;
  let topExpenseCategory = null;

  if (financeData) {
    // --- Blob Logic ---
    const { incomeData = [], expenseData = [], debtData = [] } = financeData;

    totalIncome = incomeData.reduce((sum, row) => sum + (parseFloat(row.col3) || 0), 0);
    totalExpenses = expenseData.reduce((sum, row) => sum + (parseFloat(row.col3) || 0), 0);

    // Total Debt Paid = Sum of Paid column (col3)
    totalDebtPaid = debtData.reduce((sum, row) => sum + (parseFloat(row.col3) || 0), 0);

    // Total Debt = Sum of (Total Debt - Paid)
    totalDebt = debtData.reduce((sum, row) => {
      const total = parseFloat(row.col2) || 0;
      const paid = parseFloat(row.col3) || 0;
      return sum + (total - paid);
    }, 0);

    // Top Expense Category
    const expensesByCategory = expenseData
      .filter(row => row.col1 && parseFloat(row.col3) > 0)
      .reduce((acc, row) => {
        const cat = row.col1;
        const amt = parseFloat(row.col3) || 0;
        acc[cat] = (acc[cat] || 0) + amt;
        return acc;
      }, {});

    topExpenseCategory = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)[0];

  } else {
    // --- Legacy Entity Logic ---
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear &&
        !t.is_planned;
    });

    totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    totalExpenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    totalDebt = debts.reduce((sum, d) => sum + (d.total_amount - d.paid_amount), 0);

    const expensesByCategory = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    topExpenseCategory = Object.entries(expensesByCategory)
      .sort(([, a], [, b]) => b - a)[0];
  }

  // Updated calculations to include debt payments and total balance
  const balance = totalBalance + totalIncome - totalExpenses - totalDebtPaid;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses - totalDebtPaid) / totalIncome) * 100 : 0;

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-green-200 dark:border-green-900 bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-green-600" />
            Finance Tracker
          </span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">This Month</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Balance */}
        <div className="text-center p-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white">
          <p className="text-sm opacity-90 mb-2">Current Balance</p>
          <p className="text-4xl font-bold">
            {formatCurrency(balance)}
          </p>
          <p className="text-sm opacity-90 mt-2">
            {savingsRate.toFixed(1)}% savings rate
          </p>
        </div>

        {/* Income, Expenses & Total Balance */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalIncome)}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Balance</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(totalBalance)}
            </p>
          </div>
        </div>

        {/* Top Expense Category */}
        {topExpenseCategory && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Top Expense Category</h4>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {topExpenseCategory[0]}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatCurrency(topExpenseCategory[1])}
              </span>
            </div>
            <Progress
              value={(topExpenseCategory[1] / totalExpenses) * 100}
              className="h-2"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {((topExpenseCategory[1] / totalExpenses) * 100).toFixed(1)}% {t('dashboard.ofTotalExpenses')}
            </p>
          </div>
        )}

        {/* Debt Summary */}
        {totalDebt > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.totalDebt')}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{debts.length} {t('dashboard.activeDebts')}</p>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(totalDebt)}
              </p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">
              {financeData ? financeData.incomeData?.length || 0 : transactions.filter(t => t.type === 'income').length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.incomeTxns')}</p>
          </div>
          <div className="text-center border-x border-gray-200 dark:border-gray-700">
            <p className="text-xl font-bold text-red-600">
              {financeData ? financeData.expenseData?.length || 0 : transactions.filter(t => t.type === 'expense').length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.expenseTxns')}</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">
              {financeData
                ? (financeData.incomeData?.length || 0) + (financeData.expenseData?.length || 0)
                : transactions.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.totalTxns')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}