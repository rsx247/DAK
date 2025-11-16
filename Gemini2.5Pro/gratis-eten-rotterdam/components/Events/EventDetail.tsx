
import React from 'react';
import type { FoodEvent } from '../../types';
import { formatTime } from '../../utils/time';

interface EventDetailProps {
  event: FoodEvent;
  onClose: () => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({ event, onClose }) => {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue.address)}`;

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
              <h2 className="text-2xl font-bold text-text-primary">{event.title}</h2>
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
            <InfoRow icon="📍" label="Adres" value={`${event.venue.address}, ${event.venue.city}`} />
            <InfoRow icon="ℹ️" label="Beschrijving" value={event.description} />
            <InfoRow icon="💰" label="Kosten" value={event.cost || 'Onbekend'} />
            <InfoRow icon="🚪" label="Toegang" value={event.accessLevel.replace('_', ' ')} />
            {event.dietaryTags.length > 0 && (
              <InfoRow icon="🥗" label="Dieet" value={event.dietaryTags.join(', ')} />
            )}
          </div>

          <div className="mt-6 border-t border-border-color pt-6">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-accent text-white text-center font-bold py-3 rounded-lg block hover:bg-red-600 transition-colors"
            >
              Navigeer via Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex">
    <div className="w-8 text-xl">{icon}</div>
    <div className="flex-1">
      <p className="font-semibold text-text-primary">{label}</p>
      <p className="text-text-secondary">{value}</p>
    </div>
  </div>
);
