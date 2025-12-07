import { useState, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import { 
  CheckSquare, Square, AlertCircle, 
  Briefcase, DollarSign, Users, BookOpen, Home, Activity,
  MoreHorizontal, Plus, Trash2, Edit2, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const PRIORITIES = {
  High: { color: 'bg-red-500', label: 'High' },
  Medium: { color: 'bg-yellow-500', label: 'Medium' },
  Low: { color: 'bg-blue-500', label: 'Low' },
  Optional: { color: 'bg-gray-300', label: 'Optional' },
};

const STATUSES = {
  'Not Started': { icon: AlertCircle, color: 'text-amber-500', label: 'Not Started' },
  'In Progress': { icon: Edit2, color: 'text-yellow-600', label: 'In Progress' },
  'Done': { icon: CheckSquare, color: 'text-green-600', label: 'Done' },
  'Canceled': { icon: Square, color: 'text-red-500', label: 'Canceled' },
};

export default function TaskList({ tasks, categories, onUpdate, onDelete, onAdd }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingValues, setEditingValues] = useState({});
  const updateTimeouts = useRef({});
  const today = new Date().toISOString().split('T')[0];

  const handleQuickAdd = (e) => {
    if (e.key === 'Enter' && newTaskTitle.trim()) {
      onAdd({
        title: newTaskTitle,
        status: 'Not Started',
        priority: 'Medium',
        due_date: today,
        category: categories[0]?.name || 'Work'
      });
      setNewTaskTitle('');
    }
  };

  // Debounced update for text fields (title, description)
  const debouncedUpdate = useCallback((taskId, field, value) => {
    // Update local state immediately for responsive UI
    setEditingValues(prev => ({
      ...prev,
      [`${taskId}-${field}`]: value
    }));

    // Clear existing timeout
    if (updateTimeouts.current[`${taskId}-${field}`]) {
      clearTimeout(updateTimeouts.current[`${taskId}-${field}`]);
    }

    // Set new timeout to update database
    updateTimeouts.current[`${taskId}-${field}`] = setTimeout(() => {
      onUpdate(taskId, { [field]: value });
      delete updateTimeouts.current[`${taskId}-${field}`];
    }, 500); // Wait 500ms after user stops typing
  }, [onUpdate]);

  // Immediate update for dropdowns and checkboxes
  const immediateUpdate = useCallback((taskId, updates) => {
    onUpdate(taskId, updates);
  }, [onUpdate]);

  const TableHeader = ({ label }) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 sticky top-0">
      {label}
    </th>
  );

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-10 px-4 py-3 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700"></th>
              <TableHeader label="Task" />
              <TableHeader label="Due Date" />
              <TableHeader label="Priority" />
              <TableHeader label="Status" />
              <TableHeader label="Category" />
              <TableHeader label="Note" />
              <th className="w-10 px-4 py-3 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {/* Quick Add Row */}
            <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <td className="px-4 py-2 text-center">
                <Plus className="w-4 h-4 text-gray-400" />
              </td>
              <td className="px-4 py-2" colSpan={6}>
                <Input 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={handleQuickAdd}
                  placeholder="Add a new task... (Press Enter)"
                  className="border-none bg-transparent h-8 focus-visible:ring-0 placeholder:text-gray-400 italic"
                />
              </td>
              <td></td>
            </tr>

            {/* Tasks */}
            {tasks.map((task) => {
              const isDone = task.status === 'Done';
              const isOverdue = !isDone && task.due_date && task.due_date < today;
              const isToday = !isDone && task.due_date === today;
              
              const PriorityDot = ({ priority }) => (
                <div className={`w-3 h-3 rounded-full ${PRIORITIES[priority]?.color || 'bg-gray-300'} shadow-sm`} />
              );

              const StatusIcon = STATUSES[task.status]?.icon || Circle;

              return (
                <tr 
                  key={task.id}
                  className={cn(
                    "border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                    isDone && "bg-gray-50 dark:bg-gray-800/50"
                  )}
                >
                  {/* Checkbox */}
                  <td className="px-4 py-3 text-center">
                    <Checkbox 
                      checked={isDone}
                      onCheckedChange={(checked) => immediateUpdate(task.id, { status: checked ? 'Done' : 'Not Started' })}
                      className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    />
                  </td>

                  {/* Task Title */}
                  <td className="px-4 py-3">
                    <Input
                      value={editingValues[`${task.id}-title`] ?? task.title}
                      onChange={(e) => debouncedUpdate(task.id, 'title', e.target.value)}
                      className={cn(
                        "border-none bg-transparent h-8 p-0 focus-visible:ring-0",
                        isDone && "line-through text-gray-400"
                      )}
                    />
                  </td>

                  {/* Due Date */}
                  <td className="px-4 py-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className={cn(
                            "h-8 w-full justify-start px-2 text-sm font-normal",
                            isOverdue && "bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 dark:bg-red-900/30 dark:text-red-400",
                            isToday && "bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 dark:bg-green-900/30 dark:text-green-400",
                            !isOverdue && !isToday && "text-gray-500"
                          )}
                        >
                          {task.due_date ? format(new Date(task.due_date), 'dd.MM.yyyy') : 'Set Date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={task.due_date ? new Date(task.due_date) : undefined}
                          onSelect={(date) => immediateUpdate(task.id, { due_date: date ? format(date, 'yyyy-MM-dd') : null })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </td>

                  {/* Priority */}
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-full justify-start px-2 gap-2 font-normal">
                          <PriorityDot priority={task.priority} />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{task.priority}</span>
                          <ChevronDown className="w-3 h-3 ml-auto opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {Object.keys(PRIORITIES).map(p => (
                          <DropdownMenuItem key={p} onClick={() => immediateUpdate(task.id, { priority: p })}>
                            <PriorityDot priority={p} />
                            <span className="ml-2">{p}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-full justify-start px-2 gap-2 font-normal">
                          <StatusIcon className={cn("w-4 h-4", STATUSES[task.status]?.color)} />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{task.status}</span>
                          <ChevronDown className="w-3 h-3 ml-auto opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {Object.keys(STATUSES).map(s => {
                          const SIcon = STATUSES[s].icon;
                          return (
                            <DropdownMenuItem key={s} onClick={() => immediateUpdate(task.id, { status: s })}>
                              <SIcon className={cn("w-4 h-4 mr-2", STATUSES[s].color)} />
                              <span>{s}</span>
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3">
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-full justify-start px-2 gap-2 font-normal">
                          <span className="truncate text-sm text-gray-600 dark:text-gray-300">{task.category}</span>
                          <ChevronDown className="w-3 h-3 ml-auto opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        {categories.map(cat => (
                          <DropdownMenuItem key={cat.id} onClick={() => immediateUpdate(task.id, { category: cat.name })}>
                            {cat.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>

                  {/* Note */}
                  <td className="px-4 py-3">
                    <Input
                      value={editingValues[`${task.id}-description`] ?? task.description ?? ''}
                      onChange={(e) => debouncedUpdate(task.id, 'description', e.target.value)}
                      className="border-none bg-transparent h-8 p-0 focus-visible:ring-0 text-gray-500"
                      placeholder="Add note..."
                    />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-gray-400 hover:text-red-500"
                      onClick={() => onDelete(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}