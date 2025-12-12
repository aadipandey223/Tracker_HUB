
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

export default function TaskFilters({ filters, onFilterChange, categories }) {
  const activeFilterCount = Object.values(filters).filter(v => v !== 'all').length;

  const clearFilters = () => {
    onFilterChange({ priority: 'all', status: 'all', category: 'all' });
  };

  return (
    <div id="task-filters" className="flex items-center gap-2 mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 border-dashed">
            <Filter className="w-4 h-4" />
            Filter Tasks
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          {['High', 'Medium', 'Low', 'Optional'].map(p => (
            <DropdownMenuItem
              key={p}
              onClick={() => onFilterChange({ ...filters, priority: p })}
              className={filters.priority === p ? 'bg-accent' : ''}
            >
              {p}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Status</DropdownMenuLabel>
          {['Not Started', 'In Progress', 'Done'].map(s => (
            <DropdownMenuItem
              key={s}
              onClick={() => onFilterChange({ ...filters, status: s })}
              className={filters.status === s ? 'bg-accent' : ''}
            >
              {s}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Category</DropdownMenuLabel>
          {categories.map(c => (
            <DropdownMenuItem
              key={c.id}
              onClick={() => onFilterChange({ ...filters, category: c.name })}
              className={filters.category === c.name ? 'bg-accent' : ''}
            >
              {c.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {activeFilterCount > 0 && (
        <div className="flex gap-2 items-center">
          {filters.priority !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Priority: {filters.priority}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onFilterChange({ ...filters, priority: 'all' })} />
            </Badge>
          )}
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onFilterChange({ ...filters, status: 'all' })} />
            </Badge>
          )}
          {filters.category !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Category: {filters.category}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onFilterChange({ ...filters, category: 'all' })} />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7">
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}