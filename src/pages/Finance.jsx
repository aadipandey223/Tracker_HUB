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
  const [incomeData, setIncomeData] = useState([
    { id: '1', col1: '', col2: '', col3: '', editable: true }
  ]);
  const [expenseData, setExpenseData] = useState([
    { id: '1', col1: '', col2: '', col3: '', editable: true }
  ]);
  const [debtData, setDebtData] = useState([
    { id: '1', col1: '', col2: '', col3: '', editable: true }
  ]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isEditingBalance, setIsEditingBalance] = useState(false);

  const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

  // Fetch monthly budget data (total balance)
  const { data: monthlyBudget, isLoading: isLoadingBudget } = useQuery({
    queryKey: ['monthlyBudget', monthKey],
    queryFn: async () => {
      const budgets = await base44.entities.MonthlyBudget.list();
      return budgets.find(b => b.month === monthKey) || null;
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
            setIncomeData(decrypted.incomeData && decrypted.incomeData.length > 0 ? decrypted.incomeData : [
              { id: '1', col1: '', col2: '', col3: '', editable: true }
            ]);
            setExpenseData(decrypted.expenseData && decrypted.expenseData.length > 0 ? decrypted.expenseData : [
              { id: '1', col1: '', col2: '', col3: '', editable: true }
            ]);
            setDebtData(decrypted.debtData && decrypted.debtData.length > 0 ? decrypted.debtData : [
              { id: '1', col1: '', col2: '', col3: '', editable: true }
            ]);
          } else {
            // Fallback to old unencrypted format
            const data = JSON.parse(stored);
            setIncomeData(data.incomeData && data.incomeData.length > 0 ? data.incomeData : [
              { id: '1', col1: '', col2: '', col3: '', editable: true }
            ]);
            setExpenseData(data.expenseData && data.expenseData.length > 0 ? data.expenseData : [
              { id: '1', col1: '', col2: '', col3: '', editable: true }
            ]);
            setDebtData(data.debtData && data.debtData.length > 0 ? data.debtData : [
              { id: '1', col1: '', col2: '', col3: '', editable: true }
            ]);
          }
        } catch (error) {
          console.error('Error loading finance data:', error);
          // Set default empty rows on error
          setIncomeData([{ id: '1', col1: '', col2: '', col3: '', editable: true }]);
          setExpenseData([{ id: '1', col1: '', col2: '', col3: '', editable: true }]);
          setDebtData([{ id: '1', col1: '', col2: '', col3: '', editable: true }]);
        }
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
    // For now, just save to localStorage until database is fixed
    try {
      const user = await base44.auth.me();
      const userId = user?.id || 'anonymous';
      const balanceKey = `total_balance_${userId}_${monthKey}`;
      const balanceValue = updates.totalBalance !== undefined ? updates.totalBalance : totalBalance;
      
      localStorage.setItem(balanceKey, balanceValue.toString());
      console.log('Total balance saved to localStorage:', balanceValue);
      
      // Try database save but don't fail if it doesn't work
      try {
        const budgets = await base44.entities.MonthlyBudget.list();
        const existingBudget = budgets.find(b => b.month === monthKey);

        if (existingBudget) {
          await base44.entities.MonthlyBudget.update(existingBudget.id, {
            budget_limit: balanceValue
          });
        } else {
          await base44.entities.MonthlyBudget.create({
            month: monthKey,
            budget_limit: balanceValue
          });
        }
        queryClient.invalidateQueries(['monthlyBudget', monthKey]);
        console.log('Total balance also saved to database');
      } catch (dbError) {
        console.log('Database save failed, but localStorage save succeeded:', dbError.message);
      }
    } catch (error) {
      console.error('Error saving budget:', error);
      throw error;
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
        alert('Failed to save total balance. Please run the database recreation script in Supabase or check your connection.');
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
              Finance Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track your income, expenses, and budget
            </p>
          </div>
          <Button id="finance-export-btn" className="gap-2 bg-green-600 hover:bg-green-700" onClick={exportData}>
            <Download className="w-4 h-4" />
            Export Data
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
                  Income
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
                  Expenses
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
                  Balance
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
                  Total Balance
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
                  Debt
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
                  Savings Rate
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
            title="Expenses by Category"
            data={expensesByCategory}
            defaultType="pie"
          />
          <FinanceChart
            title="Income vs Expenses"
            data={incomeVsExpenses}
            defaultType="bar"
          />
          <FinanceChart
            title="Income by Category"
            data={incomeByCategory}
            defaultType="pie"
          />
        </div>

        <div id="finance-tables" className="space-y-6 mb-8">
          <EditableTable
            key={`expense-${monthKey}`}
            title="Planned Expenses"
            columns={['Category', 'Planned', 'Actual', 'Variance', 'Variance %']}
            type="expense"
            data={expenseData}
            onDataChange={handleExpenseChange}
          />
          <EditableTable
            key={`income-${monthKey}`}
            title="Planned Income"
            columns={['Source', 'Planned', 'Actual', 'Variance', 'Variance %']}
            type="income"
            data={incomeData}
            onDataChange={handleIncomeChange}
          />
          <EditableTable
            key={`debt-${monthKey}`}
            title="Debt Tracker"
            columns={['Source', 'Total Debt', 'Paid', 'Outstanding', 'Progress %']}
            type="debt"
            data={debtData}
            onDataChange={handleDebtChange}
          />
        </div>
      </div>
    </div>
  );
}