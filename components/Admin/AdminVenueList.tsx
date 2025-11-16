import React from 'react';
import type { Venue } from '../../types';
import { AdminVenueListItem } from './AdminVenueListItem';

interface AdminVenueListProps {
  venues: Venue[];
  onEdit: (venue: Venue) => void;
  onDelete: (venueId: string) => void;
}

export const AdminVenueList: React.FC<AdminVenueListProps> = ({ venues, onEdit, onDelete }) => {
  if (venues.length === 0) {
     return <p className="text-center p-8 text-text-secondary">Geen locaties gevonden.</p>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-surface hidden md:table-header-group">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider w-2/5">Naam</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Adres</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Categorie</th>
            <th scope="col" className="relative px-4 py-3"><span className="sr-only">Acties</span></th>
          </tr>
        </thead>
        <tbody className="space-y-4 md:space-y-0 md:divide-y md:divide-border-color">
          {venues.map(venue => (
            <AdminVenueListItem key={venue.id} venue={venue} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
