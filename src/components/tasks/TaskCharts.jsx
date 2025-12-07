
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = {
  Priority: {
    High: '#ef4444', // red
    Medium: '#eab308', // yellow
    Low: '#3b82f6', // blue
    Optional: '#d1d5db', // gray
  },
  Status: {
    'Not Started': '#f59e0b', // amber
    'In Progress': '#facc15', // yellow
    'Done': '#22c55e', // green
    'Canceled': '#ef4444', // red
  },
  Category: [
    '#818cf8', '#f472b6', '#34d399', '#fbbf24', '#60a5fa', '#a78bfa', '#f87171', '#fb923c'
  ]
};

export default function TaskCharts({ tasks }) {
  // Priority Data
  const priorityData = Object.keys(COLORS.Priority).map(priority => ({
    name: priority,
    value: tasks.filter(t => t.priority === priority).length,
    color: COLORS.Priority[priority]
  })).filter(d => d.value > 0);

  // Status Data
  const statusData = Object.keys(COLORS.Status).map(status => ({
    name: status,
    value: tasks.filter(t => t.status === status).length,
    color: COLORS.Status[status]
  })).filter(d => d.value > 0);

  // Category Data
  const categoryCount = {};
  tasks.forEach(t => {
    const cat = t.category || 'Uncategorized';
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  
  const categoryData = Object.keys(categoryCount).map((cat, index) => ({
    name: cat,
    value: categoryCount[cat],
    color: COLORS.Category[index % COLORS.Category.length]
  }));

  const ChartCard = ({ title, data, colors, type }) => (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-3">
        <CardTitle className="text-center text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={type === 'Category' ? entry.color : colors[entry.name]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend 
              verticalAlign="middle" 
              align="right"
              layout="vertical"
              iconType="circle"
              formatter={(value) => <span className="text-xs text-gray-600 dark:text-gray-300 ml-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <ChartCard title="Priority" data={priorityData} colors={COLORS.Priority} />
      <ChartCard title="Status" data={statusData} colors={COLORS.Status} />
      <ChartCard title="Category" data={categoryData} type="Category" />
    </div>
  );
}