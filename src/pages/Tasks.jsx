import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { base44 } from '@/api/base44Client.supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
    Plus, 
    Search, 
    Filter, 
    CheckSquare, 
    Square, 
    Calendar, 
    Clock,
    AlertCircle,
    Trash2,
    Edit2
} from 'lucide-react';

export default function Tasks() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all'); // all, pending, completed, overdue
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium'
    });
    const queryClient = useQueryClient();

    // Fetch tasks
    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: () => base44.entities.Task.list('-created_date'),
    });

    // Mutations
    const createTaskMutation = useMutation({
        mutationFn: (data) => base44.entities.Task.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            setShowCreateForm(false);
            setNewTask({ title: '', description: '', due_date: '', priority: 'medium' });
        },
    });

    const updateTaskMutation = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    });

    const deleteTaskMutation = useMutation({
        mutationFn: (id) => base44.entities.Task.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
    });

    // Filter tasks
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                task.description?.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (!matchesSearch) return false;

            const now = new Date();
            const dueDate = task.due_date ? new Date(task.due_date) : null;
            const isOverdue = dueDate && dueDate < now && !task.is_completed;

            switch (filter) {
                case 'pending':
                    return !task.is_completed;
                case 'completed':
                    return task.is_completed;
                case 'overdue':
                    return isOverdue;
                default:
                    return true;
            }
        });
    }, [tasks, searchQuery, filter]);

    const handleCreateTask = (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) return;

        createTaskMutation.mutate({
            ...newTask,
            is_completed: false,
            created_date: new Date().toISOString(),
        });
    };

    const toggleTaskComplete = (task) => {
        updateTaskMutation.mutate({
            id: task.id,
            data: { is_completed: !task.is_completed }
        });
    };

    const deleteTask = (id) => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTaskMutation.mutate(id);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTaskStats = () => {
        const total = tasks.length;
        const completed = tasks.filter(t => t.is_completed).length;
        const pending = total - completed;
        const overdue = tasks.filter(t => {
            const dueDate = t.due_date ? new Date(t.due_date) : null;
            return dueDate && dueDate < new Date() && !t.is_completed;
        }).length;

        return { total, completed, pending, overdue };
    };

    const stats = getTaskStats();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Tasks
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your tasks and stay organized
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Task
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                            <p className="text-sm text-gray-500">Total Tasks</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                            <p className="text-sm text-gray-500">Pending</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                            <p className="text-sm text-gray-500">Completed</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                            <p className="text-sm text-gray-500">Overdue</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filter */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex gap-2">
                        {['all', 'pending', 'completed', 'overdue'].map((filterType) => (
                            <Button
                                key={filterType}
                                variant={filter === filterType ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFilter(filterType)}
                            >
                                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Create Task Form */}
                {showCreateForm && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Create New Task</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateTask} className="space-y-4">
                                <Input
                                    placeholder="Task title"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    required
                                />
                                <Input
                                    placeholder="Description (optional)"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                />
                                <div className="flex gap-4">
                                    <Input
                                        type="date"
                                        value={newTask.due_date}
                                        onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                                    />
                                    <select
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                        className="px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="low">Low Priority</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="high">High Priority</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" disabled={createTaskMutation.isPending}>
                                        {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowCreateForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Tasks List */}
                <div className="space-y-4">
                    {filteredTasks.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No tasks found
                                </h3>
                                <p className="text-gray-500">
                                    {searchQuery ? 'Try adjusting your search' : 'Create your first task to get started'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredTasks.map((task) => {
                            const dueDate = task.due_date ? new Date(task.due_date) : null;
                            const isOverdue = dueDate && dueDate < new Date() && !task.is_completed;
                            
                            return (
                                <Card key={task.id} className={`${task.is_completed ? 'opacity-75' : ''} ${isOverdue ? 'border-red-200' : ''}`}>
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <button
                                                onClick={() => toggleTaskComplete(task)}
                                                className="mt-1"
                                            >
                                                {task.is_completed ? (
                                                    <CheckSquare className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <Square className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                                )}
                                            </button>
                                            
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className={`font-medium ${task.is_completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                                        {task.title}
                                                    </h3>
                                                    <Badge className={getPriorityColor(task.priority)}>
                                                        {task.priority}
                                                    </Badge>
                                                    {isOverdue && (
                                                        <Badge className="bg-red-100 text-red-800">
                                                            <AlertCircle className="w-3 h-3 mr-1" />
                                                            Overdue
                                                        </Badge>
                                                    )}
                                                </div>
                                                
                                                {task.description && (
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                                        {task.description}
                                                    </p>
                                                )}
                                                
                                                {dueDate && (
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        <Calendar className="w-4 h-4" />
                                                        Due: {dueDate.toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteTask(task.id)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}