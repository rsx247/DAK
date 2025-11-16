export function LoadingSkeleton() {
  return (
    <div className="flex-1 flex overflow-hidden bg-background">
      {/* Venue Sidebar Skeleton */}
      <div className="w-48 md:w-64 flex-shrink-0 border-r border-gray-300 bg-white overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-300 p-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-3 border-b border-gray-200">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
        ))}
      </div>

      {/* Timeline Skeleton */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <div className="min-w-[800px]">
          {/* Time Header Skeleton */}
          <div className="sticky top-0 bg-white border-b border-gray-300 z-30">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="h-12 relative flex">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 flex items-center border-l border-gray-200 px-2"
                  style={{ left: `${i * 12.5}%` }}
                >
                  <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Event Lanes Skeleton */}
          <div className="relative">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className={`h-24 border-b border-gray-200 relative ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}
              >
                {/* Event blocks skeleton */}
                <div className="absolute top-2 left-1/4 w-32 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="absolute top-2 left-3/4 w-24 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}





