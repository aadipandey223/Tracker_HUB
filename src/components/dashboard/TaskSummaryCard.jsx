
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

export default function TaskSummaryCard({ tasks = [] }) {
  const { t } = useTranslation();
  const today = new Date().toISOString().split('T')[0];
  
  const dueToday = tasks.filter(task => task.due_date === today && task.status !== 'Done').length;
  const overdue = tasks.filter(task => task.due_date < today && task.status !== 'Done').length;
  const completed = tasks.filter(task => task.status === 'Done').length;
  const inProgress = tasks.filter(task => task.status === 'In Progress').length;
  const notStarted = tasks.filter(task => task.status === 'Not Started').length;
  
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;

  const priorityBreakdown = {
    High: tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length,
    Medium: tasks.filter(t => t.priority === 'Medium' && t.status !== 'Done').length,
    Low: tasks.filter(t => t.priority === 'Low' && t.status !== 'Done').length,
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-blue-600" />
            {t('dashboard.taskTracker')}
          </span>
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{t('dashboard.overview')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.dueToday')}</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{dueToday}</p>
          </div>
          
          <div className={`p-4 rounded-lg border ${
            overdue > 0 
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className={`w-4 h-4 ${overdue > 0 ? 'text-red-600' : 'text-gray-400'}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.overdue')}</span>
            </div>
            <p className={`text-3xl font-bold ${overdue > 0 ? 'text-red-600' : 'text-gray-400'}`}>
              {overdue}
            </p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('dashboard.statusBreakdown')}</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.completed')}</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30">
                {completed}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.inProgress')}</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30">
                {inProgress}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.notStarted')}</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-700">
                {notStarted}
              </Badge>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t('dashboard.activeByPriority')}</h4>
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{priorityBreakdown.High}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.high')}</p>
            </div>
            <div className="text-center border-x border-gray-200 dark:border-gray-700 px-6">
              <p className="text-2xl font-bold text-yellow-600">{priorityBreakdown.Medium}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.medium')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{priorityBreakdown.Low}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard.low')}</p>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.completionRate')}</span>
            <span className="text-2xl font-bold text-blue-600">{completionRate.toFixed(0)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}