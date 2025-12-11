import { useMemo, useCallback, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Save } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { sanitizeInput, sanitizeNumber } from '@/utils/sanitize';

function EditableTable({ title, columns, type, data = [], onDataChange }) {
  const { formatCurrency } = useSettings();
  const [localData, setLocalData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);

  // Sync local data when prop data changes (e.g., month navigation)
  useMemo(() => {
    setLocalData(data);
  }, [data]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (window.autoSaveTimeout) {
        clearTimeout(window.autoSaveTimeout);
      }
    };
  }, []);

  const notifyDataChange = useCallback((newRows) => {
    if (onDataChange) {
      onDataChange(newRows);
    }
  }, [onDataChange]);

  const addRow = () => {
    const newRows = [
      ...localData,
      {
        id: Math.random().toString(36).substr(2, 9),
        col1: '',
        col2: '',
        col3: '',
        editable: true,
      },
    ];
    setLocalData(newRows);
    notifyDataChange(newRows);
  };

  const deleteRow = (id) => {
    if (window.confirm('Delete this row?')) {
      const newRows = localData.filter((row) => row.id !== id);
      setLocalData(newRows);
      notifyDataChange(newRows);
    }
  };

  const updateCellLocal = (id, field, value) => {
    // Update local state immediately for responsive UI
    const newRows = localData.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setLocalData(newRows);
    
    // Auto-save after a short delay for better performance
    clearTimeout(window.autoSaveTimeout);
    setIsSaving(true);
    window.autoSaveTimeout = setTimeout(() => {
      notifyDataChange(newRows);
      setIsSaving(false);
    }, 500);
  };

  const saveCellValue = (id, field, value) => {
    // Clear any pending auto-save
    clearTimeout(window.autoSaveTimeout);
    setIsSaving(true);
    
    // Sanitize input before saving
    let sanitizedValue = value;
    if (field === 'col1') {
      // Sanitize text input
      sanitizedValue = sanitizeInput(value);
    } else if (field === 'col2' || field === 'col3') {
      // For numbers, keep the raw value if it's valid
      if (value === '' || value === null || value === undefined) {
        sanitizedValue = '';
      } else {
        const numValue = parseFloat(value);
        sanitizedValue = isNaN(numValue) ? '' : numValue;
      }
    }
    
    // Update local state with sanitized value
    const newRows = localData.map((row) =>
      row.id === id ? { ...row, [field]: sanitizedValue } : row
    );
    setLocalData(newRows);
    
    // Save to parent (and localStorage) immediately on blur
    notifyDataChange(newRows);
    
    // Show saved indicator briefly
    setTimeout(() => setIsSaving(false), 200);
  };

  const calculatedRows = useMemo(() => {
    return localData.map((row) => {
      const planned = parseFloat(row.col2) || 0;
      const actual = parseFloat(row.col3) || 0;

      if (type === 'debt') {
        const outstanding = planned - actual;
        const progress = planned > 0 ? (actual / planned) * 100 : 0;
        return {
          ...row,
          variance: outstanding,
          variancePercent: progress,
        };
      } else {
        const variance = actual - planned;
        const variancePercent = planned > 0 ? (variance / planned) * 100 : 0;
        return {
          ...row,
          variance,
          variancePercent,
        };
      }
    });
  }, [localData, type]);

  const getVarianceColor = (variance, percent) => {
    if (type === 'expense') {
      if (percent <= 0) return 'text-green-600 dark:text-green-400'; // Under budget
      if (percent <= 20) return 'text-yellow-600 dark:text-yellow-400'; // Near budget
      return 'text-red-600 dark:text-red-400'; // Over budget
    } else if (type === 'income') {
      if (percent >= 0) return 'text-green-600 dark:text-green-400'; // Over target
      if (percent >= -20) return 'text-yellow-600 dark:text-yellow-400'; // Near target
      return 'text-red-600 dark:text-red-400'; // Under target
    } else if (type === 'debt') {
      if (percent >= 80) return 'text-green-600 dark:text-green-400'; // Almost paid
      if (percent >= 50) return 'text-yellow-600 dark:text-yellow-400'; // Half paid
      return 'text-red-600 dark:text-red-400'; // Low progress
    }
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <Card id={`table-${type}`} className="bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>{title}</CardTitle>
          {isSaving && (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <Save className="w-3 h-3 animate-pulse" />
              <span>Saving...</span>
            </div>
          )}
        </div>
        <Button
          onClick={addRow}
          className="gap-2 bg-green-600 hover:bg-green-700"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          Add Row
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400"
                  >
                    {col}
                  </th>
                ))}
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400 w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {calculatedRows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={row.col1}
                      onChange={(e) => updateCellLocal(row.id, 'col1', e.target.value)}
                      onBlur={(e) => saveCellValue(row.id, 'col1', e.target.value)}
                      className="w-full bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1"
                      placeholder={columns[0]}
                      disabled={!row.editable && row.editable !== undefined}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={row.col2}
                      onChange={(e) => updateCellLocal(row.id, 'col2', e.target.value)}
                      onBlur={(e) => saveCellValue(row.id, 'col2', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.target.blur();
                        }
                      }}
                      className="w-full bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1"
                      disabled={type === 'debt' && !row.editable && row.editable !== undefined}
                      placeholder="0"
                      step="any"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={row.col3}
                      onChange={(e) => updateCellLocal(row.id, 'col3', e.target.value)}
                      onBlur={(e) => saveCellValue(row.id, 'col3', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.target.blur();
                        }
                      }}
                      className="w-full bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-2 py-1"
                      disabled={type === 'debt' && !row.editable && row.editable !== undefined}
                      placeholder="0"
                      step="any"
                    />
                  </td>
                  <td className={`py-3 px-4 font-medium ${getVarianceColor(row.variance, row.variancePercent)}`}>
                    {formatCurrency(row.variance)}
                  </td>
                  <td className={`py-3 px-4 font-medium ${getVarianceColor(row.variance, row.variancePercent)}`}>
                    {type === 'debt'
                      ? `${row.variancePercent.toFixed(1)}%`
                      : `${row.variancePercent >= 0 ? '+' : ''}${row.variancePercent.toFixed(1)}%`
                    }
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRow(row.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {calculatedRows.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="py-8 text-center text-gray-500">
                    No data. Click "Add Row" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default EditableTable;
