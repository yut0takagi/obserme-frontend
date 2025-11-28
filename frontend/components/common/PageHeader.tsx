import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  actions,
  className = '',
}) => {
  // titleがなく、descriptionとactionsもない場合は何も表示しない
  if (!title && !description && !actions) {
    return null;
  }

  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-6 flex-shrink-0 gap-4 min-w-0 ${className}`}>
      {(title || description) && (
        <div className="min-w-0 flex-1">
          {title && (
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center min-w-0">
              {Icon && (
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
              )}
              {typeof title === 'string' ? (
                <span className="truncate">{title}</span>
              ) : (
                title
              )}
            </h1>
          )}
          {description && (
            <div className={`text-sm sm:text-base text-gray-500 dark:text-gray-400 break-words ${title ? 'mt-1' : ''}`}>
              {typeof description === 'string' ? (
                <p>{description}</p>
              ) : (
                description
              )}
            </div>
          )}
        </div>
      )}
      {actions && (
        <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};

