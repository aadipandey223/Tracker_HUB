import { useMemo, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar } from 'lucide-react';
import MoodHabitCorrelation from './MoodHabitCorrelation';
import WeeklyPatternsChart from './WeeklyPatternsChart';

function YearlyStats({ habitLogs, habits, mentalState, currentMonth }) {
  const yearlyData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();

    return months.map((month, index) => {
      const monthKey = `${currentYear}-${String(index + 1).padStart(2, '0')}`;
      const daysInMonth = new Date(currentYear, index + 1, 0).getDate();

      // Filter habits active in this month
      const activeHabitsInMonth = habits.filter(h => {
        if (!h.active_months) return true; // Legacy habits are active everywhere
        return h.active_months.includes(monthKey);
      });

      let totalDaysCompleted = 0;
      let fullyCompletedHabits = 0;

      activeHabitsInMonth.forEach(habit => {
        let habitCompletions = 0;
        // Count completions for this specific habit in this month
        // We need to check all days in the month
        for (let day = 1; day <= daysInMonth; day++) {
          const date = `${currentYear}-${String(index + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          if (habitLogs[date]?.[habit.id]?.completed) {
            habitCompletions++;
          }
        }

        totalDaysCompleted += habitCompletions;
        if (habitCompletions === daysInMonth) {
          fullyCompletedHabits++;
        }
      });

      const totalPossible = activeHabitsInMonth.length * daysInMonth;
      const progress = totalPossible > 0 ? (totalDaysCompleted / totalPossible) * 100 : 0;

      return {
        month,
        completed: fullyCompletedHabits,
        progress: progress.toFixed(2),
        habits: activeHabitsInMonth.length
      };
    });
  }, [habitLogs, habits]);

  return (
    <div className="space-y-6">
      {/* Yearly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            Yearly Progress Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={yearlyData}>
              <defs>
                <linearGradient id="colorYearly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'progress') return [`${value}%`, 'Progress'];
                  return [value, name];
                }}
              />
              <Area
                type="monotone"
                dataKey="progress"
                stroke="#ff6b35"
                fillOpacity={1}
                fill="url(#colorYearly)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {yearlyData.map((monthData, index) => (
          <Card
            key={index}
            className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                {monthData.month}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Habits:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{monthData.habits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                <span className="font-semibold text-green-600">{monthData.completed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress:</span>
                <span className={`font-semibold ${parseFloat(monthData.progress) >= 80 ? 'text-green-600' :
                  parseFloat(monthData.progress) >= 50 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                  {monthData.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full ${parseFloat(monthData.progress) >= 80 ? 'bg-green-600' :
                    parseFloat(monthData.progress) >= 50 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}
                  style={{ width: `${Math.min(monthData.progress, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <MoodHabitCorrelation
          habitLogs={habitLogs}
          habits={habits}
          mentalState={mentalState}
          currentMonth={currentMonth}
        />
        <WeeklyPatternsChart
          mentalState={mentalState}
          habitLogs={habitLogs}
          habits={habits}
        />
      </div>
    </div>
  );
}

export default memo(YearlyStats);
