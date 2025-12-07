import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, MoreVertical, Archive, Trash2, Copy, Edit, 
  Briefcase, DollarSign, User, Heart, Activity, Plane, Palette, Sparkles
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from 'date-fns';

const categoryIcons = {
  'Career Growth': Briefcase,
  'Financial Goals': DollarSign,
  'Personal Development': User,
  'Relationships': Heart,
  'Health & Wellness': Activity,
  'Travel Dreams': Plane,
  'Creative Projects': Palette,
  'Other': Sparkles
};

const categoryColors = {
  'Career Growth': 'bg-blue-500',
  'Financial Goals': 'bg-green-500',
  'Personal Development': 'bg-purple-500',
  'Relationships': 'bg-pink-500',
  'Health & Wellness': 'bg-red-500',
  'Travel Dreams': 'bg-cyan-500',
  'Creative Projects': 'bg-orange-500',
  'Other': 'bg-gray-500'
};

export default function BoardCard({ board, itemCount, onOpen, onStar, onArchive, onDelete, onDuplicate }) {
  const Icon = categoryIcons[board.category] || Sparkles;
  
  return (
    <Card 
      className="group relative overflow-hidden border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => onOpen(board)}
    >
      {/* Preview Background */}
      <div 
        className="h-40 relative overflow-hidden"
        style={{ 
          backgroundColor: board.background_color || '#f8fafc',
          backgroundImage: board.background_image ? `url(${board.background_image})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${categoryColors[board.category]} text-white`}>
            <Icon className="w-3 h-3 mr-1" />
            {board.category}
          </Badge>
        </div>

        {/* Star Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 bg-white/20 hover:bg-white/40"
          onClick={(e) => {
            e.stopPropagation();
            onStar(board);
          }}
        >
          <Star className={`w-4 h-4 ${board.is_starred ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`} />
        </Button>

        {/* Item Count */}
        <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 px-2 py-1 rounded text-xs font-medium">
          {itemCount} items
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{board.title}</h3>
            {board.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">{board.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              {format(new Date(board.created_date), 'MMM d, yyyy')}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => onOpen(board)}>
                <Edit className="w-4 h-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(board)}>
                <Copy className="w-4 h-4 mr-2" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchive(board)}>
                <Archive className="w-4 h-4 mr-2" /> Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(board)} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tags */}
        {board.tags && board.tags.length > 0 && (
          <div className="flex gap-1 mt-3 flex-wrap">
            {board.tags.slice(0, 3).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {board.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">+{board.tags.length - 3}</Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}