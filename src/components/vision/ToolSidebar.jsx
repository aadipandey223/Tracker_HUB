import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { 
  Image, Type, Target, Sparkles, Shapes, Sticker, 
  Loader2, Bold, Italic
} from 'lucide-react';
import ImageLibrary from './ImageLibrary';
import AffirmationLibrary from './AffirmationLibrary';

const stickers = [
  // Stars & Sparkles
  '⭐', '🌟', '✨', '💫', '🌠', '⚡', '💥', '🔥', '❄️', '🌪️',
  // Motivation & Success
  '💪', '🎯', '🏆', '🥇', '🏅', '👑', '💎', '🔱', '⚜️', '🌈',
  // Love & Hearts
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🤍', '🖤', '💕', '💞', '💗', '💖', '💝', '😍', '🥰',
  // Money & Wealth
  '💰', '💵', '💸', '🤑', '💳', '💴', '💶', '💷', '📈', '📊',
  // Growth & Nature
  '🌱', '🌿', '🍀', '🌻', '🌸', '🌺', '🌹', '🌷', '🌼', '💐', '🪴', '🌳', '🌲',
  // Travel & Adventure
  '🚀', '✈️', '🌍', '🌎', '🌏', '🗺️', '🏔️', '⛰️', '🏝️', '🌊', '🏖️', '🌄', '🌅',
  // Lifestyle & Wellness
  '🏋️', '🧘', '🧘‍♀️', '🏃', '🚴', '🏊', '🥗', '🍎', '🍉', '🥑', '🍵', '☕', '🧖',
  // Mind & Creativity
  '🧠', '💡', '📚', '🎨', '🎭', '🎵', '🎬', '📖', '✏️', '🖊️', '💭', '🔮',
  // Home & Family
  '🏠', '🏡', '👨‍👩‍👧‍👦', '👨‍👩‍👧', '👫', '👭', '👬', '🐕', '🐈', '🐾',
  // Tech & Work
  '💻', '📱', '⌚', '🖥️', '⌨️', '🎧', '📸', '🎥', '📞', '💼',
  // Celebrations
  '🎉', '🎊', '🎁', '🎈', '🥂', '🍾', '🎂', '🎀', '🪩', '🥳',
  // Spiritual & Mindful
  '🙏', '😇', '🕉️', '☯️', '🧿', '🪬', '📿', '🕯️', '🌙', '☀️', '🌤️',
  // Miscellaneous Fun
  '🦋', '🦄', '🐉', '🦅', '🦁', '🐯', '🦊', '🐻', '🐼', '🦢',
  '👁️', '👀', '🫀', '🫁', '🦷', '👅', '🙌', '👏', '✊', '🤝', '🤟', '✌️', '🤞', '🫶',
  '🌀', '🔆', '🔅', '⭕', '✅', '☑️', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚪', '⚫'
];

const shapePresets = [
  { shape: 'square', fill: '#f97316', borderRadius: '8px' },
  { shape: 'circle', fill: '#3b82f6', borderRadius: '50%' },
  { shape: 'square', fill: '#10b981', borderRadius: '24px' },
  { shape: 'square', fill: '#8b5cf6', borderRadius: '0' },
  { shape: 'circle', fill: '#ec4899', borderRadius: '50%' },
  { shape: 'square', fill: '#f59e0b', borderRadius: '12px' },
  { shape: 'circle', fill: '#14b8a6', borderRadius: '50%' },
  { shape: 'square', fill: '#6366f1', borderRadius: '16px' },
  { shape: 'square', fill: '#ef4444', borderRadius: '50%' },
];

export default function ToolsSidebar({ onAddItem, selectedItem, onUpdateItem, tasks = [] }) {
  const [textContent, setTextContent] = useState('');
  const [textStyle, setTextStyle] = useState({
    fontSize: '18px',
    fontFamily: 'inherit',
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: '#1f2937',
    backgroundColor: 'transparent'
  });

  const handleSelectImage = (url) => {
    onAddItem({ type: 'image', content: url, width: 250, height: 200 });
  };

  const handleSelectAffirmation = (text) => {
    onAddItem({ 
      type: 'affirmation', 
      content: text, 
      style: { fontSize: '16px', color: '#1f2937', backgroundColor: '#fef3c7' }, 
      width: 280, 
      height: 80 
    });
  };

  const addText = () => {
    if (!textContent.trim()) return;
    onAddItem({
      type: 'text',
      content: textContent,
      style: textStyle,
      width: 250,
      height: 100
    });
    setTextContent('');
  };

  return (
    <div className="w-72 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">Add Elements</h3>
      </div>

      <Tabs defaultValue="images" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-5 mx-4 mt-2">
          <TabsTrigger value="images" className="text-xs p-2"><Image className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="text" className="text-xs p-2"><Type className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="goals" className="text-xs p-2"><Target className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="shapes" className="text-xs p-2"><Shapes className="w-4 h-4" /></TabsTrigger>
          <TabsTrigger value="stickers" className="text-xs p-2"><Sticker className="w-4 h-4" /></TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1 p-4">
          {/* Images Tab */}
          <TabsContent value="images" className="mt-0">
            <ImageLibrary onSelectImage={handleSelectImage} />
          </TabsContent>

          {/* Text Tab */}
          <TabsContent value="text" className="mt-0 space-y-4">
            <div className="space-y-2">
              <Label>Your Text</Label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Type your text..."
                className="w-full h-20 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label>Font Size</Label>
              <Slider
                value={[parseInt(textStyle.fontSize)]}
                onValueChange={(v) => setTextStyle({...textStyle, fontSize: `${v[0]}px`})}
                min={12}
                max={48}
                step={2}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={textStyle.fontWeight === 'bold' ? 'secondary' : 'outline'}
                size="icon"
                onClick={() => setTextStyle({...textStyle, fontWeight: textStyle.fontWeight === 'bold' ? 'normal' : 'bold'})}
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                variant={textStyle.fontStyle === 'italic' ? 'secondary' : 'outline'}
                size="icon"
                onClick={() => setTextStyle({...textStyle, fontStyle: textStyle.fontStyle === 'italic' ? 'normal' : 'italic'})}
              >
                <Italic className="w-4 h-4" />
              </Button>
              <input
                type="color"
                value={textStyle.color}
                onChange={(e) => setTextStyle({...textStyle, color: e.target.value})}
                className="w-10 h-10 rounded cursor-pointer"
              />
            </div>

            <Button onClick={addText} className="w-full bg-orange-500 hover:bg-orange-600">
              Add Text
            </Button>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <AffirmationLibrary onSelectAffirmation={handleSelectAffirmation} />
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="mt-0 space-y-4">
            <p className="text-sm text-gray-500">Link goals from your task tracker:</p>
            {tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.filter(t => t.status !== 'Done').slice(0, 10).map(task => (
                  <button
                    key={task.id}
                    onClick={() => onAddItem({ type: 'goal', content: task.title, linked_goal_id: task.id, is_completed: task.status === 'Done', width: 220, height: 80 })}
                    className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-gray-500">{task.priority} Priority</p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No tasks found. Create tasks in your Task Tracker first!</p>
            )}
          </TabsContent>

          {/* Shapes Tab */}
          <TabsContent value="shapes" className="mt-0">
            <div className="grid grid-cols-3 gap-3">
              {shapePresets.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => onAddItem({ type: 'shape', style: preset, width: 100, height: 100 })}
                  className="aspect-square rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-orange-500 transition p-2"
                >
                  <div 
                    className="w-full h-full"
                    style={{ backgroundColor: preset.fill, borderRadius: preset.borderRadius }}
                  />
                </button>
              ))}
            </div>
          </TabsContent>

          {/* Stickers Tab */}
          <TabsContent value="stickers" className="mt-0">
            <p className="text-xs text-gray-500 mb-3">Click or drag stickers to your board</p>
            <div className="grid grid-cols-6 gap-1">
              {stickers.map((sticker, i) => (
                <button
                  key={i}
                  onClick={() => onAddItem({ type: 'sticker', content: sticker, width: 60, height: 60 })}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('sticker', sticker);
                    e.dataTransfer.setData('item-type', 'sticker');
                  }}
                  className="text-xl p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition hover:scale-125"
                >
                  {sticker}
                </button>
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}