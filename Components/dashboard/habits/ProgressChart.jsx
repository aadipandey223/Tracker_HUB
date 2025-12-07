import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

export default function ProgressChart({ habitLogs, habits, detailed = false }) {
  const getLast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const last30Days = getLast30Days();
  
  const chartData = last30Days.map(date => {
    const dayLogs = habitLogs.filter(log => log.date === date);
    const completed = dayLogs.filter(log => log.completed).length;
    const percentage = habits.length > 0 ? (completed / habits.length) * 100 : 0;
    
    const avgMood = dayLogs.length > 0 
      ? dayLogs.reduce((sum, log) => sum + (log.mood || 0), 0) / dayLogs.length 
      : 0;
    
    const avgMotivation = dayLogs.length > 0
      ? dayLogs.reduce((sum, log) => sum + (log.motivation || 0), 0) / dayLogs.length
      : 0;

    return {
      date: new Date(date).getDate(),
      percentage: Math.round(percentage),
      completed,
      total: habits.length,
      mood: avgMood.toFixed(1),
      motivation: avgMotivation.toFixed(1),
      fullDate: date
    };
  });

  const avgCompletion = chartData.reduce((sum, d) => sum + d.percentage, 0) / chartData.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            {detailed ? '30-Day Progress' : 'Progress Trend'}
          </span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Avg: {avgCompletion.toFixed(0)}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={detailed ? 300 : 200}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPercentage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              domain={[0, 100]}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Day {payload[0].payload.date}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Completion: <span className="font-semibold text-orange-600">{payload[0].value}%</span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {payload[0].payload.completed}/{payload[0].payload.total} habits
                      </p>
                      {detailed && payload[0].payload.mood > 0 && (
                        <>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            Mood: {payload[0].payload.mood}/10
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Motivation: {payload[0].payload.motivation}/10
                          </p>
                        </>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="percentage"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#colorPercentage)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}