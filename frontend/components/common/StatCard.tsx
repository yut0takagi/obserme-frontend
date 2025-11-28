import React from 'react';
import { Card } from '../ui';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconColor?: 'blue' | 'emerald' | 'purple' | 'amber' | 'red' | 'indigo';
  className?: string;
}

const iconColorClasses = {
  blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400',
  purple: 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400',
  amber: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400',
  red: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400',
};

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  iconColor = 'indigo',
  className = '',
}) => {
  return (
    <Card className={`flex items-center space-x-4 ${className}`}>
      <div className={`p-3 rounded-full flex-shrink-0 ${iconColorClasses[iconColor]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </Card>
  );
};

