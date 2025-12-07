import { useMemo, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

function ProgressChart({ habitLogs, habits, currentMonth }) {
  const chartData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Always show full month
    const lastDay = daysInMonth;

    const data = [];
    for (let day = 1; day <= lastDay; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const logs = habitLogs[date] || {};

      // Filter logs to only include existing habits
      const completedCount = Object.keys(logs).filter(habitId => {
        const isCompleted = logs[habitId].completed;
        const isValidHabit = habits.some(h => h.id === habitId);
        return isCompleted && isValidHabit;
      }).length;

      // Only calculate completion if there are habits
      const completionRate = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

      data.push({
        day,
        completion: parseFloat(completionRate.toFixed(1))
      });
    }

    return data;
  }, [habitLogs, habits, currentMonth]);

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Progress Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              label={{ value: 'Day of Month', position: 'insideBottom', offset: -5 }}
              ticks={chartData.length <= 31 ? chartData.map(d => d.day).filter((_, i) => i % Math.ceil(chartData.length / 10) === 0) : undefined}
              interval="preserveStartEnd"
            />
            <YAxis
              label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Completion']}
              labelFormatter={(label) => `Day ${label}`}
            />
            <Area
              type="monotone"
              dataKey="completion"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorCompletion)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default memo(ProgressChart);
