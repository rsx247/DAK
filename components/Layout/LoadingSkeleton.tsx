
import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="flex-grow flex animate-pulse">
      {/* Desktop Sidebar Skeleton */}
      <aside className="hidden md:block w-64 border-r border-gray-200 bg-gray-50 p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-100 p-3 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </aside>
      {/* Timeline Skeleton */}
      <div className="flex-grow p-4">
        <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  );
};
