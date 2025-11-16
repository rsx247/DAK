import { useState, useEffect } from 'react';
import { getTimelinePosition } from '../../utils/time';

interface CurrentTimeLineProps {
  windowStart: Date;
  windowEnd: Date;
}

export function CurrentTimeLine({ windowStart, windowEnd }: CurrentTimeLineProps) {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      const now = new Date();
      const pos = getTimelinePosition(now, windowStart, windowEnd);
      setPosition(pos);
    };

    // Update immediately
    updatePosition();

    // Update every minute
    const interval = setInterval(updatePosition, 60000);

    return () => clearInterval(interval);
  }, [windowStart, windowEnd]);

  // Don't render if current time is outside the window
  if (position < 0 || position > 100) {
    return null;
  }

  return (
    <div
      className="absolute top-0 bottom-0 w-1 bg-redLine z-10 pointer-events-none animate-pulse-slow"
      style={{ left: `${position}%` }}
    >
      {/* Arrow at top */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-redLine" />
      
      {/* Current time label */}
      <div className="absolute top-0 left-2 bg-redLine text-white text-xs font-bold px-2 py-1 rounded-r whitespace-nowrap">
        NU
      </div>
    </div>
  );
}





