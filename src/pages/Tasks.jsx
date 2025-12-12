import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client.supabase';
import { Loader2 } from 'lucide-react';
import TaskStats from '../components/tasks/TaskStats';
import TaskProgressBar from '../components/tasks/TaskProgressBar';
import TaskCharts from '../components/tasks/TaskCharts';
import TaskList from '../components/tasks/TaskList';
import TaskSettings from '../components/tasks/TaskSettings';
import TaskFilters from '../components/tasks/TaskFilters';
import { toast } from 'sonner';

export default function TasksPage() {
    const [filters, setFilters] = useState({ priority: 'all', status: 'all', category: 'all' });
    const queryClient = useQueryClient();

    // Data Fetching
    const { data: tasks = [], isLoading: tasksLoading, error: tasksError } = useQuery({
        queryKey: ['tasks'],
        queryFn: () => base44.entities.Task.list('-created_at'),
    });

    const { data: allCategories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
        queryKey: ['categories'],
        queryFn: () => base44.entities.Category.list(),
    });

    const categories = allCategories.filter(c => c.type === 'task');

    // Mutations with Optimistic Updates
    const createTask = useMutation({
        mutationFn: (data) => base44.entities.Task.create(data),
        onMutate: async (newTask) => {
            await queryClient.cancelQueries({ queryKey: ['tasks'] });
            const previousTasks = queryClient.getQueryData(['tasks']);

            // Optimistically add the new task
            const optimisticTask = {
                ...newTask,
                id: 'temp-' + Date.now(),
                created_at: new Date().toISOString(),
                status: 'Not Started'
            };

            queryClient.setQueryData(['tasks'], (old) => [optimisticTask, ...(old || [])]);
            return { previousTasks };
        },
        onError: (err, newTask, context) => {
            queryClient.setQueryData(['tasks'], context.previousTasks);
            toast.error(`Failed to create task: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const updateTask = useMutation({
        mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ['tasks'] });
            const previousTasks = queryClient.getQueryData(['tasks']);

            // Optimistically update the task
            queryClient.setQueryData(['tasks'], (old) =>
                old.map(task => task.id === id ? { ...task, ...data } : task)
            );

            return { previousTasks };
        },
        onError: (err, variables, context) => {
            queryClient.setQueryData(['tasks'], context.previousTasks);
            toast.error(`Failed to update task: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const deleteTask = useMutation({
        mutationFn: (id) => base44.entities.Task.delete(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['tasks'] });
            const previousTasks = queryClient.getQueryData(['tasks']);

            // Optimistically remove the task
            queryClient.setQueryData(['tasks'], (old) => old.filter(task => task.id !== id));

            return { previousTasks };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(['tasks'], context.previousTasks);
            toast.error(`Failed to delete task: ${err.message}`);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
    });

    const createCategory = useMutation({
        mutationFn: (data) => base44.entities.Category.create(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    });

    const deleteCategory = useMutation({
        mutationFn: (id) => base44.entities.Category.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    });

    // Filter Logic
    const filteredTasks = tasks.filter(task => {
        if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
        if (filters.status !== 'all' && task.status !== filters.status) return false;
        if (filters.category !== 'all' && task.category !== filters.category) return false;
        return true;
    });

    const handleAddTask = (taskData) => createTask.mutate(taskData);
    const handleUpdateTask = (id, data) => updateTask.mutate({ id, data });
    const handleDeleteTask = (id) => deleteTask.mutate(id);
    const handleAddCategory = (data) => createCategory.mutate(data);
    const handleDeleteCategory = (id) => deleteCategory.mutate(id);

    if (tasksError || categoriesError) {
        const err = tasksError || categoriesError;
        return (
            <div className="flex flex-col h-screen items-center justify-center gap-4 text-center p-4">
                <div className="text-red-500 font-bold text-xl">Unable to load tasks</div>
                <p className="text-gray-600 dark:text-gray-300 max-w-md">{err.message}</p>
                {(err.message?.includes('does not exist') || err.code === '42P01') && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="font-semibold text-yellow-700 dark:text-yellow-400">Database Tables Missing</p>
                        <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">Please run the <code>supabase_setup.sql</code> script in your Supabase Dashboard.</p>
                    </div>
                )}
            </div>
        );
    }

    if (tasksLoading || categoriesLoading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 py-8 tasks-page">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Tasks
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your tasks and projects</p>
                </div>

                <TaskStats tasks={tasks} />

                <TaskProgressBar tasks={tasks} />

                <TaskCharts tasks={tasks} />

                <div className="flex justify-between items-center mb-4">
                    <TaskFilters filters={filters} onFilterChange={setFilters} categories={categories} />
                    <TaskSettings
                        categories={categories}
                        onAddCategory={handleAddCategory}
                        onDeleteCategory={handleDeleteCategory}
                    />
                </div>

                <TaskList
                    tasks={filteredTasks}
                    categories={categories}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    onAdd={handleAddTask}
                />

            </div>
        </div>
    );
}