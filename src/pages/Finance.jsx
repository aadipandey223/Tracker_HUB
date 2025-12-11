import { useState, useMemo, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { base44 } from '@/api/base44Client.supabase';
import { useSettings } from '@/context/SettingsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Download
} from 'lucide-react';
import FinanceChart from '@/components/finance/FinanceChart';
import EditableTable from '@/components/finance/EditableTable';
import { encryptData, decryptData } from '@/utils/encryption';

export default function Finance() {
  const { t } = useTranslation();
  const { formatCurrency } = useSettings();
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [debtData, setDebtData] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isEditingBalance, setIsEditingBalance] = useState(false);

  const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

  // Fetch monthly budget data
  const { data: monthlyBudget, isLoading: isLoadingBudget } = useQuery({
    queryKey: ['monthlyBudget', monthKey],
    queryFn: async () => {
      const budgets = await base44.entities.MonthlyBudget.list();
      return budgets.find(b => b.month === monthKey && b.category === 'total_balance') || null;
    },
  });

  // Load data from localStorage (user-specific)
  useEffect(() => {
    const getUserId = async () => {
      try {
        const user = await base44.auth.me();
        return user?.id || 'anonymous';
      } catch {
        return 'anonymous';
      }
    };

    getUserId().then(userId => {
      const storageKey = `finance_data_${userId}_${monthKey}`;
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        try {
          // Try to decrypt data (new format)
          const decrypted = decryptData(stored, userId);
          if (decrypted) {
            setIncomeData(decrypted.incomeData || []);
            setExpenseData(decrypted.expenseData || []);
            setDebtData(decrypted.debtData || []);
          } else {
            // Fallback to old unencrypted format
            const data = JSON.parse(stored);
            setIncomeData(data.incomeData || []);
            setExpenseData(data.expenseData || []);
            setDebtData(data.debtData || []);
          }
        } catch (error) {
          console.error('Error loading finance data:', error);
          setIncomeData([]);
          setExpenseData([]);
          setDebtData([]);
        }
      } else {
        setIncomeData([]);
        setExpenseData([]);
        setDebtData([]);
      }

      if (monthlyBudget) {
        setTotalBalance(monthlyBudget.budget_limit || 0);
      } else if (!isLoadingBudget) {
        // Try to load from localStorage as fallback
        const fallbackBalance = localStorage.getItem(`total_balance_${userId}_${monthKey}`);
        if (fallbackBalance) {
          const numValue = parseFloat(fallbackBalance);
          setTotalBalance(isNaN(numValue) ? 0 : numValue);
        } else {
          setTotalBalance(0);
        }
      }
    });
  }, [monthKey, monthlyBudget, isLoadingBudget]);

  const saveBudget = async (updates) => {
    const dataToSave = {
      month: monthKey,
      category: 'total_balance', // Required field - using a default category for total balance
      budget_amount: 0, // Required field - default to 0 for total balance entries
      budget_limit: updates.totalBalance !== undefined ? updates.totalBalance : totalBalance,
    };

    try {
      // Check if user is authenticated
      const user = await base44.auth.me();
      if (!user) {
        alert('Please log in to save your budget data.');
        return;
      }

      // Test database connection first
      const budgets = await base44.entities.MonthlyBudget.list();
      
      // Look for existing total balance entry for this month
      const existingBudget = budgets.find(b => b.month === monthKey && b.category === 'total_balance');

      if (existingBudget) {
        await base44.entities.MonthlyBudget.update(existingBudget.id, {
          budget_limit: dataToSave.budget_limit
        });
      } else {
        await base44.entities.MonthlyBudget.create(dataToSave);
      }
      
      queryClient.invalidateQueries(['monthlyBudget', monthKey]);
    } catch (error) {
      console.error('Error saving budget:', error);
      
      // Check if it's a database structure issue
      if (error.message && error.message.includes('column') && error.message.includes('does not exist')) {
        console.error('Database table structure issue:', error.message);
        throw new Error('Database table needs to be updated. Please contact support.');
      } else if (error.message && error.message.includes('null value in column')) {
        console.error('Missing required field:', error.message);
        throw new Error('Missing required data. Please try again.');
      } else {
        throw error; // Re-throw to be handled by handleBalanceChange
      }
    }
  };

  const saveTableData = async (updates) => {
    try {
      const user = await base44.auth.me();
      const userId = user?.id || 'anonymous';
      const storageKey = `finance_data_${userId}_${monthKey}`;
      const currentData = {
        incomeData: updates.incomeData !== undefined ? updates.incomeData : incomeData,
        expenseData: updates.expenseData !== undefined ? updates.expenseData : expenseData,
        debtData: updates.debtData !== undefined ? updates.debtData : debtData,
      };
      // Encrypt data before storing
      const encrypted = encryptData(currentData, userId);
      if (encrypted) {
        localStorage.setItem(storageKey, encrypted);
      }
    } catch (error) {
      console.error('Error saving finance data:', error);
    }
  };

  const handleIncomeChange = (newData) => {
    setIncomeData(newData);
    saveTableData({ incomeData: newData });
  };

  const handleExpenseChange = (newData) => {
    setExpenseData(newData);
    saveTableData({ expenseData: newData });
  };

  const handleDebtChange = (newData) => {
    setDebtData(newData);
    saveTableData({ debtData: newData });
  };

  const handleBalanceChange = async (newBalance) => {
    const numValue = parseFloat(newBalance);
    const finalValue = isNaN(numValue) ? 0 : numValue;
    setTotalBalance(finalValue);
    
    try {
      // Save to database
      await saveBudget({ totalBalance: finalValue });
      
      // Also save to localStorage as backup
      const user = await base44.auth.me();
      const userId = user?.id || 'anonymous';
      localStorage.setItem(`total_balance_${userId}_${monthKey}`, finalValue.toString());
      
    } catch (error) {
      console.error('Error saving balance:', error);
      
      // Fallback: save to localStorage only
      try {
        const user = await base44.auth.me();
        const userId = user?.id || 'anonymous';
        localStorage.setItem(`total_balance_${userId}_${monthKey}`, finalValue.toString());
        alert('Saved locally. Database connection issue - will sync when connection is restored.');
      } catch (fallbackError) {
        console.error('Fallback save failed:', fallbackError);
        alert('Failed to save total balance. Please check your connection and try again.');
      }
    }
  };

  const metrics = useMemo(() => {
    const income = incomeData.reduce((sum, row) => sum + (parseFloat(row.col3) || 0), 0);
    const expenses = expenseData.reduce((sum, row) => sum + (parseFloat(row.col3) || 0), 0);

    const totalDebtPaid = debtData.reduce((sum, row) => sum + (parseFloat(row.col3) || 0), 0);

    // Balance = Initial Balance + Income - Expenses - Debt Paid
    const balance = totalBalance + income - expenses - totalDebtPaid;

    const totalDebt = debtData.reduce((sum, row) => {
      const total = parseFloat(row.col2) || 0;
      const paid = parseFloat(row.col3) || 0;
      return sum + (total - paid);
    }, 0);
    const plannedIncome = incomeData.reduce((sum, row) => sum + (parseFloat(row.col2) || 0), 0);

    // Savings Rate = (Income - Expenses - Debt Paid) / Income * 100
    const totalOutflow = expenses + totalDebtPaid;
    const savingsRate = income > 0 ? ((income - totalOutflow) / income * 100) : 0;

    return { income, expenses, balance, totalDebt, savingsRate };
  }, [incomeData, expenseData, debtData, totalBalance]);

  const expensesByCategory = useMemo(() => {
    return expenseData
      .filter(row => row.col1 && parseFloat(row.col3) > 0)
      .map(row => ({
        name: row.col1,
        value: parseFloat(row.col3) || 0
      }));
  }, [expenseData]);

  const incomeVsExpenses = useMemo(() => [{
    name: 'This Month',
    Income: metrics.income,
    Expenses: metrics.expenses,
  }], [metrics]);

  const incomeByCategory = useMemo(() => {
    return incomeData
      .filter(row => row.col1 && parseFloat(row.col3) > 0)
      .map(row => ({
        name: row.col1,
        value: parseFloat(row.col3) || 0
      }));
  }, [incomeData]);

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  const monthName = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const exportData = () => {
    // Helper to format numbers without currency symbols for CSV
    const formatNumber = (num) => num.toFixed(2);

    const csvData = [
      ['Finance Dashboard Export'],
      ['Month', monthName],
      ['Generated', new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })],
      [],
      ['Metrics'],
      ['Income', formatNumber(metrics.income)],
      ['Expenses', formatNumber(metrics.expenses)],
      ['Balance', formatNumber(metrics.balance)],
      ['Total Balance', formatNumber(totalBalance)],
      ['Total Debt', formatNumber(metrics.totalDebt)],
      ['Savings Rate', metrics.savingsRate.toFixed(1) + '%'],
      [],
      ['Income Data'],
      ['Source', 'Planned', 'Actual'],
      ...incomeData.map(row => [row.col1 || '', row.col2 || '0', row.col3 || '0']),
      [],
      ['Expense Data'],
      ['Category', 'Planned', 'Actual'],
      ...expenseData.map(row => [row.col1 || '', row.col2 || '0', row.col3 || '0']),
      [],
      ['Debt Data'],
      ['Source', 'Total Debt', 'Paid'],
      ...debtData.map(row => [row.col1 || '', row.col2 || '0', row.col3 || '0']),
    ];

    // Properly escape CSV values
    const escapeCsvValue = (value) => {
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = csvData.map(row => row.map(escapeCsvValue).join(',')).join('\n');
    const monthKeyExport = currentMonth.toISOString().slice(0, 7);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `finance_export_${monthKeyExport}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 py-8 finance-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t('finance.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('finance.subtitle')}
            </p>
          </div>
          <Button id="finance-export-btn" className="gap-2 bg-green-600 hover:bg-green-700" onClick={exportData}>
            <Download className="w-4 h-4" />
            {t('finance.exportData')}
          </Button>
        </div>

        <div className="mb-8">
          <div id="finance-month-nav" className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth(-1)}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white min-w-[200px] text-center">
              {monthName}
            </h2>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth(1)}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div id="finance-stats" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="bg-white dark:bg-gray-800 border-green-200 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('finance.income')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(metrics.income)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-red-200 dark:border-red-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('finance.expenses')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(metrics.expenses)}
                </p>
              </CardContent>
            </Card>

            <Card className={`bg-white dark:bg-gray-800 ${metrics.balance >= 0 ? 'border-blue-200 dark:border-blue-800' : 'border-red-200 dark:border-red-800'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('finance.balance')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${metrics.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(metrics.balance)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-purple-200 dark:border-purple-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('finance.totalBalance')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditingBalance ? (
                  <input
                    type="number"
                    value={totalBalance || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || value === null || value === undefined) {
                        setTotalBalance('');
                      } else {
                        // Allow partial input while typing
                        setTotalBalance(value);
                      }
                    }}
                    onBlur={async () => {
                      setIsEditingBalance(false);
                      await handleBalanceChange(totalBalance);
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        setIsEditingBalance(false);
                        await handleBalanceChange(totalBalance);
                      }
                    }}
                    autoFocus
                    step="any"
                    className="text-2xl font-bold text-purple-600 bg-transparent border-0 border-b-2 border-purple-600 focus:outline-none w-full"
                  />
                ) : (
                  <p
                    className="text-2xl font-bold text-purple-600 cursor-pointer hover:opacity-80"
                    onClick={() => setIsEditingBalance(true)}
                  >
                    {formatCurrency(totalBalance)}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('finance.debt')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(metrics.totalDebt)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t('finance.savingsRate')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {metrics.savingsRate >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                  <p className={`text-2xl font-bold ${metrics.savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics.savingsRate.toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div id="finance-charts" className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FinanceChart
            title={t('finance.expensesByCategory')}
            data={expensesByCategory}
            defaultType="pie"
          />
          <FinanceChart
            title={t('finance.incomeVsExpenses')}
            data={incomeVsExpenses}
            defaultType="bar"
          />
          <FinanceChart
            title={t('finance.incomeByCategory')}
            data={incomeByCategory}
            defaultType="pie"
          />
        </div>

        <div id="finance-tables" className="space-y-6 mb-8">
          <EditableTable
            key={`expense-${monthKey}`}
            title={t('finance.plannedExpenses')}
            columns={[t('finance.category'), t('finance.planned'), t('finance.actual'), t('finance.variance'), t('finance.variancePercent')]}
            type="expense"
            data={expenseData}
            onDataChange={handleExpenseChange}
          />
          <EditableTable
            key={`income-${monthKey}`}
            title={t('finance.plannedIncome')}
            columns={[t('finance.source'), t('finance.planned'), t('finance.actual'), t('finance.variance'), t('finance.variancePercent')]}
            type="income"
            data={incomeData}
            onDataChange={handleIncomeChange}
          />
          <EditableTable
            key={`debt-${monthKey}`}
            title={t('finance.debtTracker')}
            columns={[t('finance.source'), t('finance.totalDebt'), t('finance.paid'), t('finance.outstanding'), t('finance.progressPercent')]}
            type="debt"
            data={debtData}
            onDataChange={handleDebtChange}
          />
        </div>
      </div>
    </div>
  );
}
