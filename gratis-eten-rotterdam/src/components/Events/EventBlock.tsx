import { FoodEventWithDistance } from '../../types';
import { formatTimeRange, isHappeningNow, isPast, isUpcoming } from '../../utils/time';

interface EventBlockProps {
  event: FoodEventWithDistance;
  onClick: () => void;
  style: React.CSSProperties;
}

const dietaryIcons: Record<string, string> = {
  'halal': '☪️',
  'vegan': '🌱',
  'vegan-option': '🌱',
  'vegetarian': '🥬',
  'vegetarian-option': '🥬',
  'gluten-free': '🌾',
  'nut-free': '🥜',
};

export function EventBlock({ event, onClick, style }: EventBlockProps) {
  const happening = isHappeningNow(event.startTime, event.endTime);
  const past = isPast(event.endTime);
  const upcoming = isUpcoming(event.startTime);

  let statusClass = 'bg-primary/90 border-primary';
  let textClass = 'text-white';

  if (past) {
    statusClass = 'bg-gray-300 border-gray-400';
    textClass = 'text-gray-600';
  } else if (happening) {
    statusClass = 'bg-success border-success ring-2 ring-success/50';
    textClass = 'text-white';
  } else if (upcoming) {
    statusClass = 'bg-warning border-warning';
    textClass = 'text-white';
  }

  return (
    <button
      onClick={onClick}
      style={style}
      className={`absolute rounded-lg border-2 ${statusClass} ${textClass} p-2 shadow-md hover:shadow-lg transition-all cursor-pointer h-16 overflow-hidden`}
      disabled={past}
      aria-label={`${event.title} van ${formatTimeRange(event.startTime, event.endTime)} bij ${event.venue.name}`}
      title={`${event.title} - ${event.description}`}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="text-xs font-medium truncate">
          {formatTimeRange(event.startTime, event.endTime)}
        </div>
        <div className="text-sm font-bold truncate">
          {event.title}
        </div>
        {event.dietaryTags.length > 0 && (
          <div className="flex gap-1 text-xs">
            {event.dietaryTags.slice(0, 3).map(tag => (
              <span key={tag}>{dietaryIcons[tag] || tag}</span>
            ))}
          </div>
        )}
      </div>
      
      {happening && (
        <div className="absolute top-0 right-0 bg-white text-success text-xs font-bold px-1 py-0.5 rounded-bl">
          NU
        </div>
      )}
    </button>
  );
}





