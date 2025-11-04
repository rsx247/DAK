import React from 'react';
import type { FoodEvent } from '../../types';
import { formatRecurrenceRule } from '../../utils/recurrence';

interface AdminEventListItemProps {
  event: FoodEvent;
  onEdit: (event: FoodEvent) => void;
  onDelete: (eventId: string) => void;
}

const StatusBadge: React.FC<{ status: 'VERIFIED' | 'NEEDS_VERIFICATION' }> = ({ status }) => {
  if (status === 'VERIFIED') {
    return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Gepubliceerd</span>;
  }
  return <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Concept</span>;
};

export const AdminEventListItem: React.FC<AdminEventListItemProps> = ({ event, onEdit, onDelete }) => {
  const formattedDateTime = event.startTime.toLocaleString('nl-NL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const recurrenceText = (event.recurrence && event.recurrence.frequency !== 'NONE')
    ? formatRecurrenceRule(event.recurrence)
    : 'Eenmalig';
  
  const SourceLinkIcon: React.FC<{ url: string }> = ({ url }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent flex-shrink-0" title="Bekijk bron">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );

  return (
    <tr className="block md:table-row bg-white rounded-lg shadow-sm md:shadow-none overflow-hidden border md:border-none md:hover:bg-surface transition-colors">
      
      {/* --- Desktop Cells --- */}
      <td className="hidden md:table-cell px-4 py-4 align-top w-2/5">
         <div className="flex items-start gap-2">
            <div className="flex-grow">
                <p className="font-semibold text-text-primary">{event.title}</p>
                <p className="text-sm text-text-secondary mt-1">{event.venue.name}</p>
            </div>
            {event.sourceUrl && <SourceLinkIcon url={event.sourceUrl} />}
        </div>
      </td>
      <td className="hidden md:table-cell px-4 py-4 align-middle text-sm text-text-secondary">{formattedDateTime}</td>
      <td className="hidden md:table-cell px-4 py-4 align-middle text-sm text-text-secondary">{recurrenceText}</td>
      <td className="hidden md:table-cell px-4 py-4 align-middle"><StatusBadge status={event.verificationStatus} /></td>
      <td className="hidden md:table-cell px-4 py-4 align-middle text-right">
        <div className="flex items-center gap-1 justify-end">
          <button onClick={() => onEdit(event)} className="p-2 rounded-full text-text-secondary hover:text-blue-600 hover:bg-blue-100" aria-label="Bewerken">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
          </button>
          <button onClick={() => onDelete(event.id)} className="p-2 rounded-full text-text-secondary hover:text-accent hover:bg-red-50" aria-label="Verwijderen">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          </button>
        </div>
      </td>
      
      {/* --- Mobile Card --- */}
      <td className="block md:hidden p-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-grow">
            <div className="flex items-start gap-2">
                <p className="font-semibold text-text-primary flex-grow">{event.title}</p>
                {event.sourceUrl && <SourceLinkIcon url={event.sourceUrl} />}
            </div>
            <p className="text-sm text-text-secondary mt-1">{event.venue.name}</p>
          </div>
          <div className="flex-shrink-0">
            <StatusBadge status={event.verificationStatus} />
          </div>
        </div>
        <div className="mt-4 flex justify-between items-end">
          <div>
            <p className="text-sm text-text-secondary">{formattedDateTime}</p>
            <p className="text-xs text-text-secondary mt-1">{recurrenceText}</p>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(event)} className="p-2 rounded-full text-text-secondary hover:text-blue-600 hover:bg-blue-100" aria-label="Bewerken">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
            </button>
            <button onClick={() => onDelete(event.id)} className="p-2 rounded-full text-text-secondary hover:text-accent hover:bg-red-50" aria-label="Verwijderen">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
};