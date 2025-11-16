import { VenueWithDistance } from '../../types';
import { formatDistance } from '../../utils/distance';

interface VenueCardProps {
  venue: VenueWithDistance;
  onClick: () => void;
}

const categoryColors: Record<string, string> = {
  COMMUNITY: 'border-community bg-community/10',
  RELIGIOUS: 'border-religious bg-religious/10',
  FOOD_BANK: 'border-foodBank bg-foodBank/10',
  FOOD_RESCUE: 'border-foodRescue bg-foodRescue/10',
  COMMERCIAL: 'border-commercial bg-commercial/10',
};

const categoryIcons: Record<string, string> = {
  COMMUNITY: '🏘️',
  RELIGIOUS: '⛪',
  FOOD_BANK: '📦',
  FOOD_RESCUE: '♻️',
  COMMERCIAL: '🏪',
};

export function VenueCard({ venue, onClick }: VenueCardProps) {
  const colorClass = categoryColors[venue.category] || 'border-gray-300 bg-gray-50';
  const icon = categoryIcons[venue.category] || '📍';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 border-l-4 ${colorClass} hover:bg-opacity-20 transition-colors cursor-pointer`}
    >
      <div className="flex items-start gap-2">
        <div className="text-2xl flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-text truncate">
            {venue.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-medium text-primary">
              📍 {formatDistance(venue.distance)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}


