import { VenueWithDistance, FoodEventWithDistance } from '../../types';
import { formatDistance } from '../../utils/distance';
import { foodEvents } from '../../data/events';
import { formatTimeRange, formatDate, isUpcoming } from '../../utils/time';

interface VenueInfoProps {
  venue: VenueWithDistance;
  onClose: () => void;
}

const categoryLabels: Record<string, string> = {
  COMMUNITY: 'Gemeenschapscentrum',
  RELIGIOUS: 'Religieuze organisatie',
  FOOD_BANK: 'Voedselbank',
  FOOD_RESCUE: 'Voedselredding',
  COMMERCIAL: 'Commercieel',
};

export function VenueInfo({ venue, onClose }: VenueInfoProps) {
  // Calculate walking time (assuming 5 km/h average walking speed)
  const walkingTimeMinutes = Math.round((venue.distance / 5) * 60);

  // Get upcoming events for this venue
  const upcomingEvents = foodEvents
    .filter(event => event.venue.id === venue.id && isUpcoming(event.startTime))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, 3); // Show next 3 events

  const handleNavigate = () => {
    const { lat, lng } = venue;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const handleWebsite = () => {
    if (venue.website) {
      window.open(venue.website, '_blank');
    }
  };

  const handleCall = () => {
    if (venue.phone) {
      window.location.href = `tel:${venue.phone}`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center md:justify-center" onClick={onClose}>
      <div 
        className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[90vh] md:max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-text">{venue.name}</h2>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-sm text-primary font-medium">
                📍 {formatDistance(venue.distance)} afstand
              </p>
              <p className="text-sm text-gray-600">
                🚶‍♂️ {walkingTimeMinutes} min lopen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Category */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Type organisatie</p>
            <span className="inline-block bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
              {categoryLabels[venue.category] || venue.category}
            </span>
          </div>

          {/* About */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Over deze organisatie</p>
            <p className="text-sm text-gray-700 leading-relaxed">{venue.about}</p>
          </div>

          {/* Address */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Adres</p>
            <p className="text-sm text-text font-medium">{venue.address}</p>
            <p className="text-sm text-gray-600">{venue.city}</p>
          </div>

          {/* Contact Info */}
          {(venue.phone || venue.website) && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Contact</p>
              <div className="space-y-2">
                {venue.phone && (
                  <button
                    onClick={handleCall}
                    className="flex items-center gap-2 text-sm text-secondary hover:text-secondary/80"
                  >
                    📞 {venue.phone}
                  </button>
                )}
                {venue.website && (
                  <button
                    onClick={handleWebsite}
                    className="flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 break-all"
                  >
                    🌐 {venue.website.replace(/^https?:\/\//, '')}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Aankomende evenementen</p>
              <div className="space-y-2">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text">{event.title}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {formatDate(event.startTime)} • {formatTimeRange(event.startTime, event.endTime)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{event.foodType}</p>
                      </div>
                      <div className="ml-2">
                        {event.accessLevel === 'WALK_IN' && (
                          <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                            Vrije inloop
                          </span>
                        )}
                        {event.accessLevel === 'REGISTRATION' && (
                          <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded">
                            Aanmelding
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Status */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Informatie status</p>
                <div className="flex items-center gap-2">
                  {venue.verificationStatus === 'VERIFIED' && (
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded flex items-center gap-1">
                      ✅ Geverifieerd
                    </span>
                  )}
                  {venue.verificationStatus === 'NEEDS_VERIFICATION' && (
                    <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded flex items-center gap-1">
                      ⚠️ Controle nodig
                    </span>
                  )}
                  {venue.verificationStatus === 'UNVERIFIED' && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center gap-1">
                      ❓ Niet geverifieerd
                    </span>
                  )}
                  {venue.lastVerified && (
                    <span className="text-xs text-gray-500">
                      Laatst gecontroleerd: {new Date(venue.lastVerified).toLocaleDateString('nl-NL')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 space-y-3">
          <button
            onClick={handleNavigate}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            🗺️ Navigeren naar locatie
          </button>
          
          <div className="flex gap-2">
            {venue.phone && (
              <button
                onClick={handleCall}
                className="flex-1 border-2 border-secondary text-secondary py-3 px-4 rounded-lg font-medium hover:bg-secondary/5 transition-colors"
              >
                📞 Bellen
              </button>
            )}
            {venue.website && (
              <button
                onClick={handleWebsite}
                className="flex-1 border-2 border-secondary text-secondary py-3 px-4 rounded-lg font-medium hover:bg-secondary/5 transition-colors"
              >
                🌐 Website
              </button>
            )}
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            {walkingTimeMinutes} minuten lopen • {formatDistance(venue.distance)}
          </p>
        </div>
      </div>
    </div>
  );
}





