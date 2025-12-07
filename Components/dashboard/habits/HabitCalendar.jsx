import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HabitCalendar({ habits, habitLogs, selectedDate, onDateChange }) {
  const currentDate = new Date(selectedDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const previousMonth = () => {
    const newDate = new Date(year, month - 1, 1);
    onDateChange(newDate.toISOString().split('T')[0]);
  };

  const nextMonth = () => {
    const newDate = new Date(year, month + 1, 1);
    onDateChange(newDate.toISOString().split('T')[0]);
  };

  const getDateCompletion = (day) => {
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    const dayLogs = habitLogs.filter(log => log.date === dateStr);
    const completed = dayLogs.filter(log => log.completed).length;
    return {
      total: habits.length,
      completed,
      percentage: habits.length > 0 ? (completed / habits.length) * 100 : 0
    };
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const completion = getDateCompletion(day);
    const isToday = day === new Date().getDate() && 
                    month === new Date().getMonth() && 
                    year === new Date().getFullYear();
    
    days.push(
      <div
        key={day}
        className={`aspect-square p-2 rounded-lg border transition-all cursor-pointer ${
          isToday 
            ? 'border-orange-500 dark:border-orange-600 ring-2 ring-orange-200 dark:ring-orange-900' 
            : 'border-gray-200 dark:border-gray-700'
        } ${
          completion.percentage >= 100 
            ? 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/40'
            : completion.percentage > 0
            ? 'bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
            : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
        onClick={() => {
          const newDate = new Date(year, month, day);
          onDateChange(newDate.toISOString().split('T')[0]);
        }}
      >
        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{day}</div>
        <div className="flex items-center justify-center">
          {completion.percentage >= 100 ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : completion.percentage > 0 ? (
            <Circle className="w-5 h-5 text-yellow-600" />
          ) : (
            <XCircle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
          )}
        </div>
        <div className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
          {completion.completed}/{completion.total}
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{monthNames[month]} {year}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">All Complete</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-gray-300" />
            <span className="text-sm text-gray-600 dark:text-gray-400">None</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}