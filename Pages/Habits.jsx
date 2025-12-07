import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client.supabase';
import HabitCheckList from '../Components/dashboard/habits/HabitCheckList';
import HabitCalendar from '../Components/dashboard/habits/HabitCalendar';
import ProgressChart from '../Components/dashboard/habits/ProgressChart';
import MentalStateTracker from '../Components/dashboard/habits/MentalStateTracker';
import HabitAnalysis from '../Components/dashboard/habits/HabitAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Habits() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const queryClient = useQueryClient();

  const { data: habits = [], isLoading: habitsLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: () => base44.entities.Habit.list(),
  });

  const { data: habitLogs = [], isLoading: logsLoading } = useQuery({
    queryKey: ['habitLogs'],
    queryFn: () => base44.entities.HabitLog.list('-date', 1000),
  });

  const createLogMutation = useMutation({
    mutationFn: (logData) => base44.entities.HabitLog.create(logData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habitLogs'] });
    },
  });

  const updateLogMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.HabitLog.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habitLogs'] });
    },
  });

  const handleToggleHabit = (habitId, completed) => {
    const existingLog = habitLogs.find(
      log => log.habit_id === habitId && log.date === selectedDate
    );

    if (existingLog) {
      updateLogMutation.mutate({
        id: existingLog.id,
        data: { ...existingLog, completed }
      });
    } else {
      createLogMutation.mutate({
        habit_id: habitId,
        date: selectedDate,
        completed,
        actual_value: completed ? 1 : 0
      });
    }
  };

  const handleUpdateMentalState = (mood, motivation) => {
    const todayLogs = habitLogs.filter(log => log.date === selectedDate);
    
    todayLogs.forEach(log => {
      updateLogMutation.mutate({
        id: log.id,
        data: { ...log, mood, motivation }
      });
    });
  };

  const currentMonthLogs = habitLogs.filter(log => {
    const logDate = new Date(log.date);
    const currentDate = new Date(selectedDate);
    return logDate.getMonth() === currentDate.getMonth() &&
           logDate.getFullYear() === currentDate.getFullYear();
  });

  const todayLogs = habitLogs.filter(log => log.date === selectedDate);
  const completedToday = todayLogs.filter(log => log.completed).length;
  const progressPercentage = habits.length > 0 ? (completedToday / habits.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Habit Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Build better habits, track your progress, and monitor your mental well-being
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Today's Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-1">{completedToday}/{habits.length}</div>
              <p className="text-sm opacity-90">{progressPercentage.toFixed(0)}% completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 inline mr-2" />
                This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">
                {currentMonthLogs.filter(l => l.completed).length}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">habits completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                <Target className="w-4 h-4 inline mr-2" />
                Active Habits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">{habits.length}</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">total habits</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="daily" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="daily">Daily View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Daily View */}
          <TabsContent value="daily" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <HabitCheckList
                  habits={habits}
                  habitLogs={todayLogs}
                  selectedDate={selectedDate}
                  onToggle={handleToggleHabit}
                  onDateChange={setSelectedDate}
                />
              </div>
              <div className="space-y-6">
                <MentalStateTracker
                  habitLogs={todayLogs}
                  onUpdate={handleUpdateMentalState}
                />
                <ProgressChart habitLogs={habitLogs} habits={habits} />
              </div>
            </div>
          </TabsContent>

          {/* Calendar View */}
          <TabsContent value="calendar" className="space-y-6">
            <HabitCalendar
              habits={habits}
              habitLogs={habitLogs}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </TabsContent>

          {/* Analytics View */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProgressChart habitLogs={habitLogs} habits={habits} detailed />
              <HabitAnalysis habits={habits} habitLogs={habitLogs} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}