import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  color?: 'gray' | 'blue' | 'green' | 'red' | 'yellow';
  key?: React.Key;
}

export const Badge = React.memo(({ children, color = 'gray', ...props }: BadgeProps) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    yellow: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium max-w-full ${colors[color]}`} {...props}>
      <span className="truncate">{children}</span>
    </span>
  );
});

Badge.displayName = 'Badge';

