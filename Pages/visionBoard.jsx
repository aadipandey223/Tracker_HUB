import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { base44 } from '../src/api/base44Client.supabase';
import { Button } from '../src/components/ui/button';
import { Input } from '../src/components/ui/input';
import { Badge } from '../src/components/ui/badge';
import { Plus, Search, Star, Archive, LayoutGrid, Sparkles, MoreVertical, Edit2, Copy, Trash2 } from 'lucide-react';
import CreateBoardDialog from '../src/components/vision/CreateBoardDialog';
import BoardEditor from '../src/components/vision/BoardEditor';

export default function VisionBoard() {
    const { t } = useTranslation();
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all'); // all | starred | archived
    const [editingBoard, setEditingBoard] = useState(null);
    const queryClient = useQueryClient();

    // Data fetching
    const { data: boards = [] } = useQuery({
        queryKey: ['visionBoards'],
        queryFn: () => base44.entities.VisionBoard.list('-created_date'),
    });

    const { data: allItems = [] } = useQuery({
        queryKey: ['visionBoardItems'],
        queryFn: () => base44.entities.VisionBoardItem.list(),
    });

    const { data: tasks = [] } = useQuery({
        queryKey: ['tasks'],
        queryFn: () => base44.entities.Task.list(),
    });

    const currentBoardItems = allItems.filter(item => item.board_id === editingBoard?.id);

    // Mutations
    const createBoardMutation = useMutation({
        mutationFn: (data) => base44.entities.VisionBoard.create(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visionBoards'] }),
    });

    const updateBoardMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.VisionBoard.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visionBoards'] }),
    });

    const deleteBoardMutation = useMutation({
        mutationFn: (id) => base44.entities.VisionBoard.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visionBoards'] }),
    });

    const createItemMutation = useMutation({
        mutationFn: (data) => base44.entities.VisionBoardItem.create(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visionBoardItems'] }),
    });

    const updateItemMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.VisionBoardItem.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visionBoardItems'] }),
    });

    const deleteItemMutation = useMutation({
        mutationFn: (id) => base44.entities.VisionBoardItem.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['visionBoardItems'] }),
    });

    // Handlers
    const handleCreateBoard = async (data) => {
        try {
            const boardData = {
                ...data,
                created_date: new Date().toISOString(),
                is_archived: false,
                is_starred: false,
            };
            await createBoardMutation.mutateAsync(boardData);
            setShowCreateDialog(false);
        } catch (error) {
            console.error('Failed to create board:', error);
            alert('Failed to create board. Check console for details.');
        }
    };

    const handleStarBoard = (board) => {
        updateBoardMutation.mutate({ id: board.id, data: { is_starred: !board.is_starred } });
    };

    const handleArchiveBoard = (board) => {
        updateBoardMutation.mutate({ id: board.id, data: { is_archived: !board.is_archived } });
    };

    const handleDeleteBoard = async (board) => {
        const boardItems = allItems.filter(item => item.board_id === board.id);
        await Promise.all(boardItems.map(item => deleteItemMutation.mutateAsync(item.id)));
        await deleteBoardMutation.mutateAsync(board.id);
    };

    const handleRenameBoard = async (board) => {
        const newName = prompt('Enter new board name', board.title);
        if (newName && newName !== board.title) {
            await updateBoardMutation.mutateAsync({ id: board.id, data: { title: newName } });
        }
    };

    const handleAddItem = async (itemData) => {
        await createItemMutation.mutateAsync({ ...itemData, board_id: editingBoard.id });
    };

    const handleUpdateItem = async (itemId, updates) => {
        await updateItemMutation.mutateAsync({ id: itemId, data: updates });
    };

    const handleDeleteItem = async (itemId) => {
        await deleteItemMutation.mutateAsync(itemId);
    };

    const handleDuplicateItem = async (item) => {
        await createItemMutation.mutateAsync({ ...item, x: (item.x || 0) + 20, y: (item.y || 0) + 20 });
    };

    const handleUpdateBoard = async (updates) => {
        await updateBoardMutation.mutateAsync({ id: editingBoard.id, data: updates });
        setEditingBoard(prev => ({ ...prev, ...updates }));
    };

    // Filter boards
    const filteredBoards = boards.filter(board => {
        const matchesSearch =
            board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (board.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        if (filter === 'starred') return matchesSearch && board.is_starred;
        if (filter === 'archived') return matchesSearch && board.is_archived;
        return matchesSearch && !board.is_archived;
    });

    // BoardCard component (square cards)
    const BoardCard = ({ board }) => {
        const [showMenu, setShowMenu] = useState(false);
        const itemCount = allItems.filter(item => item.board_id === board.id).length;

        return (
            <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all overflow-visible">
                {/* Card Image/Preview */}
                <div
                    className="w-full relative cursor-pointer overflow-hidden rounded-t-xl"
                    onClick={() => setEditingBoard(board)}
                    style={{
                        aspectRatio: '2/1',
                        background: `linear-gradient(135deg, ${board.background_color || '#8B5CF6'} 0%, ${board.background_color ? board.background_color + 'dd' : '#A855F7'} 100%)`,
                        backgroundImage: board.background_image ? `url(${board.background_image})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Category Badge - Top Left */}
                    <div className="absolute top-3 left-3">
                        <Badge className="bg-purple-600 text-white text-xs px-2.5 py-1 font-medium shadow-lg">
                            <span className="mr-1">👤</span> {board.category}
                        </Badge>
                    </div>

                    {/* Star Icon - Top Right */}
                    <button
                        className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-md"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleStarBoard(board);
                        }}
                    >
                        <Star className={`w-4 h-4 ${board.is_starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                    </button>

                    {/* Item Count - Bottom Right */}
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-md text-xs font-semibold shadow-md">
                        {itemCount} items
                    </div>
                </div>

                {/* Card Content */}
                <div className="p-3">
                    <div className="mb-1.5">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate mb-0.5">
                            {board.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {board.description || 'Learning & self-improvement'}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                            {new Date(board.created_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        {/* 3-dot menu */}
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(!showMenu);
                                }}
                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            {showMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowMenu(false);
                                        }}
                                    />
                                    <div className="absolute right-0 bottom-full mb-1 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                                        <button
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowMenu(false);
                                                setEditingBoard(board);
                                            }}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </button>
                                        <button
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowMenu(false);
                                                handleDuplicateBoard(board);
                                            }}
                                        >
                                            <Copy className="w-4 h-4" />
                                            Duplicate
                                        </button>
                                        <button
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowMenu(false);
                                                handleArchiveBoard(board);
                                            }}
                                        >
                                            <Archive className="w-4 h-4" />
                                            Archive
                                        </button>
                                        <button
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowMenu(false);
                                                if (confirm('Delete this board?')) handleDeleteBoard(board);
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render editor if editing
    if (editingBoard) {
        return (
            <BoardEditor
                board={editingBoard}
                items={currentBoardItems}
                onBack={() => setEditingBoard(null)}
                onSave={() => { }}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                onDuplicateItem={handleDuplicateItem}
                onUpdateBoard={handleUpdateBoard}
                tasks={tasks}
                isSaving={updateBoardMutation.isPending || createItemMutation.isPending || updateItemMutation.isPending}
            />
        );
    }

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
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search boards..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-9 h-10 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        />
                    </div>
                    {/* Filter Buttons */}
                    <button
                        onClick={() => setFilter('all')}
                        className={`flex items-center gap-2 px-4 h-10 rounded-lg border text-sm font-medium transition-all ${filter === 'all' ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                        All
                    </button>
                    <button
                        onClick={() => setFilter('starred')}
                        className={`flex items-center gap-2 px-4 h-10 rounded-lg border text-sm font-medium transition-all ${filter === 'starred' ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}
                    >
                        <Star className="w-4 h-4" />
                        Starred
                    </button>
                    <button
                        onClick={() => setFilter('archived')}
                        className={`flex items-center gap-2 px-4 h-10 rounded-lg border text-sm font-medium transition-all ${filter === 'archived' ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}
                    >
                        <Archive className="w-4 h-4" />
                        Archived
                    </button>
                    {/* New Board Button */}
                    <Button
                        onClick={() => setShowCreateDialog(true)}
                        className="h-9 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        New Board
                    </Button>
                </div>

                {/* Boards Grid or Empty State */}
                {filteredBoards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-24 h-24 bg-sky-100 dark:bg-sky-900/20 rounded-full flex items-center justify-center mb-8 animate-pulse">
                            <Sparkles className="w-12 h-12 text-sky-500 dark:text-sky-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                            {filter === 'all' ? 'Create Your First Vision Board' : `No ${filter} boards found`}
                        </h3>
                        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-lg">
                            {filter === 'all'
                                ? 'Start visualizing your dreams and goals today by creating a new board.'
                                : 'Try adjusting your filters or search query to find what you are looking for.'}
                        </p>
                        {filter === 'all' && (
                            <Button
                                onClick={() => setShowCreateDialog(true)}
                                className="h-12 px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create Board
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredBoards.map(board => (
                            <BoardCard key={board.id} board={board} />
                        ))}
                    </div>
                )}
                <CreateBoardDialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} onCreate={handleCreateBoard} />
            </div>
        </div>
    );
}