import React from 'react';
import type { Venue } from '../../types';

interface AdminVenueListItemProps {
  venue: Venue;
  onEdit: (venue: Venue) => void;
  onDelete: (venueId: string) => void;
}

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => (
  <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
    {category.toLowerCase().replace('_', ' ')}
  </span>
);

export const AdminVenueListItem: React.FC<AdminVenueListItemProps> = ({ venue, onEdit, onDelete }) => {
  return (
    <tr className="block md:table-row bg-white rounded-lg shadow-sm md:shadow-none overflow-hidden border md:border-none md:hover:bg-surface transition-colors">

      {/* --- Desktop Cells --- */}
      <td className="hidden md:table-cell px-4 py-4 align-middle w-2/5 font-semibold text-text-primary">{venue.name}</td>
      <td className="hidden md:table-cell px-4 py-4 align-middle text-sm text-text-secondary">{venue.address}</td>
      <td className="hidden md:table-cell px-4 py-4 align-middle"><CategoryBadge category={venue.category} /></td>
      <td className="hidden md:table-cell px-4 py-4 align-middle text-right">
        <div className="flex items-center gap-1 justify-end">
          <button onClick={() => onEdit(venue)} className="p-2 rounded-full text-text-secondary hover:text-blue-600 hover:bg-blue-100" aria-label="Bewerken">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
          </button>
          <button onClick={() => onDelete(venue.id)} className="p-2 rounded-full text-text-secondary hover:text-accent hover:bg-red-50" aria-label="Verwijderen">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          </button>
        </div>
      </td>
      
      {/* --- Mobile Card --- */}
      <td className="block md:hidden p-4">
        <div className="flex justify-between items-start gap-3">
          <p className="font-semibold text-text-primary">{venue.name}</p>
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
      </td>
    </tr>
  );
};
