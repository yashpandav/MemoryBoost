import React from 'react';

export const StatsCard = ({
  title,
  value,
  icon,
  description,
  actionLabel,
  onAction,
  color
}) => {
  return (
    <div className={`rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow ${color}`}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
          </div>
          <div className="p-2 rounded-full bg-white dark:bg-gray-800 shadow">
            {icon}
          </div>
        </div>
        
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="mt-3 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            {actionLabel} →
          </button>
        )}
      </div>
    </div>
  );
};