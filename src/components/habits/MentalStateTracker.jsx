import { useState, useMemo, memo, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smile, Zap } from 'lucide-react';

function MentalStateTracker({ mentalState, onUpdateMentalState, currentMonth }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState(5);
  const [motivation, setMotivation] = useState(5);

  // Sync state with props when selectedDate or mentalState changes
  useEffect(() => {
    const stateForDate = mentalState[selectedDate];
    if (stateForDate) {
      setMood(stateForDate.mood || 5);
      setMotivation(stateForDate.motivation || 5);
    } else {
      setMood(5);
      setMotivation(5);
    }
  }, [selectedDate, mentalState]);

  // Calculate max date (today)
  const maxDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const handleSave = () => {
    onUpdateMentalState({
      date: selectedDate,
      mood,
      motivation
    });
    toast.success('Mental state saved!', {
      description: 'Your mood and motivation have been recorded.',
    });
  };

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smile className="w-5 h-5 text-pink-500" />
          Mental State Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            max={maxDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Mood Rating */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Smile className="w-4 h-4 text-pink-500" />
              Mood
            </label>
            <span className="text-2xl font-bold text-pink-600">{mood}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={(e) => setMood(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>😢 Poor</span>
            <span>😊 Excellent</span>
          </div>
        </div>

        {/* Motivation Rating */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" />
              Motivation
            </label>
            <span className="text-2xl font-bold text-purple-600">{motivation}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={motivation}
            onChange={(e) => setMotivation(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>⚡ Low</span>
            <span>🔥 High</span>
          </div>
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
        >
          Save Mental State
        </Button>

        {/* Stats Summary */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">This Month Average:</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
              <div className="text-xs text-gray-600 dark:text-gray-400">Mood</div>
              <div className="text-2xl font-bold text-pink-600">
                {(() => {
                  const currentMonthPrefix = currentMonth.toISOString().slice(0, 7); // YYYY-MM
                  const monthEntries = Object.values(mentalState).filter(s => s.date.startsWith(currentMonthPrefix));
                  return monthEntries.length > 0
                    ? (monthEntries.reduce((sum, s) => sum + (s.mood || 0), 0) / monthEntries.length).toFixed(1)
                    : '0.0';
                })()}
              </div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-xs text-gray-600 dark:text-gray-400">Motivation</div>
              <div className="text-2xl font-bold text-purple-600">
                {(() => {
                  const currentMonthPrefix = currentMonth.toISOString().slice(0, 7); // YYYY-MM
                  const monthEntries = Object.values(mentalState).filter(s => s.date.startsWith(currentMonthPrefix));
                  return monthEntries.length > 0
                    ? (monthEntries.reduce((sum, s) => sum + (s.motivation || 0), 0) / monthEntries.length).toFixed(1)
                    : '0.0';
                })()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default memo(MentalStateTracker);
