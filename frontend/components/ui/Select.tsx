import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  className?: string;
  options: { value: string; label: string }[];
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

export const Select = React.memo(({ label, className = '', options, ...props }: SelectProps) => (
  <div className="w-full min-w-0">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 truncate">{label}</label>}
    <select
      className={`block w-full min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm truncate ${className}`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="truncate">{opt.label}</option>
      ))}
    </select>
  </div>
));

Select.displayName = 'Select';

