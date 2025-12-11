import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {React.Children.map(children, child => 
        React.cloneElement(child, { 
          value, 
          onValueChange, 
          isOpen, 
          setIsOpen 
        })
      )}
    </div>
  );
};

export const SelectTrigger = ({ children, className = '', isOpen, setIsOpen }) => {
  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white ${className}`}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
};

export const SelectValue = ({ value }) => {
  return <span>{value}</span>;
};

export const SelectContent = ({ children, isOpen, setIsOpen, onValueChange }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40" 
        onClick={() => setIsOpen(false)}
      />
      <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-gray-300 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        {React.Children.map(children, child =>
          React.cloneElement(child, { onValueChange, setIsOpen })
        )}
      </div>
    </>
  );
};

export const SelectItem = ({ children, value, onValueChange, setIsOpen }) => {
  return (
    <button
      type="button"
      onClick={() => {
        onValueChange(value);
        setIsOpen(false);
      }}
      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      {children}
    </button>
  );
};