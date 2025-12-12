import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Settings, Plus, Trash2, Briefcase, Heart, DollarSign,
  Users, BookOpen, Home, Activity, Star, Sun, Moon,
  Coffee, Gift, Music, Smartphone, Smile, Dumbbell,
  ShoppingCart, Utensils, Plane, Camera, Bike, Car,
  GraduationCap, Palette, Gamepad2, Film, Headphones,
  ShoppingBag, Pizza, Apple, Salad, Pill, Stethoscope,
  Dog, Cat, Baby, Shirt, Watch, Glasses, Scissors,
  Paintbrush, Wrench, Hammer, Lightbulb, Zap
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

const ICONS = {
  // Work & Professional
  Briefcase, GraduationCap, Lightbulb,

  // Health & Fitness
  Activity, Dumbbell, Heart, Apple, Salad, Pill, Stethoscope,

  // Food & Dining
  Coffee, Utensils, Pizza,

  // Shopping & Finance
  ShoppingCart, ShoppingBag, DollarSign, Shirt, Watch, Glasses,

  // Home & Family
  Home, Users, Baby, Dog, Cat,

  // Entertainment & Hobbies
  Music, Headphones, Film, Gamepad2, Camera, BookOpen, Palette, Paintbrush,

  // Transportation & Travel
  Car, Bike, Plane,

  // Personal Care & Style
  Scissors, Smile,

  // Tools & DIY
  Wrench, Hammer,

  // Technology
  Smartphone, Zap,

  // Misc
  Star, Sun, Moon, Gift
};

export default function TaskSettings({ categories, onAddCategory, onDeleteCategory }) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Briefcase');

  const handleAdd = () => {
    if (newCategoryName.trim()) {
      onAddCategory({
        name: newCategoryName,
        icon: selectedIcon,
        type: 'task',
        color: 'bg-gray-500'
      });
      setNewCategoryName('');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Customize Categories</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex gap-2 items-end">
            <div className="space-y-2 flex-1">
              <Label>New Category Name</Label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Gym, Side Project"
              />
            </div>
            <Button onClick={handleAdd} disabled={!newCategoryName.trim()}>
              <Plus className="w-4 h-4 mr-2" /> Add
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Select Icon</Label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(ICONS).map(iconName => {
                const Icon = ICONS[iconName];
                return (
                  <button
                    key={iconName}
                    onClick={() => setSelectedIcon(iconName)}
                    className={`p-2 rounded-lg border ${selectedIcon === iconName
                      ? 'bg-gray-900 border-gray-900 text-white dark:bg-white dark:border-white dark:text-gray-900'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          <ScrollArea className="h-[300px] border rounded-md p-4">
            <div className="space-y-2">
              {categories.map(cat => {
                const Icon = ICONS[cat.icon] || Star;
                return (
                  <div key={cat.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 border dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{cat.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteCategory(cat.id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}