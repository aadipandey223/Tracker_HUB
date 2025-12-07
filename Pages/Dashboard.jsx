import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client.supabase';
import HabitSummaryCard from '../Components/dashboard/HabitSummaryCard';
import TaskSummaryCard from '../Components/dashboard/TaskSummaryCard';
import FinanceSummaryCard from '../Components/dashboard/FinanceSummaryCard';
import WeeklySummaryCard from '../Components/dashboard/WeeklySummaryCard';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const cardsRef = useRef([]);

  // Fetch data for all trackers
  const { data: habits = [] } = useQuery({
    queryKey: ['habits'],
    queryFn: () => base44.entities.Habit.list(),
  });

  const { data: habitLogs = [] } = useQuery({
    queryKey: ['habitLogs'],
    queryFn: () => base44.entities.HabitLog.list('-date', 500),
  });

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
    <div className="relative">
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
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 dark:from-orange-700 dark:via-orange-800 dark:to-orange-900">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              All-in-One Productivity Hub
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Track Your Life,<br />
              Achieve Your Goals
            </h1>
            <p className="text-xl text-orange-100 max-w-2xl mx-auto text-center">
              Manage habits, tasks, finances, and weekly planning all in one beautiful dashboard
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
      </section>

      {/* Stats Overview */}
      <section className="relative -mt-12 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Habits', value: habits.length, color: 'orange' },
              { label: 'Total Tasks', value: tasks.length, color: 'blue' },
              { label: 'Transactions', value: transactions.length, color: 'green' },
              {
                label: 'This Week', value: tasks.filter(t => {
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
            Your Tracking Dashboard
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get a comprehensive view of your progress across all areas of life
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div ref={(el) => (cardsRef.current[0] = el)} className="card-container">
            <HabitSummaryCard habitLogs={habitLogs} habits={habits} />
          </div>

          <div ref={(el) => (cardsRef.current[1] = el)} className="card-container" style={{ animationDelay: '0.1s' }}>
            <TaskSummaryCard tasks={tasks} />
          </div>

          <div ref={(el) => (cardsRef.current[2] = el)} className="card-container" style={{ animationDelay: '0.2s' }}>
            <FinanceSummaryCard transactions={transactions} debts={debts} />
          </div>

          <div ref={(el) => (cardsRef.current[3] = el)} className="card-container" style={{ animationDelay: '0.3s' }}>
            <WeeklySummaryCard tasks={tasks} habitLogs={habitLogs} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-700 dark:to-orange-800 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Start tracking your habits, tasks, and finances today. Build the life you've always wanted.
          </p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50">
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}