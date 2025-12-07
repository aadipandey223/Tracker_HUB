import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { base44 } from '../src/api/base44Client.supabase';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '../src/components/ui/button';
import TaskStats from '../src/components/tasks/TaskStats';
import TaskProgressBar from '../src/components/tasks/TaskProgressBar';
import TaskCharts from '../src/components/tasks/TaskCharts';
import TaskList from '../src/components/tasks/TaskList';
import TaskSettings from '../src/components/tasks/TaskSettings';
import TaskFilters from '../src/components/tasks/TaskFilters';

export default function TasksPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ priority: 'all', status: 'all', category: 'all' });
  const queryClient = useQueryClient();

  // Data Fetching
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => base44.entities.Task.select({ sort: '-created_date', limit: 100 }),
  });

  const { data: allCategories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => base44.entities.Category.list(),
  });

  const categories = allCategories.filter(c => c.type === 'task');

  // Mutations
  const createTask = useMutation({
    mutationFn: (data) => base44.entities.Task.create(data),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old = []) => [
        {
          ...newTask,
          id: 'temp-' + Date.now(),
          created_date: new Date().toISOString(),
          priority: newTask.priority || 'Medium',
          status: newTask.status || 'Not Started'
        },
        ...old
      ]);

      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      queryClient.setQueryData(['tasks'], context.previousTasks);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const updateTask = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Task.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old = []) =>
        old.map(task => task.id === id ? { ...task, ...data } : task)
      );

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['tasks'], context.previousTasks);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const deleteTask = useMutation({
    mutationFn: (id) => base44.entities.Task.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);

      queryClient.setQueryData(['tasks'], (old = []) =>
        old.filter(task => task.id !== id)
      );

      return { previousTasks };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['tasks'], context.previousTasks);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
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

  if (tasksLoading || categoriesLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-50 dark:from-gray-900 dark:to-gray-800 py-8 tasks-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            {t('tasks.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('tasks.subtitle')}</p>
        </div>

        <TaskStats tasks={tasks} />

        <TaskProgressBar tasks={tasks} />

        <TaskCharts tasks={tasks} />

        <div className="flex justify-between items-center mb-4">
          <div id="task-filters">
            <TaskFilters filters={filters} onFilterChange={setFilters} categories={categories} />
          </div>
          <div className="flex gap-2">
            <Button
              id="add-task-btn"
              onClick={() => handleAddTask({ title: 'New Task', status: 'Not Started', priority: 'Medium' })}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Task
            </Button>
            <TaskSettings
              categories={categories}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </div>
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