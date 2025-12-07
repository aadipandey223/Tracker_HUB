export default function TaskProgressBar({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Done').length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex items-center gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <span className="font-bold text-gray-700 dark:text-gray-200 min-w-[3rem] text-right">
        {percentage}%
      </span>
      <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-400 transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}