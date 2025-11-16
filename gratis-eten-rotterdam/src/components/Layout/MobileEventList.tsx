import { FoodEventWithDistance } from '../../types';
import { formatTimeRange, formatDate, isHappeningNow, isUpcoming } from '../../utils/time';
import { formatDistance } from '../../utils/distance';

interface ListViewProps {
  events: FoodEventWithDistance[];
  onEventClick: (event: FoodEventWithDistance) => void;
}

export function ListView({ events, onEventClick }: ListViewProps) {
  const now = new Date();
  
  // Group events by time status - more flexible than the original functions
  const nowEvents = events.filter(event => isHappeningNow(event.startTime, event.endTime));
  
  // Events happening later today (not just within 30 minutes)
  const laterTodayEvents = events.filter(event => {
    const isToday = event.startTime.toDateString() === now.toDateString();
    const isLater = event.startTime > now;
    const isNotHappeningNow = !isHappeningNow(event.startTime, event.endTime);
    return isToday && isLater && isNotHappeningNow;
  });
  
  // Events happening on other days
  const otherEvents = events.filter(event => {
    const isNotToday = event.startTime.toDateString() !== now.toDateString();
    const isNotHappeningNow = !isHappeningNow(event.startTime, event.endTime);
    return isNotToday && isNotHappeningNow;
  });

  const EventCard = ({ event, showTimeBadge = true }: { event: FoodEventWithDistance; showTimeBadge?: boolean }) => {
    const happening = isHappeningNow(event.startTime, event.endTime);
    const upcoming = isUpcoming(event.startTime);

    return (
      <article 
        className="bg-white border border-gray-200 rounded-xl p-4 mb-3 cursor-pointer transition-all hover:shadow-md active:scale-98"
        onClick={() => onEventClick(event)}
      >
        {showTimeBadge && (
          <div className="flex items-center gap-2 mb-2">
            {happening ? (
              <>
                <span className="text-sm font-medium text-red-500">Nu beschikbaar</span>
                <span className="text-xs text-gray-500">tot {event.endTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}</span>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-sm">🕐</span>
                <span className="text-sm text-gray-600">{formatTimeRange(event.startTime, event.endTime)}</span>
              </div>
            )}
          </div>
        )}
        
        <h3 className="text-base font-semibold text-gray-900 mb-1">{event.title}</h3>
        
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
          <span>📍</span>
          <span>{event.venue.name}</span>
          <span className="text-gray-400">• {formatDistance(event.venue.distance)}</span>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">
            {event.cost || 'Gratis'}
          </span>
          {event.accessLevel === 'WALK_IN' && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
              Vrije inloop
            </span>
          )}
          {event.accessLevel === 'REGISTRATION' && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
              Aanmelden vereist
            </span>
          )}
          {event.dietaryTags.map(tag => {
            return (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </span>
            );
          })}
        </div>
      </article>
    );
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          📅
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen gratis eten gevonden</h3>
        <p className="text-sm text-gray-600 mb-6">Probeer de filters aan te passen of vergroot de zoekafstand</p>
        <button className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium">
          Wijzig filters
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 bg-white">
      {nowEvents.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Nu beschikbaar
          </h2>
          {nowEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </>
      )}
      
      {laterTodayEvents.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 mt-6">
            Vandaag 18:00 - 21:00
          </h2>
          {laterTodayEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </>
      )}
      
      {otherEvents.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 mt-6">
            Andere dagen
          </h2>
          {otherEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </>
      )}
      
      {nowEvents.length === 0 && laterTodayEvents.length === 0 && otherEvents.length === 0 && events.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Alle evenementen
          </h2>
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </>
      )}
    </div>
  );
}
