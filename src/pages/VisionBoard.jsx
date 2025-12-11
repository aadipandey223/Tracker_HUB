import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { base44 } from '@/api/base44Client.supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Star, Archive, LayoutGrid, Sparkles, MoreVertical, Edit2, Copy, Trash2 } from 'lucide-react';

export default function VisionBoard() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const queryClient = useQueryClient();

    // Data fetching with optimized caching
    const { data: boards = [] } = useQuery({
        queryKey: ['visionBoards'],
        queryFn: () => base44.entities.VisionBoard.list('-created_date'),
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
    });

    // Filter boards with memoization
    const filteredBoards = useMemo(() => boards.filter(board => {
        const matchesSearch =
            board.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (board.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        if (filter === 'starred') return matchesSearch && board.is_starred;
        if (filter === 'archived') return matchesSearch && board.is_archived;
        return matchesSearch && !board.is_archived;
    }), [boards, searchQuery, filter]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 vision-board-page">
            {/* Hero Section */}
            <div
                className="relative h-96 overflow-hidden"
                style={{
                    backgroundImage: 'linear-gradient(to right, rgba(147, 51, 234, 0.5), rgba(219, 39, 119, 0.4), rgba(249, 115, 22, 0.5)), url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2000)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="relative container mx-auto px-6 h-full flex flex-col items-center justify-center text-center z-10">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-base font-medium mb-2">
                        <Sparkles className="w-6 h-6" />
                        Visualize Your Dreams
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg">
                        Vision Board
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl drop-shadow-md italic font-bold">
                        Create beautiful vision boards to manifest your goals and dreams into reality
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-6 py-8">
                {/* Search & Filter Bar */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search boards..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        />
                    </div>
                    <Button
                        onClick={() => setFilter('all')}
                        className={`flex items-center gap-2 px-4 h-10 rounded-lg border text-sm font-medium transition-all ${filter === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        All
                    </Button>
                    <Button
                        className="h-9 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        New Board
                    </Button>
                </div>

                {/* Empty State */}
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-24 h-24 bg-sky-100 dark:bg-sky-900/20 rounded-full flex items-center justify-center mb-8 animate-pulse">
                        <Sparkles className="w-12 h-12 text-sky-500 dark:text-sky-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        Create Your First Vision Board
                    </h3>
                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-lg">
                        Start visualizing your dreams and goals today by creating a new board.
                    </p>
                    <Button
                        className="h-12 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Create Board
                    </Button>
                </div>
            </div>
        </div>
    );
}