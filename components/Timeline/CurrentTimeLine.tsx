
import React from 'react';

interface CurrentTimeLineProps {
  currentTime: Date;
  minutesToPosition: (minutes: number) => number;
}

export const CurrentTimeLine: React.FC<CurrentTimeLineProps> = ({ currentTime, minutesToPosition }) => {
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const position = minutesToPosition(currentMinutes);

  return (
    <div className="absolute top-0 bottom-0 z-10" style={{ left: `${position}px` }}>
      <div className="w-0.5 h-full bg-accent"></div>
      <div className="absolute top-2 -ml-4">
        <div className="bg-accent text-white text-xs font-bold px-2 py-0.5 rounded-md">
          NU
        </div>
      </div>
    </div>
  );
};