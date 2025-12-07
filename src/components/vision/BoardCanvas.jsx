import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ZoomIn, ZoomOut, RotateCcw, Grid, Maximize2, Layers,
  Move, Trash2, Copy, ArrowUp, ArrowDown
} from 'lucide-react';
import CanvasItem from './CanvasItem';

export default function BoardCanvas({ 
  board, 
  items, 
  selectedItem, 
  onSelectItem, 
  onUpdateItem, 
  onDeleteItem,
  onDuplicateItem,
  viewMode 
}) {
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.1, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.1, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target.classList.contains('canvas-bg')) {
      onSelectItem(null);
    }
  };

  const handleItemDragStart = (e, item) => {
    if (viewMode === 'present') return;
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleItemDrag = (e, item) => {
    if (!isDragging || viewMode === 'present') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    const newX = (e.clientX - canvasRect.left - dragOffset.x) / zoom;
    const newY = (e.clientY - canvasRect.top - dragOffset.y) / zoom;
    
    onUpdateItem(item.id, { x: Math.max(0, newX), y: Math.max(0, newY) });
  };

  const handleItemDragEnd = () => {
    setIsDragging(false);
  };

  const handleBringForward = () => {
    if (!selectedItem) return;
    const maxZ = Math.max(...items.map(i => i.z_index || 1));
    onUpdateItem(selectedItem.id, { z_index: maxZ + 1 });
  };

  const handleSendBackward = () => {
    if (!selectedItem) return;
    const minZ = Math.min(...items.map(i => i.z_index || 1));
    onUpdateItem(selectedItem.id, { z_index: Math.max(1, minZ - 1) });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Toolbar */}
      {viewMode !== 'present' && (
        <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium w-16 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleResetZoom}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
            <Button 
              variant={showGrid ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>

          {selectedItem && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handleBringForward}>
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSendBackward}>
                <ArrowDown className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDuplicateItem(selectedItem)}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDeleteItem(selectedItem.id)} className="text-red-500">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-8">
        <div
          ref={canvasRef}
          className={`canvas-bg relative mx-auto transition-transform ${showGrid ? 'bg-[length:20px_20px]' : ''}`}
          onClick={handleCanvasClick}
          style={{
            width: 1200 * zoom,
            height: 800 * zoom,
            minWidth: 1200 * zoom,
            minHeight: 800 * zoom,
            backgroundColor: board?.background_color || '#f8fafc',
            backgroundImage: board?.background_image 
              ? `url(${board.background_image})` 
              : showGrid 
                ? 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)'
                : 'none',
            backgroundSize: board?.background_image ? 'cover' : '20px 20px',
            backgroundPosition: 'center',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transform: `scale(${zoom})`,
            transformOrigin: 'top left'
          }}
        >
          {items.map(item => (
            <CanvasItem
              key={item.id}
              item={item}
              isSelected={selectedItem?.id === item.id}
              onSelect={() => onSelectItem(item)}
              onDragStart={(e) => handleItemDragStart(e, item)}
              onDrag={(e) => handleItemDrag(e, item)}
              onDragEnd={handleItemDragEnd}
              onUpdate={(updates) => onUpdateItem(item.id, updates)}
              onDelete={() => onDeleteItem(item.id)}
              viewMode={viewMode}
              zoom={zoom}
            />
          ))}
        </div>
      </div>
    </div>
  );
}