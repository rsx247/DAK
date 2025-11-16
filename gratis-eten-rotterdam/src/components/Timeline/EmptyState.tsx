import { FoodEventWithDistance } from '../../types';
import { formatTime } from '../../utils/time';
import { formatDistance } from '../../utils/distance';

interface EmptyStateProps {
  reason: 'NO_EVENTS_IN_TIME' | 'NO_EVENTS_IN_DISTANCE';
  nearestEvent?: FoodEventWithDistance;
  onScrollToNearest?: () => void;
  onExpandDistance?: () => void;
}

export function EmptyState({ reason, nearestEvent, onScrollToNearest, onExpandDistance }: EmptyStateProps) {
  if (reason === 'NO_EVENTS_IN_TIME' && nearestEvent) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="text-gray-600 mb-4">
          <p className="text-lg font-medium">Geen gratis eten beschikbaar in deze tijdsperiode</p>
        </div>
        
        <div className="bg-white border-2 border-primary rounded-lg p-4 max-w-md">
          <p className="text-sm text-gray-600 mb-2">Volgend beschikbaar:</p>
          <div className="flex items-center justify-between gap-4">
            <div className="text-left">
              <p className="font-bold text-text">
                {formatTime(nearestEvent.startTime)} - {nearestEvent.venue.name}
              </p>
              <p className="text-sm text-gray-600">{nearestEvent.title}</p>
              <p className="text-xs text-primary font-medium">
                📍 {formatDistance(nearestEvent.venue.distance)}
              </p>
            </div>
            <button
              onClick={onScrollToNearest}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 animate-bounce-x"
            >
              <span>→</span>
            </button>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          Klik op de pijl om naar dit tijdslot te scrollen
        </p>
      </div>
    );
  }

  if (reason === 'NO_EVENTS_IN_DISTANCE' && nearestEvent) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="text-gray-600 mb-4">
          <p className="text-lg font-medium">Geen gratis eten binnen de geselecteerde afstand</p>
        </div>
        
        <div className="bg-white border-2 border-warning rounded-lg p-4 max-w-md">
          <p className="text-sm text-gray-600 mb-2">Dichtstbijzijnde:</p>
          <div className="flex items-center justify-between gap-4">
            <div className="text-left">
              <p className="font-bold text-text">{nearestEvent.venue.name}</p>
              <p className="text-sm text-gray-600">
                {formatTime(nearestEvent.startTime)} - {nearestEvent.title}
              </p>
              <p className="text-xs text-warning font-medium">
                📍 {formatDistance(nearestEvent.venue.distance)} weg
              </p>
            </div>
            <button
              onClick={onExpandDistance}
              className="bg-warning text-white px-4 py-2 rounded-lg hover:bg-warning/90 transition-colors flex items-center gap-2 animate-bounce-x"
            >
              <span>→</span>
            </button>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-4">
          Klik op de pijl om de afstandsfilter uit te breiden
        </p>
      </div>
    );
  }

  // Generic empty state
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4">🍽️</div>
      <p className="text-lg font-medium text-gray-600 mb-2">
        Geen gratis eten gevonden
      </p>
      <p className="text-sm text-gray-500 max-w-md mb-6">
        Probeer een andere tijdsperiode of vergroot de afstandsfilter
      </p>
      
      <div className="bg-gray-50 rounded-lg p-4 max-w-md text-left">
        <p className="text-sm font-medium text-gray-700 mb-3">💡 Tips:</p>
        <ul className="text-xs text-gray-600 space-y-2">
          <li>• Vergroot de afstandsfilter naar 5km of "Alles"</li>
          <li>• Probeer de "Open nu" filter voor directe beschikbaarheid</li>
          <li>• Kijk naar andere dagen in de week</li>
          <li>• Check de "Geen aanmelding" filter voor vrije inloop</li>
        </ul>
      </div>
      
      <div className="mt-6 text-xs text-gray-400">
        <p>💬 Heb je een fout gevonden? Laat het ons weten!</p>
      </div>
    </div>
  );
}





