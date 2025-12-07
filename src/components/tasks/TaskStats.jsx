
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

export default function TaskStats({ tasks }) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const totalTasks = tasks.length;
  
  const tasksToday = tasks.filter(t => t.due_date === todayStr).length;
  
  const overdue = tasks.filter(t => {
    if (!t.due_date || t.status === 'Done' || t.status === 'Canceled') return false;
    return t.due_date < todayStr;
  }).length;

  const completed = tasks.filter(t => t.status === 'Done').length;
  const notCompleted = tasks.filter(t => t.status !== 'Done' && t.status !== 'Canceled').length;

  return (
    <Card className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm mb-6">
      <CardContent className="p-0">
        <div className="grid grid-cols-2 md:grid-cols-6 divide-x divide-gray-300 dark:divide-gray-600">
          {/* Date */}
          <div className="p-4 flex flex-col items-center justify-center bg-gray-200/50 dark:bg-gray-800/50">
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Date</span>
            <span className="text-lg font-bold text-gray-700 dark:text-gray-200">
              {format(today, 'MM/dd/yyyy')}
            </span>
          </div>

          {/* Title */}
          <div className="p-4 flex items-center justify-center md:col-span-1 bg-gray-100 dark:bg-gray-800">
            <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight uppercase">Task List</h2>
          </div>

          {/* Today */}
          <div className="p-4 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Today</span>
            <div className="w-full bg-green-200 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded py-1 text-center font-bold">
              {tasksToday}
            </div>
          </div>

          {/* Total Tasks */}
          <div className="p-4 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Tasks</span>
            <span className="text-xl font-bold text-gray-700 dark:text-gray-200">{totalTasks}</span>
          </div>

          {/* Overdue */}
          <div className="p-4 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Overdue</span>
            <div className="w-full bg-red-200 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded py-1 text-center font-bold">
              {overdue}
            </div>
          </div>

          {/* Completion Stats */}
          <div className="p-4 flex flex-col items-center justify-center">
            <div className="flex w-full justify-between text-xs text-gray-500 dark:text-gray-400 mb-1 px-1">
              <span>Not Completed</span>
              <span>Completed</span>
            </div>
            <div className="flex w-full justify-between font-bold px-4">
              <span className="text-gray-700 dark:text-gray-300">{notCompleted}</span>
              <span className="text-gray-700 dark:text-gray-300">{completed}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}