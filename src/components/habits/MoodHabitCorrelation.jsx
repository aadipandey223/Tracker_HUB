import { useMemo, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

function MoodHabitCorrelation({ habitLogs, habits, mentalState, currentMonth }) {
  const correlationData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const data = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Calculate habit completion rate for this day
      let completedCount = 0;
      const totalHabits = habits.length;
      let completionRate = null;

      if (totalHabits > 0 && habitLogs[date]) {
        Object.entries(habitLogs[date]).forEach(([habitId, log]) => {
          // Check if habit still exists
          if (habits.some(h => h.id === habitId) && log.completed) {
            completedCount++;
          }
        });
        completionRate = (completedCount / totalHabits) * 100;
      }

      // Get mood and motivation for this day
      const dayMood = mentalState[date]?.mood || null;
      const dayMotivation = mentalState[date]?.motivation || null;

      // Only add data points if we have at least one value
      if (completionRate !== null || dayMood !== null || dayMotivation !== null) {
        data.push({
          day: day,
          completionRate: completionRate !== null ? completionRate.toFixed(1) : null,
          mood: dayMood,
          motivation: dayMotivation,
          date: date
        });
      }
    }

    return data;
  }, [habitLogs, habits, mentalState, currentMonth]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Day {payload[0].payload.day}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.name === 'Completion Rate' ? '%' : '/10'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          Mood vs Habit Correlation
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Discover the relationship between your mood and habit completion
        </p>
      </CardHeader>
      <CardContent>
        {correlationData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No data available for this month</p>
            <p className="text-sm mt-1">Complete habits and track your mood to see correlations</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={correlationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="day" 
                label={{ value: 'Day of Month', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                yAxisId="left"
                domain={[0, 100]}
                label={{ value: 'Habit Completion %', angle: -90, position: 'insideLeft' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[0, 10]}
                label={{ value: 'Mood/Motivation (1-10)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="completionRate"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                name="Completion Rate"
                connectNulls
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="mood"
                stroke="#ec4899"
                strokeWidth={2}
                dot={{ fill: '#ec4899', r: 4 }}
                name="Mood"
                connectNulls
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="motivation"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
                name="Motivation"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default memo(MoodHabitCorrelation);
