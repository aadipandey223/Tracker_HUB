import { useState, useCallback, useRef } from 'react';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './datepicker-custom.css';
import {
  CheckSquare, Square, AlertCircle,
  Briefcase, DollarSign, Users, BookOpen, Home, Activity,
  MoreHorizontal, Plus, Trash2, Edit2, ChevronDown, ChevronUp, Calendar as CalendarIcon
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

  const handleQuickAddClick = () => {
    if (newTaskTitle.trim()) {
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

  const TableHeader = ({ label }) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 sticky top-0">
      {label}
    </th>
  );

  const PriorityDot = ({ priority }) => (
    <div className={`w-3 h-3 rounded-full ${PRIORITIES[priority]?.color || 'bg-gray-300'} shadow-sm`} />
  );

  return (
    <div className="space-y-4">
      {/* Mobile Card View (Visible on small screens) */}
      <div className="md:hidden space-y-4">
        {/* Quick Add Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm sticky top-16 z-20">
          <div className="flex gap-2">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleQuickAdd}
              placeholder="Add task..."
              className="flex-1"
            />
            <Button onClick={handleQuickAddClick} size="icon" className="shrink-0 bg-orange-500 hover:bg-orange-600">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Task Cards */}
        <div className="space-y-4 pb-20">
          {tasks.map((task) => {
            const isDone = task.status === 'Done';
            const isOverdue = !isDone && task.due_date && task.due_date < today;
            const isToday = !isDone && task.due_date === today;

            // Get priority color for border gradient
            const priorityColor = task.priority === 'High' ? 'from-red-500' :
              task.priority === 'Medium' ? 'from-yellow-500' :
                task.priority === 'Low' ? 'from-blue-500' : 'from-gray-400';

            return (
              <div key={task.id} className={cn(
                "relative bg-white dark:bg-gray-700 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-2",
                isDone && "opacity-60 border-gray-200 dark:border-gray-600",
                !isDone && "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              )}>
                {/* Priority Accent Bar */}
                <div className={cn(
                  "absolute top-0 left-0 right-0 h-2 bg-gradient-to-r to-transparent",
                  priorityColor
                )} />

                <div className="p-5">
                  {/* Header Section */}
                  <div className="flex items-start gap-3 mb-4">
                    <Checkbox
                      checked={isDone}
                      onCheckedChange={(checked) => immediateUpdate(task.id, { status: checked ? 'Done' : 'Not Started' })}
                      className="mt-0.5 h-5 w-5 rounded-md data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-green-500 data-[state=checked]:to-green-600 data-[state=checked]:border-green-500 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <Input
                        value={editingValues[`${task.id}-title`] ?? task.title}
                        onChange={(e) => debouncedUpdate(task.id, 'title', e.target.value)}
                        className={cn(
                          "border-none bg-transparent h-auto p-0 text-base font-semibold focus-visible:ring-0 mb-2 text-gray-900 dark:text-white",
                          isDone && "line-through text-gray-400"
                        )}
                      />

                      {/* Badges Row */}
                      <div className="flex flex-wrap gap-2">
                        {/* Priority Badge */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div className={cn(
                              "px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 font-bold text-xs border-2 shadow-md",
                              task.priority === 'High' && "bg-[#FF5555] hover:bg-[#FF7777] text-white border-[#FF3333]",
                              task.priority === 'Medium' && "bg-[#FFD700] hover:bg-[#FFE44D] text-gray-900 border-[#FFC700]",
                              task.priority === 'Low' && "bg-[#5599FF] hover:bg-[#77AAFF] text-white border-[#3377FF]",
                              task.priority === 'Optional' && "bg-[#AAAAAA] hover:bg-[#CCCCCC] text-white border-[#999999]"
                            )}>
                              <div className="w-2 h-2 rounded-full bg-white" />
                              {task.priority}
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {Object.keys(PRIORITIES).map(p => (
                              <DropdownMenuItem key={p} onClick={() => immediateUpdate(task.id, { priority: p })}>
                                <div className={`w-2.5 h-2.5 rounded-full mr-2 ${PRIORITIES[p]?.color}`} />
                                {p}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Category Badge */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <div className="px-2.5 py-1.5 rounded-lg bg-[#AA66FF] hover:bg-[#BB88FF] border-2 border-[#9955EE] flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all shadow-md">
                              <Briefcase className="w-3.5 h-3.5 text-white" />
                              <span className="text-xs font-bold text-white">{task.category}</span>
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {categories.map(cat => (
                              <DropdownMenuItem key={cat.id} onClick={() => immediateUpdate(task.id, { category: cat.name })}>
                                {cat.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  {/* Footer Section */}
                  <div className="flex items-center justify-between gap-3 pt-4 border-t-2 border-gray-200 dark:border-gray-600">
                    {/* Date Badge */}
                    <DatePicker
                      selected={task.due_date ? new Date(task.due_date) : null}
                      onChange={(date) => immediateUpdate(task.id, { due_date: date ? format(date, 'yyyy-MM-dd') : null })}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      withPortal
                      portalId="root-portal"
                      customInput={
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-8 px-3 rounded-lg font-bold text-xs transition-all hover:scale-105 border-2 flex items-center gap-1.5 shadow-md",
                            isOverdue && "bg-[#FF5555] hover:bg-[#FF7777] text-white border-[#FF3333]",
                            isToday && "bg-[#55DD55] hover:bg-[#77EE77] text-white border-[#33CC33]",
                            !isOverdue && !isToday && "bg-[#7788AA] hover:bg-[#99AACC] text-white border-[#6677AA]"
                          )}
                        >
                          <CalendarIcon className="w-3.5 h-3.5" />
                          {task.due_date ? format(new Date(task.due_date), 'MMM dd') : 'Set Date'}
                        </Button>
                      }
                      dateFormat="MMM dd, yyyy"
                      popperClassName="z-50"
                    />

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg bg-[#FF5555] text-white hover:bg-[#FF3333] hover:scale-105 transition-all border-2 border-[#FF3333] shadow-md"
                      onClick={() => onDelete(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Table View (Hidden on small screens) */}
      <div className="hidden md:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
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
                  <div className="flex gap-2 items-center">
                    <Input
                      id="add-task-btn"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={handleQuickAdd}
                      placeholder="Add a new task... (Press Enter)"
                      className="border-none bg-transparent h-8 focus-visible:ring-0 placeholder:text-gray-400 italic"
                    />
                    <Button onClick={handleQuickAddClick} size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Plus className="w-4 h-4 text-orange-500" />
                    </Button>
                  </div>
                </td>
                <td></td>
              </tr>

              {/* Tasks */}
              {tasks.map((task) => {
                const isDone = task.status === 'Done';
                const isOverdue = !isDone && task.due_date && task.due_date < today;
                const isToday = !isDone && task.due_date === today;

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
    </div>
  );
}