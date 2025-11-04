import React from 'react';
import type { FoodEvent } from '../../types';
import { AdminEventListItem } from './AdminEventListItem';

interface AdminEventListProps {
  events: FoodEvent[];
  onEdit: (event: FoodEvent) => void;
  onDelete: (eventId: string) => void;
}

export const AdminEventList: React.FC<AdminEventListProps> = ({ events, onEdit, onDelete }) => {
  // Sort events by start time, most recent first
  const sortedEvents = [...events].sort((a, b) => b.startTime.getTime() - a.startTime.getTime());

  if (events.length === 0) {
     return <p className="text-center p-8 text-text-secondary">Geen evenementen gevonden.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-surface hidden md:table-header-group">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider w-2/5">Evenement</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Datum & Tijd</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Herhaling</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
            <th scope="col" className="relative px-4 py-3"><span className="sr-only">Acties</span></th>
          </tr>
        </thead>
        <tbody className="space-y-4 md:space-y-0 md:divide-y md:divide-border-color">
          {sortedEvents.map(event => (
            <AdminEventListItem key={event.id} event={event} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
};