import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function FinanceSummaryCard({ transactions = [], debts = [] }) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && 
           date.getFullYear() === currentYear && 
           !t.is_planned;
  });
  
  const totalIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;
  
  const totalDebt = debts.reduce((sum, d) => sum + (d.total_amount - d.paid_amount), 0);
  
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // Calculate expense breakdown by category
  const expensesByCategory = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const topExpenseCategory = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)[0];

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
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {savingsRate > 0 && (
            <p className="text-sm opacity-90 mt-2">
              {savingsRate.toFixed(1)}% savings rate
            </p>
          )}
        </div>

        {/* Income & Expenses */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Income</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Expenses</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </p>
          </div>
        </div>

        {/* Top Expense Category */}
        {topExpenseCategory && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Top Expense</h4>
            <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {topExpenseCategory[0]}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ${topExpenseCategory[1].toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </span>
            </div>
            <Progress 
              value={(topExpenseCategory[1] / totalExpenses) * 100} 
              className="h-2"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {((topExpenseCategory[1] / totalExpenses) * 100).toFixed(1)}% of total expenses
            </p>
          </div>
        )}

        {/* Debt Summary */}
        {totalDebt > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Debt</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{debts.length} active debt(s)</p>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                ${totalDebt.toLocaleString('en-US', { minimumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{monthTransactions.filter(t => t.type === 'income').length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Income Txns</p>
          </div>
          <div className="text-center border-x border-gray-200 dark:border-gray-700">
            <p className="text-xl font-bold text-red-600">{monthTransactions.filter(t => t.type === 'expense').length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Expense Txns</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-blue-600">{monthTransactions.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Total Txns</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}