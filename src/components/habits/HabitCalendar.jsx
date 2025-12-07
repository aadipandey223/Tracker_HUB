import { useMemo, memo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2 } from 'lucide-react';

function HabitCalendar({ habits, currentMonth, habitLogs, onToggleHabit, onDeleteHabit }) {
  const scrollContainerRef = useRef(null);
  const todayRef = useRef(null);

  // Get today's date string
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Check if current month matches today's month
  const isCurrentMonth = currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() === today.getMonth();

  // Auto-scroll to today's date when component mounts or month changes
  useEffect(() => {
    if (isCurrentMonth && todayRef.current && scrollContainerRef.current) {
      // Small delay to ensure DOM is rendered
      const timeoutId = setTimeout(() => {
        const container = scrollContainerRef.current;
        const todayElement = todayRef.current;

        if (container && todayElement) {
          // Calculate scroll position to center today's date
          const containerRect = container.getBoundingClientRect();
          const todayRect = todayElement.getBoundingClientRect();
          const scrollLeft = todayElement.offsetLeft - (containerRect.width / 2) + (todayRect.width / 2);

          container.scrollTo({
            left: Math.max(0, scrollLeft - 200), // Offset by habit name column width
            behavior: 'smooth'
          });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isCurrentMonth, currentMonth]);

  // Generate calendar structure
  const calendarData = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Group days into weeks
    const weeks = [];
    let currentWeek = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dayOfWeek = dateObj.getDay(); // 0 = Sunday

      // Create local YYYY-MM-DD string
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      currentWeek.push({
        day,
        dayOfWeek,
        date,
        dayName: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][dayOfWeek]
      });

      // Start new week on Sunday (or when week is full)
      if (dayOfWeek === 6 || day === daysInMonth) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    return weeks;
  }, [currentMonth]);

  // Calculate habit progress
  const habitProgress = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

    const progress = {};
    habits.forEach(habit => {
      let completed = 0;
      Object.entries(habitLogs).forEach(([date, logs]) => {
        // Only count logs for the current month
        if (date.startsWith(monthKey) && logs[habit.id]?.completed) {
          completed++;
        }
      });

      // Goal is the number of days in the month
      const goal = daysInMonth;

      progress[habit.id] = {
        completed,
        goal,
        percent: goal > 0 ? (completed / goal) * 100 : 0
      };
    });
    return progress;
  }, [habits, habitLogs, currentMonth]);

  const getProgressColor = (percent) => {
    if (percent >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900';
    if (percent >= 50) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
    return 'text-red-600 bg-red-100 dark:bg-red-900';
  };

  return (
    <Card className="overflow-x-auto calendar-grid">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>My Habits</span>
          {isCurrentMonth && (
            <span className="text-sm font-normal text-sky-500 dark:text-sky-400 animate-breathe">
              📍 Today: {today.getDate()}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={scrollContainerRef} className="overflow-x-auto scroll-smooth">
          <div className="min-w-max">
            {/* Header Row */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <div className="w-48 p-3 font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-gray-800 z-10">
                Habit
              </div>
              {calendarData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex">
                  {week.map(({ day, dayName, date }) => {
                    const isToday = date === todayStr;
                    return (
                      <div
                        key={day}
                        ref={isToday ? todayRef : null}
                        className={`w-12 p-2 text-center border-l border-gray-200 dark:border-gray-700 ${isToday ? 'bg-sky-100 dark:bg-sky-900/30 animate-breathe' : ''
                          }`}
                      >
                        <div className={`text-xs font-medium ${isToday ? 'text-sky-600 dark:text-sky-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          {dayName}
                        </div>
                        <div className={`text-sm font-semibold ${isToday ? 'text-sky-700 dark:text-sky-300' : 'text-gray-900 dark:text-white'}`}>
                          {day}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className="flex-1 min-w-[200px] p-3 border-l border-gray-200 dark:border-gray-700">
                <div className="text-center font-semibold text-base text-gray-700 dark:text-gray-300">Analysis</div>
                <div className="flex justify-around text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                  <span>Goal</span>
                  <span>Actual</span>
                  <span>Progress</span>
                </div>
              </div>
              <div className="w-16"></div>
            </div>

            {/* Habit Rows */}
            {habits.map((habit) => (
              <div key={habit.id} className="flex border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div className="w-48 p-3 flex items-center gap-2 sticky left-0 bg-white dark:bg-gray-800 z-10">
                  <span className="text-xl">{habit.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{habit.name}</span>
                </div>

                {/* Week Checkboxes */}
                {calendarData.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex">
                    {week.map(({ day, date }) => {
                      const isCompleted = habitLogs[date]?.[habit.id]?.completed;
                      const currentDate = new Date(date);
                      const isToday = date === todayStr;
                      const isPastDate = currentDate < today && !isToday;

                      return (
                        <div
                          key={day}
                          className={`w-12 p-2 flex items-center justify-center border-l border-gray-200 dark:border-gray-700 cursor-pointer transition-colors ${isToday
                            ? 'bg-sky-100 dark:bg-sky-900/30 animate-breathe'
                            : ''
                            }`}
                          onClick={() => onToggleHabit(habit.id, date)}
                        >
                          {isCompleted ? (
                            <div className="w-6 h-6 rounded bg-green-500 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          ) : isPastDate ? (
                            <div className="w-6 h-6 rounded bg-red-100 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 hover:border-green-500 transition" />
                          ) : (
                            <div className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-600 hover:border-green-500 transition" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}

                {/* Analysis Column */}
                <div className="flex-1 min-w-[200px] p-3 border-l border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-around text-base">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{habitProgress[habit.id]?.goal || 0}</span>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">{habitProgress[habit.id]?.completed || 0}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${getProgressColor(habitProgress[habit.id]?.percent || 0)}`}
                          style={{ width: `${Math.min(habitProgress[habit.id]?.percent || 0, 100)}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold ${getProgressColor(habitProgress[habit.id]?.percent || 0)}`}>
                        {(habitProgress[habit.id]?.percent || 0).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
                <div className="w-16 p-3 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteHabit(habit.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(HabitCalendar);

