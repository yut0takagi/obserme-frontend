import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
  // Fix: Added key to allow Card usage in lists without TypeScript errors
  key?: React.Key;
}

export const Card = React.memo(({ children, className = '', ...props }: CardProps) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 overflow-hidden ${className}`} {...props}>
    {children}
  </div>
));

Card.displayName = 'Card';

