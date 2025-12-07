import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Smile, Zap, Save } from 'lucide-react';

export default function MentalStateTracker({ habitLogs, onUpdate }) {
  const avgMood = habitLogs.length > 0 
    ? habitLogs.reduce((sum, log) => sum + (log.mood || 5), 0) / habitLogs.length 
    : 5;
  
  const avgMotivation = habitLogs.length > 0
    ? habitLogs.reduce((sum, log) => sum + (log.motivation || 5), 0) / habitLogs.length
    : 5;

  const [mood, setMood] = useState(Math.round(avgMood));
  const [motivation, setMotivation] = useState(Math.round(avgMotivation));

  useEffect(() => {
    setMood(Math.round(avgMood));
    setMotivation(Math.round(avgMotivation));
  }, [avgMood, avgMotivation]);

  const getMoodEmoji = (value) => {
    if (value >= 8) return '😄';
    if (value >= 6) return '🙂';
    if (value >= 4) return '😐';
    if (value >= 2) return '😕';
    return '😢';
  };

  const getMotivationColor = (value) => {
    if (value >= 8) return 'text-green-600';
    if (value >= 6) return 'text-blue-600';
    if (value >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSave = () => {
    onUpdate(mood, motivation);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smile className="w-5 h-5 text-purple-600" />
          Mental State
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Mood
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getMoodEmoji(mood)}</span>
              <span className="text-2xl font-bold text-purple-600">{mood}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/10</span>
            </div>
          </div>
          <Slider
            value={[mood]}
            onValueChange={(value) => setMood(value[0])}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Motivation */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Motivation
            </label>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getMotivationColor(motivation)}`}>
                {motivation}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/10</span>
            </div>
          </div>
          <Slider
            value={[motivation]}
            onValueChange={(value) => setMotivation(value[0])}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Mental State
        </Button>
      </CardContent>
    </Card>
  );
}