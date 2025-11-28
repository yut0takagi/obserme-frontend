import React from 'react';

interface SectionHeaderProps {
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  action,
  className = '',
}) => {
  return (
    <div className={`flex justify-between items-center mb-4 sm:mb-6 ${className}`}>
      {typeof title === 'string' ? (
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
      ) : (
        <div className="text-lg font-bold text-gray-800 dark:text-white">{title}</div>
      )}
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

