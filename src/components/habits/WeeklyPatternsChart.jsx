import { useState, useMemo, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, TrendingUp, Award, AlertCircle } from 'lucide-react';

function WeeklyPatternsChart({ mentalState, habitLogs, habits }) {
  const [timeRange, setTimeRange] = useState('all'); // 'all', '30', '90'
  const [selectedHabit, setSelectedHabit] = useState(null);

  // Reset selected habit if it no longer exists
  const validHabits = habits || [];
  const validSelectedHabit = selectedHabit && validHabits.some(h => h.id === selectedHabit) 
    ? selectedHabit 
    : null;

  // Update selected habit if it became invalid
  if (selectedHabit !== validSelectedHabit) {
    setSelectedHabit(validSelectedHabit);
  }
  const weeklyData = useMemo(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayStats = days.map(() => ({
      moodSum: 0,
      moodCount: 0,
      motivationSum: 0,
      motivationCount: 0,
      completionSum: 0,
      completionCount: 0,
      sampleSize: 0
    }));

    // Calculate cutoff date based on time range
    const now = new Date();
    let cutoffDate = null;
    if (timeRange === '30') {
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (timeRange === '90') {
      cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    }

    // Process mental state data
    Object.entries(mentalState).forEach(([dateStr, state]) => {
      const date = new Date(dateStr);
      if (cutoffDate && date < cutoffDate) return;
      
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

      if (state.mood) {
        dayStats[dayOfWeek].moodSum += state.mood;
        dayStats[dayOfWeek].moodCount++;
      }
      if (state.motivation) {
        dayStats[dayOfWeek].motivationSum += state.motivation;
        dayStats[dayOfWeek].motivationCount++;
      }
    });

    // Process habit completion data
    Object.entries(habitLogs).forEach(([dateStr, logs]) => {
      const date = new Date(dateStr);
      if (cutoffDate && date < cutoffDate) return;
      
      const dayOfWeek = date.getDay();

      let completedCount = 0;
      let totalHabits = habits.length;

      // If a specific habit is selected, only count that habit
      if (validSelectedHabit) {
        // Check if the selected habit still exists
        if (habits.some(h => h.id === validSelectedHabit)) {
          if (logs[validSelectedHabit]?.completed) {
            completedCount = 1;
          }
          totalHabits = 1;
        } else {
          totalHabits = 0; // Habit was deleted
        }
      } else {
        Object.entries(logs).forEach(([habitId, log]) => {
          if (habits.some(h => h.id === habitId) && log.completed) {
            completedCount++;
          }
        });
      }

      if (totalHabits > 0) {
        const completionRate = (completedCount / totalHabits) * 100;
        dayStats[dayOfWeek].completionSum += completionRate;
        dayStats[dayOfWeek].completionCount++;
        dayStats[dayOfWeek].sampleSize++;
      }
    });

    // Calculate averages
    return days.map((day, index) => ({
      day: day.slice(0, 3), // Short name (Mon, Tue, etc.)
      fullDay: day,
      mood: dayStats[index].moodCount > 0 
        ? parseFloat((dayStats[index].moodSum / dayStats[index].moodCount).toFixed(1))
        : 0,
      motivation: dayStats[index].motivationCount > 0
        ? parseFloat((dayStats[index].motivationSum / dayStats[index].motivationCount).toFixed(1))
        : 0,
      completion: dayStats[index].completionCount > 0
        ? parseFloat((dayStats[index].completionSum / dayStats[index].completionCount).toFixed(1))
        : 0,
      sampleSize: dayStats[index].sampleSize,
      moodCount: dayStats[index].moodCount,
      motivationCount: dayStats[index].motivationCount
    }));
  }, [mentalState, habitLogs, habits, timeRange, validSelectedHabit]);

  // Calculate insights: best/worst days and correlation
  const insights = useMemo(() => {
    const daysWithData = weeklyData.filter(d => d.completion > 0 || d.mood > 0 || d.motivation > 0);
    
    if (daysWithData.length === 0) return null;

    // Find best and worst days
    const bestCompletion = daysWithData.reduce((max, d) => d.completion > max.completion ? d : max);
    const worstCompletion = daysWithData.reduce((min, d) => d.completion < min.completion ? d : min);
    const bestMood = daysWithData.reduce((max, d) => d.mood > max.mood ? d : max);
    const worstMood = daysWithData.reduce((min, d) => d.mood < min.mood ? d : min);

    // Calculate mood-habit correlation (Pearson correlation coefficient)
    const validPairs = daysWithData.filter(d => d.mood > 0 && d.completion > 0);
    let correlation = 0;
    
    if (validPairs.length >= 3) {
      const n = validPairs.length;
      const sumMood = validPairs.reduce((sum, d) => sum + d.mood, 0);
      const sumCompletion = validPairs.reduce((sum, d) => sum + d.completion, 0);
      const sumMoodSq = validPairs.reduce((sum, d) => sum + d.mood * d.mood, 0);
      const sumCompletionSq = validPairs.reduce((sum, d) => sum + d.completion * d.completion, 0);
      const sumProduct = validPairs.reduce((sum, d) => sum + d.mood * d.completion, 0);

      const numerator = n * sumProduct - sumMood * sumCompletion;
      const denominator = Math.sqrt((n * sumMoodSq - sumMood * sumMood) * (n * sumCompletionSq - sumCompletion * sumCompletion));
      
      correlation = denominator !== 0 ? numerator / denominator : 0;
    }

    return {
      bestCompletion,
      worstCompletion,
      bestMood,
      worstMood,
      correlation: correlation.toFixed(2),
      correlationStrength: Math.abs(correlation) > 0.7 ? 'Strong' : Math.abs(correlation) > 0.4 ? 'Moderate' : 'Weak'
    };
  }, [weeklyData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            {data.fullDay}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name === 'Habit Completion' ? '%' : '/10'}
            </p>
          ))}
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              📊 Based on {data.sampleSize} day{data.sampleSize !== 1 ? 's' : ''}
            </p>
            {data.moodCount > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                😊 {data.moodCount} mood log{data.moodCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Weekly Patterns Analysis
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {validSelectedHabit 
                ? `Pattern for "${habits.find(h => h.id === validSelectedHabit)?.name || 'Selected Habit'}"` 
                : 'Average mood, motivation, and habit completion by day of the week'}
            </p>
          </div>
          <div className="flex gap-2">
            {/* Time Range Filter */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                size="sm"
                variant={timeRange === 'all' ? 'default' : 'ghost'}
                onClick={() => setTimeRange('all')}
                className="h-7 text-xs"
              >
                All Time
              </Button>
              <Button
                size="sm"
                variant={timeRange === '90' ? 'default' : 'ghost'}
                onClick={() => setTimeRange('90')}
                className="h-7 text-xs"
              >
                90 Days
              </Button>
              <Button
                size="sm"
                variant={timeRange === '30' ? 'default' : 'ghost'}
                onClick={() => setTimeRange('30')}
                className="h-7 text-xs"
              >
                30 Days
              </Button>
            </div>
          </div>
        </div>

        {/* Habit Selector */}
        {validHabits.length > 0 && (
          <div className="mt-3 flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={validSelectedHabit === null ? 'default' : 'outline'}
              onClick={() => setSelectedHabit(null)}
              className="h-7 text-xs"
            >
              All Habits
            </Button>
            {validHabits.map(habit => (
              <Button
                key={habit.id}
                size="sm"
                variant={validSelectedHabit === habit.id ? 'default' : 'outline'}
                onClick={() => setSelectedHabit(habit.id)}
                className="h-7 text-xs"
              >
                {habit.icon} {habit.name}
              </Button>
            ))}
          </div>
        )}

        {/* Insights Section */}
        {insights && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Correlation Score */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-900 dark:text-purple-200">Mood-Habit Correlation</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">{insights.correlation}</p>
              <p className="text-xs text-purple-700 dark:text-purple-300">{insights.correlationStrength} relationship</p>
            </div>

            {/* Best Day */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-900 dark:text-green-200">Peak Day</span>
              </div>
              <p className="text-lg font-bold text-green-600">{insights.bestCompletion.fullDay}</p>
              <p className="text-xs text-green-700 dark:text-green-300">{insights.bestCompletion.completion}% completion</p>
            </div>

            {/* Needs Attention */}
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-medium text-orange-900 dark:text-orange-200">Needs Focus</span>
              </div>
              <p className="text-lg font-bold text-orange-600">{insights.worstCompletion.fullDay}</p>
              <p className="text-xs text-orange-700 dark:text-orange-300">{insights.worstCompletion.completion}% completion</p>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {weeklyData.every(d => d.mood == 0 && d.motivation == 0 && d.completion == 0) ? (
          <div className="text-center py-12 text-gray-500">
            <p>No data available yet</p>
            <p className="text-sm mt-1">Track your habits and mood to see weekly patterns</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis 
                  yAxisId="left"
                  domain={[0, 10]}
                  label={{ value: 'Mood/Motivation (1-10)', angle: -90, position: 'insideLeft' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 100]}
                  label={{ value: 'Completion %', angle: 90, position: 'insideRight' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="mood" 
                  fill="#ec4899" 
                  name="Mood"
                  radius={[8, 8, 0, 0]}
                >
                  {weeklyData.map((entry, index) => (
                    <Cell 
                      key={`cell-mood-${index}`} 
                      fill={insights && entry.fullDay === insights.bestMood.fullDay ? '#10b981' : '#ec4899'}
                      opacity={entry.moodCount === 0 ? 0.3 : 1}
                    />
                  ))}
                </Bar>
                <Bar 
                  yAxisId="left"
                  dataKey="motivation" 
                  fill="#8b5cf6" 
                  name="Motivation"
                  radius={[8, 8, 0, 0]}
                >
                  {weeklyData.map((entry, index) => (
                    <Cell 
                      key={`cell-motivation-${index}`} 
                      opacity={entry.motivationCount === 0 ? 0.3 : 1}
                    />
                  ))}
                </Bar>
                <Bar 
                  yAxisId="right"
                  dataKey="completion" 
                  fill="#10b981" 
                  name="Habit Completion"
                  radius={[8, 8, 0, 0]}
                >
                  {weeklyData.map((entry, index) => (
                    <Cell 
                      key={`cell-completion-${index}`} 
                      fill={
                        insights && entry.fullDay === insights.bestCompletion.fullDay ? '#fbbf24' :
                        insights && entry.fullDay === insights.worstCompletion.fullDay ? '#ef4444' :
                        '#10b981'
                      }
                      opacity={entry.sampleSize === 0 ? 0.3 : entry.sampleSize < 3 ? 0.6 : 1}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Data Quality Note */}
            {weeklyData.some(d => d.sampleSize > 0 && d.sampleSize < 3) && (
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <AlertCircle className="w-3 h-3" />
                <span>Faded bars indicate low sample size (&lt;3 days). Track more days for reliable patterns.</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default memo(WeeklyPatternsChart);
