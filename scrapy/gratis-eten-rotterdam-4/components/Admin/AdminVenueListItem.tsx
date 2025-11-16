
import React, { useState } from 'react';
import type { Venue, VenueCategory, FoodEvent } from '../../types';
import { formatRecurrenceRule } from '../../utils/recurrence';

const translateVenueCategory = (category: VenueCategory): string => {
    switch (category) {
        case 'COMMUNITY': return 'Sociaal';
        case 'RELIGIOUS': return 'Religieus';
        case 'FOOD_BANK': return 'Voedselbank';
        case 'COMMERCIAL': return 'Commercieel';
        default: return category;
    }
};

const StatusBadge: React.FC<{ status: 'VERIFIED' | 'NEEDS_VERIFICATION' }> = ({ status }) => {
  if (status === 'VERIFIED') {
    return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Gepubliceerd</span>;
  }
  return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Concept</span>;
};


interface AdminVenueListItemProps {
  venue: Venue;
  onEdit: (venue: Venue) => void;
  onDelete: (venueId: string) => void;
  events: FoodEvent[];
  onEditEvent: (event: FoodEvent) => void;
  onDeleteEvent: (eventId: string) => void;
}

const CategoryBadge: React.FC<{ category: VenueCategory }> = ({ category }) => (
  <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
    {translateVenueCategory(category)}
  </span>
);

const EventSubList: React.FC<{
    events: FoodEvent[],
    onEditEvent: (event: FoodEvent) => void,
    onDeleteEvent: (eventId: string) => void,
}> = ({ events, onEditEvent, onDeleteEvent }) => (
    <ul className="divide-y divide-border-color">
        {events.map(event => (
            <li key={event.id} className="flex justify-between items-center py-2">
                <div className="flex-grow min-w-0 pr-4">
                    <p className="text-sm font-medium text-text-primary truncate">{event.title}</p>
                    <p className="text-xs text-text-secondary">{formatRecurrenceRule(event.recurrence || { frequency: 'NONE' })}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={event.verificationStatus} />
                    <button onClick={() => onEditEvent(event)} className="p-1.5 rounded-full text-text-secondary hover:text-blue-600 hover:bg-blue-50" aria-label="Bewerken">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                    </button>
                    <button onClick={() => onDeleteEvent(event.id)} className="p-1.5 rounded-full text-text-secondary hover:text-accent hover:bg-red-50" aria-label="Verwijderen">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            </li>
        ))}
    </ul>
);


export const AdminVenueListItem: React.FC<AdminVenueListItemProps> = ({ venue, onEdit, onDelete, events, onEditEvent, onDeleteEvent }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const sortedEvents = [...events].sort((a,b) => a.title.localeCompare(b.title));

  const ExpandButton = () => (
     <button 
        onClick={() => setIsExpanded(!isExpanded)} 
        disabled={events.length === 0}
        className="p-1 rounded-full text-text-secondary hover:bg-border-color disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label={isExpanded ? "Evenementen verbergen" : "Evenementen tonen"}
     >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
    </button>
  );

  return (
    <>
      {/* --- Main Row (Desktop) --- */}
      <tr className="hidden md:table-row bg-white hover:bg-surface transition-colors">
        <td className="px-4 py-4 align-middle w-2/5 font-semibold text-text-primary">
            <div className="flex items-center gap-2">
                <ExpandButton />
                <span>{venue.name} ({events.length})</span>
            </div>
        </td>
        <td className="px-4 py-4 align-middle text-sm text-text-secondary">{venue.address}</td>
        <td className="px-4 py-4 align-middle"><CategoryBadge category={venue.category} /></td>
        <td className="px-4 py-4 align-middle text-right">
          <div className="flex items-center gap-1 justify-end">
            <button onClick={() => onEdit(venue)} className="p-2 rounded-full text-text-secondary hover:text-blue-600 hover:bg-blue-100" aria-label="Bewerken">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
            </button>
            <button onClick={() => onDelete(venue.id)} className="p-2 rounded-full text-text-secondary hover:text-accent hover:bg-red-50" aria-label="Verwijderen">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </td>
      </tr>
      
      {/* --- Expanded Events Row (Desktop) --- */}
      {isExpanded && events.length > 0 && (
          <tr className="hidden md:table-row bg-white">
              <td colSpan={4} className="p-0">
                  <div className="pl-16 pr-6 py-2">
                       <EventSubList events={sortedEvents} onEditEvent={onEditEvent} onDeleteEvent={onDeleteEvent} />
                  </div>
              </td>
          </tr>
      )}

      {/* --- Mobile Card --- */}
      <tr className="block md:hidden bg-white rounded-lg shadow-sm overflow-hidden border">
        <td className="block p-4">
          <div className="flex justify-between items-start gap-3">
             <div className="flex items-center gap-1">
                <ExpandButton />
                <p className="font-semibold text-text-primary">{venue.name} ({events.length})</p>
            </div>
            <div className="flex-shrink-0">
              <CategoryBadge category={venue.category} />
            </div>
          </div>
          <div className="mt-4 flex justify-between items-end">
            <p className="text-sm text-text-secondary flex-1 pr-4">{venue.address}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => onEdit(venue)} className="p-2 rounded-full text-text-secondary hover:text-blue-600 hover:bg-blue-100" aria-label="Bewerken">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
              </button>
              <button onClick={() => onDelete(venue.id)} className="p-2 rounded-full text-text-secondary hover:text-accent hover:bg-red-50" aria-label="Verwijderen">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </div>
          {isExpanded && events.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border-color">
                  <EventSubList events={sortedEvents} onEditEvent={onEditEvent} onDeleteEvent={onDeleteEvent} />
              </div>
          )}
        </td>
      </tr>
    </>
  );
};