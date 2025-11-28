import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  type?: string;
  defaultValue?: string | number | readonly string[];
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const Input = React.memo(({ label, className = '', ...props }: InputProps) => (
  <div className="w-full min-w-0">
    {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 truncate">{label}</label>}
    <input 
      className={`appearance-none block w-full min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm ${className}`} 
      {...props} 
    />
  </div>
));

Input.displayName = 'Input';

