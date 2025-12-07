
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function HabitSummaryCard({ habitLogs = [], habits = [] }) {
  const today = new Date().toISOString().split('T')[0];
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  
  const todayLogs = habitLogs.filter(log => log.date === today);
  const monthLogs = habitLogs.filter(log => log.date >= startOfMonth);
  
  const completedToday = todayLogs.filter(log => log.completed).length;
  const totalToday = habits.length;
  const completedThisMonth = monthLogs.filter(log => log.completed).length;
  const totalThisMonth = habits.length * new Date().getDate();
  
  const todayProgress = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;
  const monthProgress = totalThisMonth > 0 ? (completedThisMonth / totalThisMonth) * 100 : 0;

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-orange-200 dark:border-orange-900 bg-gradient-to-br from-orange-50 to-white dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600" />
            Habit Tracker
          </span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">Daily Progress</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Today's Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Today</span>
            </div>
            <span className="text-2xl font-bold text-orange-600">
              {completedToday}/{totalToday}
            </span>
          </div>
          <Progress value={todayProgress} className="h-3" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {todayProgress.toFixed(0)}% completed
          </p>
        </div>

        {/* This Month */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>This Month</span>
            </div>
            <span className="text-lg font-semibold text-orange-600">
              {completedThisMonth}/{totalThisMonth}
            </span>
          </div>
          <Progress value={monthProgress} className="h-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {monthProgress.toFixed(1)}% monthly progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{habits.length}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active Habits</p>
          </div>
          <div className="text-center border-x border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-green-600">{completedToday}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Done Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{(monthProgress).toFixed(0)}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Month Rate</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}