
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Star, CheckCircle } from 'lucide-react';

export default function WeeklySummaryCard({ tasks = [], habitLogs = [] }) {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const startStr = startOfWeek.toISOString().split('T')[0];
  const endStr = endOfWeek.toISOString().split('T')[0];
  
  const weekTasks = tasks.filter(task => 
    task.due_date >= startStr && task.due_date <= endStr
  );
  
  const weekHabitLogs = habitLogs.filter(log => 
    log.date >= startStr && log.date <= endStr
  );
  
  const completedTasks = weekTasks.filter(t => t.status === 'Done').length;
  const completedHabits = weekHabitLogs.filter(h => h.completed).length;
  const totalHabits = weekHabitLogs.length;
  
  const weekProgress = weekTasks.length > 0 
    ? (completedTasks / weekTasks.length) * 100 
    : 0;
  
  const habitProgress = totalHabits > 0 
    ? (completedHabits / totalHabits) * 100 
    : 0;

  // Calculate daily breakdown
  const dailyData = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayTasks = weekTasks.filter(t => t.due_date === dateStr);
    const dayHabits = weekHabitLogs.filter(h => h.date === dateStr);
    const completedDayTasks = dayTasks.filter(t => t.status === 'Done').length;
    const completedDayHabits = dayHabits.filter(h => h.completed).length;
    
    dailyData.push({
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
      tasks: completedDayTasks,
      habits: completedDayHabits,
      total: completedDayTasks + completedDayHabits,
      isToday: dateStr === today.toISOString().split('T')[0]
    });
  }

  const maxTotal = Math.max(...dailyData.map(d => d.total), 1);

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            Weekly Planner
          </span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">This Week</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Week Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Tasks</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {completedTasks}/{weekTasks.length}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {weekProgress.toFixed(0)}% complete
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-indigo-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Habits</span>
            </div>
            <p className="text-2xl font-bold text-indigo-600">
              {completedHabits}/{totalHabits}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {habitProgress.toFixed(0)}% complete
            </p>
          </div>
        </div>

        {/* Daily Breakdown Chart */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Daily Activity</h4>
          <div className="flex items-end justify-between gap-2 h-32">
            {dailyData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex-1 w-full flex items-end justify-center">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      day.isToday 
                        ? 'bg-gradient-to-t from-purple-500 to-purple-600' 
                        : 'bg-gradient-to-t from-purple-300 to-purple-400 dark:from-purple-700 dark:to-purple-600'
                    }`}
                    style={{ 
                      height: `${(day.total / maxTotal) * 100}%`,
                      minHeight: day.total > 0 ? '20%' : '0%'
                    }}
                  >
                    {day.total > 0 && (
                      <div className="text-center text-xs font-semibold text-white pt-1">
                        {day.total}
                      </div>
                    )}
                  </div>
                </div>
                <span className={`text-xs ${
                  day.isToday 
                    ? 'font-bold text-purple-600' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Week Summary */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xl font-bold text-purple-600">{completedTasks + completedHabits}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
            </div>
            <div className="text-center border-x border-gray-200 dark:border-gray-700">
              <p className="text-xl font-bold text-indigo-600">
                {Math.round((weekProgress + habitProgress) / 2)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Avg Progress</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">
                {dailyData.filter(d => d.total > 0).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Active Days</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}