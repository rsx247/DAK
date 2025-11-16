import React from 'react';
import type { FoodEvent, AccessLevel } from '../../types';
import { formatTime } from '../../utils/time';
import { formatRecurrenceRule } from '../../utils/recurrence';

const translateAccessLevel = (level: AccessLevel): string => {
    switch (level) {
        case 'WALK_IN': return 'Vrije inloop';
        case 'REGISTRATION': return 'Registratie vereist';
        case 'REFERRAL': return 'Verwijzing nodig';
        default: return level;
    }
};

const translateDietaryTag = (tag: string): string => {
    switch (tag.toLowerCase()) {
        case 'vegetarian': return 'Vegetarisch';
        case 'vegan': return 'Veganistisch';
        case 'halal': return 'Halal';
        default: return tag;
    }
};

interface EventDetailProps {
  event: FoodEvent;
  onClose: () => void;
  isAdmin: boolean;
  onEdit: (event: FoodEvent) => void;
  onDelete: (eventId: string) => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({ event, onClose, isAdmin, onEdit, onDelete }) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue.address)}`;
  const now = new Date();
  const deadlinePassed = event.registrationDeadline && event.registrationDeadline < now;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3">
                 <h2 className="text-2xl font-bold text-text-primary">{event.title}</h2>
                 {event.verificationStatus === 'NEEDS_VERIFICATION' && (
                    <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full">Concept</span>
                 )}
              </div>
              <p className="text-text-secondary text-lg mt-1">{event.venue.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-6 border-t border-border-color pt-6 space-y-4">
            <InfoRow icon="🕒" label="Tijd" value={`${formatTime(event.startTime)} - ${formatTime(event.endTime)}`} />
            {event.recurrence && event.recurrence.frequency !== 'NONE' && (
                 <InfoRow icon="🔄" label="Herhaling" value={formatRecurrenceRule(event.recurrence)} />
            )}
            <InfoRow icon="📍" label="Adres" value={`${event.venue.address}, ${event.venue.city}`} />
            <InfoRow icon="ℹ️" label="Beschrijving" value={event.description} />
            <InfoRow icon="💰" label="Kosten" value={event.cost || 'Onbekend'} />
            <InfoRow icon="🚪" label="Toegang" value={translateAccessLevel(event.accessLevel)} />
            {event.registrationDeadline && (
              <InfoRow 
                icon="📅" 
                label="Aanmelden tot" 
                value={
                    <span className={deadlinePassed ? 'text-red-500 font-semibold' : ''}>
                        {event.registrationDeadline.toLocaleString('nl-NL', { dateStyle: 'full', timeStyle: 'short' })}
                        {deadlinePassed && ' (deadline verstreken)'}
                    </span>
                } 
              />
            )}
            {event.dietaryTags.length > 0 && (
              <InfoRow icon="🥗" label="Dieet" value={event.dietaryTags.map(translateDietaryTag).join(', ')} />
            )}
            {event.sourceUrl && (
              <InfoRow 
                icon="🔗" 
                label="Bron" 
                value={
                  <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                    Link naar bron
                  </a>
                } 
              />
            )}
          </div>
          
          <div className="mt-6 border-t border-border-color pt-6 space-y-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-accent text-white text-center font-bold py-3 rounded-lg block hover:bg-red-600 transition-colors"
            >
              Navigeer via Google Maps
            </a>
            {isAdmin && (
                <div className="flex items-center justify-center space-x-3">
                    <button onClick={() => onEdit(event)} className="flex-1 text-center bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors">
                        Bewerken
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(event.id); }} className="flex-1 text-center bg-gray-200 text-text-secondary font-bold py-3 rounded-lg hover:bg-gray-300 transition-colors">
                        Verwijderen
                    </button>
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ icon: string; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
  <div className="flex">
    <div className="w-8 text-xl">{icon}</div>
    <div className="flex-1">
      <p className="font-semibold text-text-primary">{label}</p>
      <p className="text-text-secondary">{value}</p>
    </div>
  </div>
);
