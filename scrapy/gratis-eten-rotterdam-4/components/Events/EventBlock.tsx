import React from 'react';
import type { FoodEvent, AccessLevel } from '../../types';
import { formatTime } from '../../utils/time';

const translateAccessLevel = (level: AccessLevel): string => {
    switch (level) {
        case 'WALK_IN': return 'Vrije inloop';
        case 'REGISTRATION': return 'Registratie vereist';
        case 'REFERRAL': return 'Verwijzing nodig';
        default: return level;
    }
};

interface EventBlockProps {
  event: FoodEvent;
  onClick: (event: FoodEvent) => void;
  style: React.CSSProperties;
  stickyLeft: number;
  zoomLevel: number;
  isPast: boolean;
}

const categoryColors: Record<string, {bg: string, border: string}> = {
  RELIGIOUS: { bg: 'bg-red-50', border: 'border-red-200' },
  COMMUNITY: { bg: 'bg-green-50', border: 'border-green-200' },
  FOOD_BANK: { bg: 'bg-blue-50', border: 'border-blue-200' },
  COMMERCIAL: { bg: 'bg-purple-50', border: 'border-purple-200' },
};

export const EventBlock: React.FC<EventBlockProps> = ({ event, onClick, style, stickyLeft, zoomLevel, isPast }) => {
  const { bg, border } = categoryColors[event.venue.category] || { bg: 'bg-gray-50', border: 'border-gray-200' };
  
  const blockHeights = [24, 68]; // Heights for zoom levels 0, 1
  const blockHeight = blockHeights[zoomLevel];

  const dynamicStyle = {
    ...style,
    height: `${blockHeight}px`,
  };

  const pastClasses = isPast ? 'opacity-[.85] filter grayscale-[75%]' : '';

  if (zoomLevel === 0) { // Minimalistic view
    return (
      <div
        onClick={() => onClick(event)}
        className={`absolute top-1/2 -translate-y-1/2 rounded-md cursor-pointer transition-transform hover:scale-105 shadow-sm ${bg} ${border} border overflow-hidden ${pastClasses}`}
        style={dynamicStyle}
        title={`${event.title} (${formatTime(event.startTime)} - ${formatTime(event.endTime)})`}
      >
        <div
          className="h-full px-2 flex items-center"
          style={{
            position: 'sticky',
            left: `${stickyLeft}px`,
          }}
        >
          <p className="font-semibold text-xs text-text-primary truncate">{event.title}</p>
        </div>
      </div>
    );
  }

  // Default view
  const titleSize = 'text-sm';
  const detailSize = 'text-xs';

  return (
    <div
      onClick={() => onClick(event)}
      className={`absolute top-1/2 -translate-y-1/2 rounded-lg cursor-pointer transition-transform hover:scale-105 shadow-sm ${bg} ${border} border overflow-hidden ${pastClasses}`}
      style={dynamicStyle}
    >
      <div
        className="h-full p-2 flex flex-col justify-center"
        style={{
          position: 'sticky',
          left: `${stickyLeft}px`,
        }}
      >
        <p className={`font-semibold text-text-primary truncate ${titleSize}`}>{event.title}</p>
        <p className={`text-text-secondary truncate ${detailSize}`}>
          {formatTime(event.startTime)} - {formatTime(event.endTime)}
        </p>
        <p className={`text-text-secondary truncate ${detailSize}`}>{event.cost} &bull; {translateAccessLevel(event.accessLevel)}</p>
      </div>
    </div>
  );
};