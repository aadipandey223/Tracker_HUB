import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Type, Palette
} from 'lucide-react';

const fonts = [
  { name: 'Default', value: 'inherit' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Helvetica', value: 'Helvetica, sans-serif' },
  { name: 'Courier', value: 'Courier New, monospace' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Comic Sans', value: 'Comic Sans MS, cursive' },
  { name: 'Impact', value: 'Impact, sans-serif' },
];

const presetColors = [
  '#000000', '#ffffff', '#1f2937', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1'
];

export default function TextEditor({ item, onUpdate, onClose }) {
  const [style, setStyle] = useState({
    fontSize: '18px',
    fontFamily: 'inherit',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'center',
    color: '#1f2937',
    backgroundColor: 'transparent',
    ...item?.style
  });
  const [content, setContent] = useState(item?.content || '');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.text-editor-popup')) {
        handleSave();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [content, style]);

  const handleSave = () => {
    onUpdate({ content, style });
    onClose?.();
  };

  const updateStyle = (key, value) => {
    const newStyle = { ...style, [key]: value };
    setStyle(newStyle);
    onUpdate({ style: newStyle });
  };

  const toggleStyle = (key, activeValue, inactiveValue) => {
    updateStyle(key, style[key] === activeValue ? inactiveValue : activeValue);
  };

  return (
    <div className="text-editor-popup absolute -top-16 left-0 right-0 flex items-center gap-1 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
      {/* Font Family */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs">
            <Type className="w-4 h-4 mr-1" />
            Font
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2">
          <div className="space-y-1">
            {fonts.map(font => (
              <button
                key={font.value}
                onClick={() => updateStyle('fontFamily', font.value)}
                className={`w-full text-left px-2 py-1 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  style.fontFamily === font.value ? 'bg-purple-100 dark:bg-purple-900/30' : ''
                }`}
                style={{ fontFamily: font.value }}
              >
                {font.name}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Font Size */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs">
            {parseInt(style.fontSize)}px
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-4">
          <p className="text-xs text-gray-500 mb-2">Font Size</p>
          <Slider
            value={[parseInt(style.fontSize)]}
            onValueChange={(v) => updateStyle('fontSize', `${v[0]}px`)}
            min={12}
            max={72}
            step={2}
          />
        </PopoverContent>
      </Popover>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

      {/* Bold */}
      <Button
        variant={style.fontWeight === 'bold' ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => toggleStyle('fontWeight', 'bold', 'normal')}
      >
        <Bold className="w-4 h-4" />
      </Button>

      {/* Italic */}
      <Button
        variant={style.fontStyle === 'italic' ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => toggleStyle('fontStyle', 'italic', 'normal')}
      >
        <Italic className="w-4 h-4" />
      </Button>

      {/* Underline */}
      <Button
        variant={style.textDecoration === 'underline' ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => toggleStyle('textDecoration', 'underline', 'none')}
      >
        <Underline className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

      {/* Alignment */}
      <Button
        variant={style.textAlign === 'left' ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => updateStyle('textAlign', 'left')}
      >
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button
        variant={style.textAlign === 'center' ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => updateStyle('textAlign', 'center')}
      >
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button
        variant={style.textAlign === 'right' ? 'secondary' : 'ghost'}
        size="icon"
        className="h-8 w-8"
        onClick={() => updateStyle('textAlign', 'right')}
      >
        <AlignRight className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

      {/* Text Color */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <div className="w-4 h-4 rounded-full border-2" style={{ backgroundColor: style.color }} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3">
          <p className="text-xs text-gray-500 mb-2">Text Color</p>
          <div className="grid grid-cols-6 gap-1">
            {presetColors.map(color => (
              <button
                key={color}
                onClick={() => updateStyle('color', color)}
                className={`w-6 h-6 rounded-full border-2 ${style.color === color ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <input
            type="color"
            value={style.color}
            onChange={(e) => updateStyle('color', e.target.value)}
            className="w-full h-8 mt-2 rounded cursor-pointer"
          />
        </PopoverContent>
      </Popover>

      {/* Background Color */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Palette className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-3">
          <p className="text-xs text-gray-500 mb-2">Background Color</p>
          <div className="grid grid-cols-6 gap-1">
            <button
              onClick={() => updateStyle('backgroundColor', 'transparent')}
              className={`w-6 h-6 rounded-full border-2 ${style.backgroundColor === 'transparent' ? 'border-purple-500' : 'border-gray-200'}`}
              style={{ background: 'repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%) 50% / 8px 8px' }}
            />
            {presetColors.slice(0, 11).map(color => (
              <button
                key={color}
                onClick={() => updateStyle('backgroundColor', color)}
                className={`w-6 h-6 rounded-full border-2 ${style.backgroundColor === color ? 'border-purple-500' : 'border-gray-200'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <input
            type="color"
            value={style.backgroundColor === 'transparent' ? '#ffffff' : style.backgroundColor}
            onChange={(e) => updateStyle('backgroundColor', e.target.value)}
            className="w-full h-8 mt-2 rounded cursor-pointer"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}