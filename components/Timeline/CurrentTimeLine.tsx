
import React from 'react';

interface CurrentTimeLineProps {
  currentTime: Date;
  minutesToPosition: (minutes: number) => number;
  offsetLeft: number;
}

export const CurrentTimeLine: React.FC<CurrentTimeLineProps> = ({ currentTime, minutesToPosition, offsetLeft }) => {
  const currentMinutes = currentTime.getUTCHours() * 60 + currentTime.getUTCMinutes();
  const position = minutesToPosition(currentMinutes);

  return (
    <div className="absolute top-0 bottom-0" style={{ left: `${offsetLeft + position}px` }}>
      <div className="w-0.5 h-full bg-accent"></div>
    </div>
  );
};
