import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react';

const ambientTracks = [
  { name: 'Peaceful', url: '' }, // Placeholder - would need actual audio URLs
  { name: 'Motivational', url: '' },
  { name: 'Nature', url: '' },
];

export default function PresentationMode({ board, items, onExit, allBoards = [], onSwitchBoard }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef(null);
  const timeoutRef = useRef(null);

  const multipleBoards = allBoards.length > 1;
  const currentBoardIndex = allBoards.findIndex(b => b.id === board?.id);

  useEffect(() => {
    // Hide controls after 3 seconds of no movement
    const hideControls = () => {
      timeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    const showAndResetTimer = () => {
      setShowControls(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      hideControls();
    };

    document.addEventListener('mousemove', showAndResetTimer);
    hideControls();

    return () => {
      document.removeEventListener('mousemove', showAndResetTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onExit();
      if (e.key === 'ArrowRight' && multipleBoards) goToNextBoard();
      if (e.key === 'ArrowLeft' && multipleBoards) goToPrevBoard();
      if (e.key === ' ') setIsPlaying(!isPlaying);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentBoardIndex]);

  // Auto-advance for multiple boards
  useEffect(() => {
    if (!isPlaying || !multipleBoards) return;
    
    const interval = setInterval(() => {
      goToNextBoard();
    }, 8000);

    return () => clearInterval(interval);
  }, [isPlaying, currentBoardIndex, multipleBoards]);

  const goToNextBoard = () => {
    if (currentBoardIndex < allBoards.length - 1) {
      onSwitchBoard?.(allBoards[currentBoardIndex + 1]);
    } else {
      onSwitchBoard?.(allBoards[0]);
    }
  };

  const goToPrevBoard = () => {
    if (currentBoardIndex > 0) {
      onSwitchBoard?.(allBoards[currentBoardIndex - 1]);
    } else {
      onSwitchBoard?.(allBoards[allBoards.length - 1]);
    }
  };

  const renderItem = (item, index) => {
    const style = {
      position: 'absolute',
      left: item.x || 0,
      top: item.y || 0,
      width: item.width || 200,
      height: item.height || 200,
      transform: `rotate(${item.rotation || 0}deg)`,
      zIndex: item.z_index || 1,
      animation: `fadeInUp 0.6s ease-out forwards`,
      animationDelay: `${index * 0.15}s`,
      opacity: 0
    };

    switch (item.type) {
      case 'image':
        return (
          <div key={item.id} style={style}>
            <img src={item.content} alt="" className="w-full h-full object-cover rounded-lg shadow-xl" />
          </div>
        );
      case 'text':
      case 'affirmation':
        return (
          <div
            key={item.id}
            style={{
              ...style,
              fontSize: item.style?.fontSize || '18px',
              fontFamily: item.style?.fontFamily || 'inherit',
              fontWeight: item.style?.fontWeight || 'normal',
              color: item.style?.color || '#1f2937',
              backgroundColor: item.style?.backgroundColor || 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              textAlign: 'center',
              borderRadius: '12px'
            }}
          >
            {item.content}
          </div>
        );
      case 'sticker':
        return (
          <div key={item.id} style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
            {item.content}
          </div>
        );
      case 'shape':
        return (
          <div
            key={item.id}
            style={{
              ...style,
              backgroundColor: item.style?.fill || '#f97316',
              borderRadius: item.style?.shape === 'circle' ? '50%' : item.style?.borderRadius || '8px',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      style={{
        backgroundImage: board?.background_image ? `url(${board.background_image})` : undefined,
        backgroundColor: board?.background_color || '#1a1a2e',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Board Canvas */}
      <div 
        className="relative"
        style={{
          width: 1200,
          height: 800,
          transform: 'scale(0.85)',
          backgroundColor: board?.background_color || 'transparent',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        {items.map((item, index) => renderItem(item, index))}
      </div>

      {/* Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Board Title */}
          <div className="text-white">
            <h2 className="text-xl font-bold">{board?.title}</h2>
            {multipleBoards && (
              <p className="text-sm text-gray-400">
                Board {currentBoardIndex + 1} of {allBoards.length}
              </p>
            )}
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-3">
            {multipleBoards && (
              <>
                <Button variant="ghost" size="icon" onClick={goToPrevBoard} className="text-white hover:bg-white/20">
                  <SkipBack className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={goToNextBoard} className="text-white hover:bg-white/20">
                  <SkipForward className="w-5 h-5" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className="text-white hover:bg-white/20">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>

          {/* Exit */}
          <Button onClick={onExit} variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
            <X className="w-4 h-4 mr-2" /> Exit
          </Button>
        </div>

        {/* Board Indicators */}
        {multipleBoards && (
          <div className="flex justify-center gap-2 mt-4">
            {allBoards.map((b, i) => (
              <button
                key={b.id}
                onClick={() => onSwitchBoard?.(b)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentBoardIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Keyboard hints */}
      <div className={`absolute top-4 right-4 text-white/50 text-xs transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        Press ESC to exit • Arrow keys to navigate
      </div>
    </div>
  );
}