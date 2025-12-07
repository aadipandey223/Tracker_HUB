import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

export default function HabitCheckList({ habits, habitLogs, selectedDate, onToggle, onDateChange }) {
  const completedCount = habitLogs.filter(log => log.completed).length;
  const progress = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  const isHabitCompleted = (habitId) => {
    const log = habitLogs.find(log => log.habit_id === habitId);
    return log?.completed || false;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-orange-600" />
            Daily Habits
          </CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="w-4 h-4" />
                {format(new Date(selectedDate), 'MMM d, yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(selectedDate)}
                onSelect={(date) => date && onDateChange(date.toISOString().split('T')[0])}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>{completedCount}/{habits.length}</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {habits.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Circle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No habits yet. Create your first habit to get started!</p>
          </div>
        ) : (
          habits.map((habit) => {
            const isCompleted = isHabitCompleted(habit.id);
            return (
              <div
                key={habit.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                  isCompleted
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700'
                }`}
              >
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={(checked) => onToggle(habit.id, checked)}
                  className="w-6 h-6"
                />
                <div className="flex-1">
                  <h3 className={`font-semibold ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                    {habit.name}
                  </h3>
                  {habit.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{habit.description}</p>
                  )}
                  {habit.target_value && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Goal: {habit.target_value} {habit.unit}
                    </p>
                  )}
                </div>
                {isCompleted && (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}