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
    <div className={`rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${color} backdrop-blur-sm bg-opacity-80 dark:bg-opacity-40`}>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{description}</p>
          </div>
          <div className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-md backdrop-blur-sm">
            {icon}
          </div>
        </div>

        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            {actionLabel} →
          </button>
        )}
      </div>
    </div>
  );
};