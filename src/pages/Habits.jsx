import { useState, useMemo } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { base44 } from '@/api/base44Client.supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  TrendingUp,
  Target,
  Calendar as CalendarIcon,
  Copy,
  X,
  CheckSquare
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import HabitCalendar from '@/components/habits/HabitCalendar';
import MentalStateTracker from '@/components/habits/MentalStateTracker';
import ProgressChart from '@/components/habits/ProgressChart';
import YearlyStats from '@/components/habits/YearlyStats';

export default function Habits() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showYearly, setShowYearly] = useState(false);

  // Dialog State
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [habitToDelete, setHabitToDelete] = useState(null);

  const [availableHabitsToCopy, setAvailableHabitsToCopy] = useState([]);
  const [selectedHabitsToCopy, setSelectedHabitsToCopy] = useState(new Set());

  const monthName = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const currentMonthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;

  // Fetch Data
  const { data: habits = [] } = useQuery({
    queryKey: ['habits'],
    queryFn: () => base44.entities.Habit.list(),
  });

  // Calculate date range for fetching logs
  const dateRange = useMemo(() => {
    const year = currentMonth.getFullYear();
    if (showYearly) {
      return {
        start: `${year}-01-01`,
        end: `${year}-12-31`
      };
    }
    const month = currentMonth.getMonth() + 1;
    // Fetch previous, current, and next month to ensure smooth navigation
    // Actually, for simplicity and performance, let's just fetch the current year if not too heavy, 
    // or strictly the current month. Let's do current month +/- 1 month buffer? 
    // For now, let's just fetch the current year to support the yearly view toggle without re-fetching if possible,
    // or just fetch based on view.
    // Let's stick to: if showYearly, fetch year. If not, fetch current month.
    const startStr = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endStr = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
    return { start: startStr, end: endStr };
  }, [currentMonth, showYearly]);

  const { data: logsList = [] } = useQuery({
    queryKey: ['habitLogs', showYearly ? currentMonth.getFullYear() : currentMonthKey],
    queryFn: () => base44.entities.HabitLog.select({
      buildQuery: (q) => q.gte('date', dateRange.start).lte('date', dateRange.end)
    }),
    keepPreviousData: true, // Keep data while fetching new month
  });

  const { data: mentalStatesList = [] } = useQuery({
    queryKey: ['mentalStates'],
    queryFn: () => base44.entities.MentalState.list(),
  });

  // Transform logs list to map: { date: { habitId: { completed, timestamp } } }
  const habitLogs = useMemo(() => {
    const logs = {};
    logsList.forEach(log => {
      if (!logs[log.date]) logs[log.date] = {};
      logs[log.date][log.habit_id] = {
        completed: log.completed,
        timestamp: log.timestamp,
        id: log.id // Keep ID for updates
      };
    });
    return logs;
  }, [logsList]);

  // Transform mental states list to map: { date: { mood, notes, ... } }
  const mentalState = useMemo(() => {
    const states = {};
    mentalStatesList.forEach(state => {
      states[state.date] = state;
    });
    return states;
  }, [mentalStatesList]);

  const navigateMonth = (direction) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
  };

  // Filter habits active in current month
  const currentMonthHabits = useMemo(() => {
    return habits.filter(habit => {
      // If active_months is missing (legacy data), assume active for all months
      if (!habit.active_months) return true;
      return habit.active_months.includes(currentMonthKey);
    });
  }, [habits, currentMonthKey]);

  // Calculate monthly stats
  const monthlyStats = useMemo(() => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const today = new Date();
    const todayDateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    let todaysCompletedHabits = 0;

    let totalDaysCompleted = 0;
    let fullyCompletedHabits = 0;

    currentMonthHabits.forEach(habit => {
      let habitCompletions = 0;
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        if (habitLogs[date]?.[habit.id]?.completed) {
          habitCompletions++;
        }
      }

      // Check if completed today
      if (habitLogs[todayDateKey]?.[habit.id]?.completed) {
        todaysCompletedHabits++;
      }

      totalDaysCompleted += habitCompletions;
      if (habitCompletions === daysInMonth) {
        fullyCompletedHabits++;
      }
    });

    const totalPossible = currentMonthHabits.length * daysInMonth;
    const progressPercent = totalPossible > 0 ? (totalDaysCompleted / totalPossible) * 100 : 0;

    return {
      totalHabits: currentMonthHabits.length,
      totalCompleted: totalDaysCompleted,
      fullyCompletedHabits: fullyCompletedHabits,
      todaysCompletedHabits: todaysCompletedHabits,
      progressPercent: progressPercent.toFixed(2),
    };
  }, [currentMonthHabits, habitLogs, currentMonthKey, currentMonth]);

  const handleAddHabit = () => {
    setNewHabitName('');
    setIsAddHabitOpen(true);
  };

  const confirmAddHabit = async () => {
    if (!newHabitName.trim()) return;

    try {
      await base44.entities.Habit.create({
        name: newHabitName.trim(),
        icon: '✓',
        target_value: 30,
        unit: 'days',
        frequency: 'daily',
        color: '#ff6b35',
        active_months: [currentMonthKey]
      });
      queryClient.invalidateQueries(['habits']);
      setIsAddHabitOpen(false);
    } catch (error) {
      console.error('Error creating habit:', error);
      // We can use toast here if we want, but for now console error is fine or we can add toast later
    }
  };

  const handleDeleteHabitClick = (id) => {
    setHabitToDelete(id);
  };

  const confirmDeleteHabit = async () => {
    if (!habitToDelete) return;

    try {
      // Delete associated logs first
      await base44.entities.HabitLog.deleteBy('habit_id', habitToDelete);
      // Then delete the habit
      await base44.entities.Habit.delete(habitToDelete);
      queryClient.invalidateQueries(['habits']);
      queryClient.invalidateQueries(['habitLogs']);
      setHabitToDelete(null);
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const initCopyHabits = () => {
    // Find habits from previous month that aren't in current month
    const prevDate = new Date(currentMonth);
    prevDate.setMonth(prevDate.getMonth() - 1);
    const prevMonthKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    const habitsToCopy = habits.filter(h => {
      const activeInPrev = !h.active_months || h.active_months.includes(prevMonthKey);
      const notActiveInCurrent = h.active_months && !h.active_months.includes(currentMonthKey);
      return activeInPrev && notActiveInCurrent;
    });

    if (habitsToCopy.length === 0) {
      alert('No habits found from previous month to copy.');
      return;
    }

    setAvailableHabitsToCopy(habitsToCopy);
    setSelectedHabitsToCopy(new Set(habitsToCopy.map(h => h.id)));
    setIsCopyDialogOpen(true);
  };

  const toggleHabitSelection = (id) => {
    const newSelection = new Set(selectedHabitsToCopy);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedHabitsToCopy(newSelection);
  };

  const confirmCopyHabits = async () => {
    try {
      const promises = Array.from(selectedHabitsToCopy).map(async (habitId) => {
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
          const currentActiveMonths = habit.active_months || [];
          // Add current month if not already present
          if (!currentActiveMonths.includes(currentMonthKey)) {
            await base44.entities.Habit.update(habitId, {
              active_months: [...currentActiveMonths, currentMonthKey]
            });
          }
        }
      });

      await Promise.all(promises);
      queryClient.invalidateQueries(['habits']);
      setIsCopyDialogOpen(false);
    } catch (error) {
      console.error('Error copying habits:', error);
      alert('Failed to copy habits: ' + error.message);
    }
  };

  const toggleHabitMutation = useMutation({
    mutationFn: async ({ habitId, date, currentCompleted, existingLogId }) => {
      if (existingLogId) {
        return base44.entities.HabitLog.update(existingLogId, {
          completed: !currentCompleted
        });
      } else {
        return base44.entities.HabitLog.create({
          date,
          habit_id: habitId,
          completed: true
        });
      }
    },
    onMutate: async ({ habitId, date, currentCompleted }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['habitLogs'] });

      // Snapshot the previous value
      const previousLogs = queryClient.getQueryData(['habitLogs', showYearly ? currentMonth.getFullYear() : currentMonthKey]);

      // Optimistically update to the new value
      queryClient.setQueryData(['habitLogs', showYearly ? currentMonth.getFullYear() : currentMonthKey], (old = []) => {
        const existingIndex = old.findIndex(l => l.habit_id === habitId && l.date === date);

        if (existingIndex !== -1) {
          // Update existing log
          const newLogs = [...old];
          newLogs[existingIndex] = { ...newLogs[existingIndex], completed: !currentCompleted };
          return newLogs;
        } else {
          // Add new log (optimistic ID)
          return [...old, {
            habit_id: habitId,
            date,
            completed: true,
            id: 'temp-' + Date.now()
          }];
        }
      });

      // Return a context object with the snapshotted value
      return { previousLogs };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['habitLogs', showYearly ? currentMonth.getFullYear() : currentMonthKey], context.previousLogs);
      alert('Failed to update habit: ' + err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habitLogs'] });
    },
  });

  const handleToggleHabit = (habitId, date) => {
    const existingLog = habitLogs[date]?.[habitId];
    toggleHabitMutation.mutate({
      habitId,
      date,
      currentCompleted: existingLog?.completed || false,
      existingLogId: existingLog?.id
    });
  };

  const handleUpdateMentalState = async (newState) => {
    const date = newState.date;
    const existingState = mentalState[date];

    try {
      if (existingState && existingState.id) {
        await base44.entities.MentalState.update(existingState.id, newState);
      } else {
        await base44.entities.MentalState.create(newState);
      }
      queryClient.invalidateQueries(['mentalStates']);
    } catch (error) {
      console.error('Error updating mental state:', error);
      alert('Failed to save mental state: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {isCopyDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('habits.addHabit')}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsCopyDialogOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-sm text-gray-500 mb-4">
                Select habits to copy from last month to {monthName}:
              </p>
              <div className="max-h-[300px] overflow-y-auto space-y-2 mb-6">
                {availableHabitsToCopy.map(habit => (
                  <div
                    key={habit.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => toggleHabitSelection(habit.id)}
                  >
                    <div className={`
                      w-5 h-5 rounded border flex items-center justify-center transition-colors
                      ${selectedHabitsToCopy.has(habit.id)
                        ? 'bg-orange-600 border-orange-600 text-white'
                        : 'border-gray-300 dark:border-gray-600'}
                    `}>
                      {selectedHabitsToCopy.has(habit.id) && <CheckSquare className="w-3 h-3" />}
                    </div>
                    <span className="font-medium">{habit.name}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCopyDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={confirmCopyHabits}
                  disabled={selectedHabitsToCopy.size === 0}
                >
                  Copy {selectedHabitsToCopy.size} Habits
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 habits-page">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {t('habits.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('habits.subtitle')}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant={showYearly ? 'default' : 'outline'}
              onClick={() => setShowYearly(!showYearly)}
              className="gap-2"
            >
              <CalendarIcon className="w-4 h-4" />
              {showYearly ? t('common.month') + 'ly View' : 'Yearly Stats'}
            </Button>
            <Button id="add-habit-btn" className="gap-2 bg-orange-600 hover:bg-orange-700" onClick={handleAddHabit}>
              <Plus className="w-4 h-4" />
              {t('habits.addHabit')}
            </Button>
          </div>
        </div>

        {showYearly ? (
          <YearlyStats
            habitLogs={habitLogs}
            habits={habits}
            mentalState={mentalState}
            currentMonth={currentMonth}
          />
        ) : (
          <>
            {/* Month Navigation & Stats */}
            <div className="mb-8">
              {/* Month Selector */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth(-1)}
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white min-w-[200px] text-center">
                    {monthName}
                  </h2>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth(1)}
                    className="rounded-full"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {/* Copy Button */}
                <Button
                  variant="outline"
                  onClick={initCopyHabits}
                  className="gap-2"
                  title="Copy habits from previous month"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy Last Month</span>
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Number of Habits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold">{monthlyStats.totalHabits}</p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Completed Today
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-bold text-green-600">{monthlyStats.todaysCompletedHabits}</p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-4xl font-bold text-blue-600">{monthlyStats.progressPercent}%</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(monthlyStats.progressPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Habit Tracking Grid */}
            {currentMonthHabits.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Target className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No habits for {monthName}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Start fresh or copy habits from the previous month
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" onClick={initCopyHabits}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Last Month
                    </Button>
                    <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleAddHabit}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Habit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <HabitCalendar
                  habits={currentMonthHabits}
                  currentMonth={currentMonth}
                  habitLogs={habitLogs}
                  onToggleHabit={handleToggleHabit}
                  onDeleteHabit={handleDeleteHabitClick}
                />

                {/* Progress Charts */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ProgressChart
                    habitLogs={habitLogs}
                    habits={currentMonthHabits}
                    currentMonth={currentMonth}
                  />
                  <MentalStateTracker
                    mentalState={mentalState}
                    onUpdateMentalState={handleUpdateMentalState}
                    currentMonth={currentMonth}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Add Habit Dialog */}
      <Dialog open={isAddHabitOpen} onOpenChange={setIsAddHabitOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Read 30 mins"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmAddHabit();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddHabitOpen(false)}>Cancel</Button>
            <Button onClick={confirmAddHabit} className="bg-orange-600 hover:bg-orange-700">Add Habit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!habitToDelete} onOpenChange={(open) => !open && setHabitToDelete(null)}>
        <AlertDialogContent className="bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the habit and all its history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteHabit} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
