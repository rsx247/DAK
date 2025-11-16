import { FoodEventWithDistance } from '../../types';
import { formatTimeRange, formatDate, isHappeningNow, isPast, isUpcoming } from '../../utils/time';
import { formatDistance } from '../../utils/distance';

interface EventDetailProps {
  event: FoodEventWithDistance;
  onClose: () => void;
}

export function EventDetail({ event, onClose }: EventDetailProps) {
  const happening = isHappeningNow(event.startTime, event.endTime);
  const past = isPast(event.endTime);
  const upcoming = isUpcoming(event.startTime);

  // Calculate walking time (assuming 5 km/h average walking speed)
  const walkingTimeMinutes = Math.round((event.venue.distance / 5) * 60);

  const handleNavigate = () => {
    const { lat, lng } = event.venue;
    // Open in default maps app (Google Maps on Android, Apple Maps on iOS)
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const handleRegister = () => {
    if (event.registrationUrl) {
      window.open(event.registrationUrl, '_blank');
    } else if (event.registrationPhone) {
      window.location.href = `tel:${event.registrationPhone}`;
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
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-text">{event.title}</h2>
              {happening && (
                <span className="bg-success text-white text-xs px-2 py-1 rounded-full font-medium">
                  NU
                </span>
              )}
              {upcoming && !happening && (
                <span className="bg-warning text-white text-xs px-2 py-1 rounded-full font-medium">
                  BINNENKORT
                </span>
              )}
              {past && (
                <span className="bg-gray-400 text-white text-xs px-2 py-1 rounded-full font-medium">
                  VOORBIJ
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{event.venue.name}</p>
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
          {/* Time & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Tijd</p>
              <p className="font-medium text-text">{formatTimeRange(event.startTime, event.endTime)}</p>
              <p className="text-sm text-gray-600">{formatDate(event.startTime)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Afstand</p>
              <p className="font-medium text-primary">📍 {formatDistance(event.venue.distance)}</p>
              <p className="text-sm text-gray-600">🚶‍♂️ {walkingTimeMinutes} min lopen</p>
              <p className="text-sm text-gray-600">{event.venue.address}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Beschrijving</p>
            <p className="text-sm text-gray-700">{event.description}</p>
          </div>

          {/* Food Type & Dietary Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Type</p>
              <p className="text-sm font-medium text-text">{event.foodType}</p>
            </div>
            {event.dietaryTags.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Dieet</p>
                <div className="flex flex-wrap gap-1">
                  {event.dietaryTags.map(tag => {
                    const dietaryIcons: Record<string, string> = {
                      'halal': '☪️',
                      'vegan': '🌱',
                      'vegan-option': '🌱',
                      'vegetarian': '🥬',
                      'vegetarian-option': '🥬',
                      'gluten-free': '🌾',
                      'nut-free': '🥜',
                    };
                    return (
                      <span key={tag} className="text-xs bg-success/10 text-success px-2 py-1 rounded flex items-center gap-1">
                        {dietaryIcons[tag] || ''} {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Access Level */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Toegang</p>
            <div className="flex items-center gap-2">
              {event.accessLevel === 'WALK_IN' && (
                <span className="text-sm bg-success/10 text-success px-3 py-1 rounded-full font-medium">
                  🚶 Vrije inloop
                </span>
              )}
              {event.accessLevel === 'REGISTRATION' && (
                <span className="text-sm bg-warning/10 text-warning px-3 py-1 rounded-full font-medium">
                  📋 Aanmelding vereist
                </span>
              )}
              {event.accessLevel === 'REFERRAL' && (
                <span className="text-sm bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">
                  🎫 Doorverwijzing nodig
                </span>
              )}
            </div>
          </div>

          {/* Cost & Quantity */}
          <div className="grid grid-cols-2 gap-4">
            {event.cost && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Kosten</p>
                <p className="text-sm font-medium text-text">{event.cost}</p>
              </div>
            )}
            {event.quantity && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Beschikbaarheid</p>
                <p className="text-sm text-gray-700">{event.quantity}</p>
              </div>
            )}
          </div>

          {/* Verification Status */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Informatie status</p>
                <div className="flex items-center gap-2">
                  {event.verificationStatus === 'VERIFIED' && (
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded flex items-center gap-1">
                      ✅ Geverifieerd
                    </span>
                  )}
                  {event.verificationStatus === 'NEEDS_VERIFICATION' && (
                    <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded flex items-center gap-1">
                      ⚠️ Controle nodig
                    </span>
                  )}
                  {event.verificationStatus === 'UNVERIFIED' && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center gap-1">
                      ❓ Niet geverifieerd
                    </span>
                  )}
                  {event.lastVerified && (
                    <span className="text-xs text-gray-500">
                      Laatst gecontroleerd: {new Date(event.lastVerified).toLocaleDateString('nl-NL')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 space-y-3">
          {event.accessLevel === 'WALK_IN' && (
            <>
              <button
                onClick={handleNavigate}
                className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                🗺️ Navigeren naar locatie
              </button>
              <p className="text-xs text-gray-500 text-center">
                {walkingTimeMinutes} minuten lopen • {formatDistance(event.venue.distance)}
              </p>
            </>
          )}
          
          {(event.accessLevel === 'REGISTRATION' || event.accessLevel === 'REFERRAL') && (
            <>
              <button
                onClick={handleRegister}
                className="w-full bg-warning text-white py-3 px-4 rounded-lg font-medium hover:bg-warning/90 transition-colors"
              >
                📝 Aanmelden
                {event.registrationPhone && ` (bel ${event.registrationPhone})`}
              </button>
              <button
                onClick={handleNavigate}
                className="w-full border-2 border-primary text-primary py-3 px-4 rounded-lg font-medium hover:bg-primary/5 transition-colors"
              >
                🗺️ Locatie bekijken
              </button>
              <p className="text-xs text-gray-500 text-center">
                {walkingTimeMinutes} minuten lopen • {formatDistance(event.venue.distance)}
              </p>
            </>
          )}

          {/* Disabled state for past events */}
          {past && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Dit evenement is al voorbij</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}





