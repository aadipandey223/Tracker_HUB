import React, { useState, useRef } from 'react';
import { CheckCircle2, X, RotateCw } from 'lucide-react';
import TextEditor from './TextEditor';

export default function CanvasItem({ 
  item, 
  isSelected, 
  onSelect, 
  onDragStart,
  onDrag,
  onDragEnd,
  onUpdate,
  onDelete,
  viewMode,
  zoom
}) {
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const itemRef = useRef(null);

  const handleMouseDown = (e) => {
    if (viewMode === 'present') return;
    e.stopPropagation();
    onSelect();
    onDragStart(e);
    
    const handleMouseMove = (moveEvent) => {
      onDrag(moveEvent);
    };
    
    const handleMouseUp = () => {
      onDragEnd();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleResize = (e, direction) => {
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = item.width || 200;
    const startHeight = item.height || 200;
    
    const handleMouseMove = (moveEvent) => {
      const deltaX = (moveEvent.clientX - startX) / zoom;
      const deltaY = (moveEvent.clientY - startY) / zoom;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      if (direction.includes('e')) newWidth = Math.max(50, startWidth + deltaX);
      if (direction.includes('w')) newWidth = Math.max(50, startWidth - deltaX);
      if (direction.includes('s')) newHeight = Math.max(50, startHeight + deltaY);
      if (direction.includes('n')) newHeight = Math.max(50, startHeight - deltaY);
      
      onUpdate({ width: newWidth, height: newHeight });
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleRotate = (e) => {
    e.stopPropagation();
    setIsRotating(true);
    
    const centerX = (item.x || 0) + (item.width || 200) / 2;
    const centerY = (item.y || 0) + (item.height || 200) / 2;
    
    const handleMouseMove = (moveEvent) => {
      const canvas = itemRef.current?.parentElement;
      if (!canvas) return;
      const canvasRect = canvas.getBoundingClientRect();
      
      const mouseX = (moveEvent.clientX - canvasRect.left) / zoom;
      const mouseY = (moveEvent.clientY - canvasRect.top) / zoom;
      
      const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI) + 90;
      onUpdate({ rotation: Math.round(angle) });
    };
    
    const handleMouseUp = () => {
      setIsRotating(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleDoubleClick = () => {
    if (item.type === 'text' || item.type === 'affirmation') {
      setShowTextEditor(true);
    }
  };

  const renderContent = () => {
    switch (item.type) {
      case 'image':
        return (
          <img 
            src={item.content} 
            alt="" 
            className="w-full h-full object-cover rounded-lg"
            draggable={false}
          />
        );
      
      case 'text':
      case 'affirmation':
        return (
          <div 
            className="w-full h-full flex items-center justify-center p-4 overflow-hidden rounded-lg"
            style={{
              fontSize: item.style?.fontSize || '16px',
              fontFamily: item.style?.fontFamily || 'inherit',
              fontWeight: item.style?.fontWeight || 'normal',
              fontStyle: item.style?.fontStyle || 'normal',
              textDecoration: item.style?.textDecoration || 'none',
              textAlign: item.style?.textAlign || 'center',
              color: item.style?.color || '#1f2937',
              textShadow: item.style?.textShadow || 'none',
              backgroundColor: item.style?.backgroundColor || 'transparent',
            }}
          >
            {item.content}
          </div>
        );
      
      case 'goal':
        return (
          <div className={`w-full h-full p-4 rounded-lg border-2 ${item.is_completed ? 'bg-green-50 border-green-300' : 'bg-white border-orange-300'}`}>
            <div className="flex items-start gap-2">
              <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${item.is_completed ? 'text-green-500' : 'text-orange-400'}`} />
              <div>
                <p className="font-medium text-sm">{item.content}</p>
                {item.is_completed && (
                  <span className="text-xs text-green-600 mt-1">Completed! 🎉</span>
                )}
              </div>
            </div>
          </div>
        );
      
      case 'shape':
        const shapeStyle = item.style || {};
        return (
          <div 
            className="w-full h-full"
            style={{
              backgroundColor: shapeStyle.fill || '#f97316',
              borderRadius: shapeStyle.shape === 'circle' ? '50%' : shapeStyle.borderRadius || '8px',
              opacity: shapeStyle.opacity || 1
            }}
          />
        );
      
      case 'sticker':
        return (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {item.content}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div
      ref={itemRef}
      className={`absolute cursor-move transition-shadow ${isSelected && viewMode !== 'present' ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}
      style={{
        left: item.x || 0,
        top: item.y || 0,
        width: item.width || 200,
        height: item.height || 200,
        transform: `rotate(${item.rotation || 0}deg)`,
        zIndex: item.z_index || 1
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => e.stopPropagation()}
    >
      {renderContent()}
      
      {/* Text Editor */}
      {showTextEditor && isSelected && (item.type === 'text' || item.type === 'affirmation') && (
        <TextEditor 
          item={item} 
          onUpdate={onUpdate}
          onClose={() => setShowTextEditor(false)}
        />
      )}
      
      {/* Controls when selected */}
      {isSelected && viewMode !== 'present' && (
        <>
          {/* Delete Button */}
          <button
            className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg z-10"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            <X className="w-3 h-3" />
          </button>

          {/* Rotation Handle */}
          <div 
            className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center justify-center cursor-grab shadow-lg"
            onMouseDown={handleRotate}
          >
            <RotateCw className="w-3 h-3" />
          </div>

          {/* Resize Handles */}
          <div 
            className="absolute -right-1.5 -bottom-1.5 w-4 h-4 bg-purple-500 rounded-full cursor-se-resize shadow"
            onMouseDown={(e) => handleResize(e, 'se')}
          />
          <div 
            className="absolute -left-1.5 -bottom-1.5 w-4 h-4 bg-purple-500 rounded-full cursor-sw-resize shadow"
            onMouseDown={(e) => handleResize(e, 'sw')}
          />
          <div 
            className="absolute -right-1.5 -top-1.5 w-4 h-4 bg-purple-500 rounded-full cursor-ne-resize shadow"
            onMouseDown={(e) => handleResize(e, 'ne')}
          />
          <div 
            className="absolute -left-1.5 -top-1.5 w-4 h-4 bg-purple-500 rounded-full cursor-nw-resize shadow"
            onMouseDown={(e) => handleResize(e, 'nw')}
          />

          {/* Edge Resize Handles */}
          <div 
            className="absolute top-1/2 -right-1.5 w-3 h-8 -translate-y-1/2 bg-purple-400 rounded-full cursor-e-resize shadow"
            onMouseDown={(e) => handleResize(e, 'e')}
          />
          <div 
            className="absolute top-1/2 -left-1.5 w-3 h-8 -translate-y-1/2 bg-purple-400 rounded-full cursor-w-resize shadow"
            onMouseDown={(e) => handleResize(e, 'w')}
          />
          <div 
            className="absolute -bottom-1.5 left-1/2 w-8 h-3 -translate-x-1/2 bg-purple-400 rounded-full cursor-s-resize shadow"
            onMouseDown={(e) => handleResize(e, 's')}
          />
          <div 
            className="absolute -top-1.5 left-1/2 w-8 h-3 -translate-x-1/2 bg-purple-400 rounded-full cursor-n-resize shadow"
            onMouseDown={(e) => handleResize(e, 'n')}
          />
        </>
      )}
    </div>
  );
}