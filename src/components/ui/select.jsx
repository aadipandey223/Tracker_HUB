import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const Select = ({ children, value, onValueChange, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
  const selectRef = useRef(null);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={selectRef}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { 
          value: selectedValue, 
          onValueChange: handleValueChange, 
          isOpen, 
          setIsOpen 
        })
      )}
    </div>
  );
};

export const SelectTrigger = ({ children, className = '', isOpen, setIsOpen, value }) => {
  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className}`}
    >
      {children}
      <ChevronDown className={`h-4 w-4 opacity-50 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );
};

export const SelectValue = ({ value, placeholder = "Select...", children }) => {
  const displayValue = children || value || placeholder;
  return <span className={value ? '' : 'text-gray-500'}>{displayValue}</span>;
};

export const SelectContent = ({ children, isOpen, setIsOpen, onValueChange, value }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-gray-300 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800 max-h-60 overflow-auto">
      {React.Children.map(children, child =>
        React.cloneElement(child, { onValueChange, setIsOpen, selectedValue: value })
      )}
    </div>
  );
};

export const SelectItem = ({ children, value, onValueChange, setIsOpen, selectedValue }) => {
  const isSelected = selectedValue === value;
  
  return (
    <button
      type="button"
      onClick={() => {
        onValueChange(value);
        setIsOpen(false);
      }}
      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between transition-colors ${
        isSelected ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : ''
      }`}
    >
      <span>{children}</span>
      {isSelected && <Check className="h-4 w-4" />}
    </button>
  );
};