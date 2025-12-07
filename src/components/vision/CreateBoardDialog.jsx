import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Briefcase, DollarSign, User, Heart, Activity, Plane, Palette, Sparkles
} from 'lucide-react';
import BoardTemplates from './BoardTemplates';

const getDefaultFormData = () => ({
  title: '',
  category: 'Personal Development',
  description: '',
  background_color: '#f8fafc',
  tags: ''
});

const categories = [
  { value: 'Career Growth', icon: Briefcase, color: 'bg-blue-500' },
  { value: 'Financial Goals', icon: DollarSign, color: 'bg-green-500' },
  { value: 'Personal Development', icon: User, color: 'bg-purple-500' },
  { value: 'Relationships', icon: Heart, color: 'bg-pink-500' },
  { value: 'Health & Wellness', icon: Activity, color: 'bg-red-500' },
  { value: 'Travel Dreams', icon: Plane, color: 'bg-cyan-500' },
  { value: 'Creative Projects', icon: Palette, color: 'bg-orange-500' },
  { value: 'Other', icon: Sparkles, color: 'bg-gray-500' },
];

const backgroundColors = [
  '#f8fafc', '#fef3c7', '#fce7f3', '#dbeafe', '#d1fae5', '#e0e7ff', '#fae8ff', '#1f2937'
];

export default function CreateBoardDialog({ open, onClose, onCreate }) {
  const [step, setStep] = useState('template'); // 'template' or 'details'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState(getDefaultFormData);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setFormData({
      ...getDefaultFormData(),
      category: template.category || 'Other',
      background_color: template.background || '#f8fafc'
    });
    setStep('details');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    await onCreate({
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      templateItems: selectedTemplate?.items || []
    });
    setFormData(getDefaultFormData());
    setStep('template');
    setSelectedTemplate(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {step === 'template' ? 'Choose a Template' : 'Create Your Vision Board'}
          </DialogTitle>
        </DialogHeader>

        {step === 'template' ? (
          <BoardTemplates onSelect={handleTemplateSelect} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Board Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="My Dream Life 2025"
                className="dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.value })}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${formData.category === cat.value
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                    >
                      <div className={`w-8 h-8 ${cat.color} rounded-full flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-center leading-tight dark:text-gray-300">{cat.value.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What do you want to manifest?"
                className="dark:bg-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex gap-2">
                {backgroundColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, background_color: color })}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${formData.background_color === color ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-300'
                      }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="success, motivation, 2025"
                className="dark:bg-gray-700"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setStep('template')} className="flex-1">
                Back
              </Button>
              <Button
                type="submit"
                disabled={!formData.title.trim()}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Create Board
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}