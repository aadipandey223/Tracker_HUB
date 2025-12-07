import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, Save, Play, Download, Share2, Settings, 
  Loader2, Check, Maximize, X, Undo2, Redo2
} from 'lucide-react';
import BoardCanvas from './BoardCanvas';
import ToolSidebar from './ToolSidebar';
import PresentationMode from './PresentationMode';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function BoardEditor({ 
  board, 
  items, 
  onBack, 
  onSave,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onDuplicateItem,
  onUpdateBoard,
  tasks,
  isSaving
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState('edit'); // edit, present
  const [title, setTitle] = useState(board?.title || '');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedItem) {
        onDeleteItem(selectedItem.id);
        setSelectedItem(null);
      }
      if (e.key === 'Escape') {
        setSelectedItem(null);
      }
      // Arrow keys to nudge
      if (selectedItem && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const nudge = e.shiftKey ? 10 : 1;
        const updates = {};
        if (e.key === 'ArrowUp') updates.y = (selectedItem.y || 0) - nudge;
        if (e.key === 'ArrowDown') updates.y = (selectedItem.y || 0) + nudge;
        if (e.key === 'ArrowLeft') updates.x = (selectedItem.x || 0) - nudge;
        if (e.key === 'ArrowRight') updates.x = (selectedItem.x || 0) + nudge;
        onUpdateItem(selectedItem.id, updates);
        setSelectedItem(prev => ({ ...prev, ...updates }));
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  const handleSave = () => {
    if (title !== board?.title) {
      onUpdateBoard({ title });
    }
    onSave();
    setLastSaved(new Date());
  };

  const handleAddItem = (itemData) => {
    // Add at random position
    const x = 50 + Math.random() * 300;
    const y = 50 + Math.random() * 200;
    onAddItem({ ...itemData, x, y });
  };

  const handleExport = async () => {
    // Create a canvas snapshot
    const canvas = document.querySelector('.canvas-bg');
    if (!canvas) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvasImage = await html2canvas(canvas, { scale: 2 });
      const link = document.createElement('a');
      link.download = `${board?.title || 'vision-board'}.png`;
      link.href = canvasImage.toDataURL();
      link.click();
    } catch (error) {
      // Fallback: just alert
      alert('Export feature coming soon!');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (viewMode === 'present') {
    return (
      <PresentationMode
        board={board}
        items={items}
        onExit={() => setViewMode('edit')}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-semibold border-none bg-transparent focus-visible:ring-0 w-64 dark:text-white"
                placeholder="Untitled Board"
              />
              <p className="text-xs text-gray-400 ml-3">
                Last saved: {lastSaved.toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setViewMode('present')}>
              <Play className="w-4 h-4 mr-2" /> Present
            </Button>
            <Button variant="outline" onClick={toggleFullscreen}>
              <Maximize className="w-4 h-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleExport}>
                  Download as PNG
                </DropdownMenuItem>
                <DropdownMenuItem>Download as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-orange-500 to-orange-600"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <BoardCanvas
          board={board}
          items={items}
          selectedItem={selectedItem}
          onSelectItem={setSelectedItem}
          onUpdateItem={onUpdateItem}
          onDeleteItem={onDeleteItem}
          onDuplicateItem={onDuplicateItem}
          viewMode={viewMode}
        />
        
        <ToolSidebar
          onAddItem={handleAddItem}
          selectedItem={selectedItem}
          onUpdateItem={onUpdateItem}
          tasks={tasks}
        />
      </div>
    </div>
  );
}