import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Target, TrendingDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function HabitAnalysis({ habits, habitLogs }) {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  const thirtyDaysAgo = last30Days.toISOString().split('T')[0];

  const habitStats = habits.map(habit => {
    const habitLogsFiltered = habitLogs.filter(
      log => log.habit_id === habit.id && log.date >= thirtyDaysAgo
    );
    const completed = habitLogsFiltered.filter(log => log.completed).length;
    const total = 30;
    const percentage = (completed / total) * 100;

    return {
      name: habit.name.length > 15 ? habit.name.substring(0, 15) + '...' : habit.name,
      fullName: habit.name,
      completed,
      total,
      percentage: Math.round(percentage),
      color: habit.color || 'orange'
    };
  }).sort((a, b) => a.percentage - b.percentage);

  const colorMap = {
    orange: '#f97316',
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#10b981',
    purple: '#8b5cf6',
    yellow: '#eab308',
    pink: '#ec4899'
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-orange-600" />
          Habit Performance (Last 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={habitStats} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" domain={[0, 100]} stroke="#6b7280" tick={{ fontSize: 12 }} />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={100}
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {payload[0].payload.fullName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Completion: <span className="font-semibold text-orange-600">{payload[0].value}%</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {payload[0].payload.completed}/{payload[0].payload.total} days
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar 
              dataKey="percentage" 
              fill="#f97316"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Habits Needing Attention */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            Needs Attention
          </h4>
          {habitStats.filter(h => h.percentage < 50).length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
              Great job! All habits are on track 🎉
            </p>
          ) : (
            habitStats.filter(h => h.percentage < 50).map((habit, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{habit.fullName}</span>
                  <span className="text-sm font-semibold text-red-600">{habit.percentage}%</span>
                </div>
                <Progress value={habit.percentage} className="h-2" />
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}