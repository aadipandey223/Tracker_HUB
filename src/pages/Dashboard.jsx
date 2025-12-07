import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { base44 } from '@/api/base44Client.supabase';
import TaskSummaryCard from '@/components/dashboard/TaskSummaryCard';
import FinanceSummaryCard from '@/components/dashboard/FinanceSummaryCard';
import WeeklySummaryCard from '@/components/dashboard/WeeklySummaryCard';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTour } from '@/context/TourContext';

export default function Dashboard() {
  const { t } = useTranslation();
  const cardsRef = useRef([]);
  const { startTour } = useTour();

  // Fetch data for all trackers
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.list('-due_date', 100),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.FinanceTransaction.list('-date', 200),
  });

  const { data: debts = [] } = useQuery({
    queryKey: ['debts'],
    queryFn: () => base44.entities.Debt.list(),
  });

  // Fetch habit logs for the current week
  const { data: habitLogs = [] } = useQuery({
    queryKey: ['habitLogs', 'dashboard'],
    queryFn: () => {
      // Calculate start/end of week for optimization, or just fetch all recent
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      return base44.entities.HabitLog.select({
        buildQuery: (q) => q.gte('date', startOfWeek.toISOString().split('T')[0])
          .lte('date', endOfWeek.toISOString().split('T')[0])
      });
    }
  });

  // Fetch finance data from localStorage (blob format)
  const [financeData, setFinanceData] = useState(null);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        const user = await base44.auth.me();
        const userId = user?.id || 'anonymous';
        const today = new Date();
        const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

        const storageKey = `finance_data_${userId}_${monthKey}`;
        const stored = localStorage.getItem(storageKey);

        if (stored) {
          setFinanceData(JSON.parse(stored));
        }

        // Fetch Monthly Budget (Total Balance)
        const budgets = await base44.entities.MonthlyBudget.list();
        const budget = budgets.find(b => b.month === monthKey);
        if (budget) {
          setTotalBalance(budget.budget_limit || 0);
        } else {
          setTotalBalance(0);
        }
      } catch (error) {
        console.error('Error fetching finance data:', error);
      }
    };

    fetchFinanceData();
  }, []);

  // Scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative dashboard-container">
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .card-container {
          opacity: 0;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 dark:from-orange-800 dark:via-orange-700 dark:to-orange-600">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              {t('dashboard.badge')}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              {t('dashboard.title')}<br />
              {t('dashboard.subtitle')}
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto">
              {t('dashboard.description')}
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50" onClick={startTour}>
                {t('dashboard.getStarted')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white" onClick={() => window.open('https://aadipandey223.github.io/Portfolio/', '_blank')}>
                {t('dashboard.learnMore')}
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
      </section>

      {/* Stats Overview */}
      <section className="relative -mt-12 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: t('dashboard.totalTasks'), value: tasks.length, color: 'blue' },
              { label: t('dashboard.transactions'), value: transactions.length, color: 'green' },
              {
                label: t('dashboard.thisWeek'), value: tasks.filter(t => {
                  const today = new Date();
                  const startOfWeek = new Date(today);
                  startOfWeek.setDate(today.getDate() - today.getDay());
                  const endOfWeek = new Date(startOfWeek);
                  endOfWeek.setDate(startOfWeek.getDate() + 6);
                  return t.due_date >= startOfWeek.toISOString().split('T')[0] &&
                    t.due_date <= endOfWeek.toISOString().split('T')[0];
                }).length, color: 'purple'
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border border-gray-200 dark:border-gray-700"
              >
                <p className={`text-3xl md:text-4xl font-bold text-${stat.color}-600 mb-2`}>
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Dashboard Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('dashboard.trackingDashboard')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('dashboard.trackingDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div ref={(el) => (cardsRef.current[0] = el)} className="card-container">
            <TaskSummaryCard tasks={tasks} />
          </div>

          <div ref={(el) => (cardsRef.current[1] = el)} className="card-container" style={{ animationDelay: '0.1s' }}>
            <FinanceSummaryCard transactions={transactions} debts={debts} financeData={financeData} totalBalance={totalBalance} />
          </div>

          <div ref={(el) => (cardsRef.current[2] = el)} className="card-container" style={{ animationDelay: '0.2s' }}>
            <WeeklySummaryCard tasks={tasks} habitLogs={habitLogs} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-700 dark:to-orange-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('dashboard.ctaTitle')}
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            {t('dashboard.ctaDescription')}
          </p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50" onClick={startTour}>
            {t('dashboard.ctaButton')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
