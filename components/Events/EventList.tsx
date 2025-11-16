
import React from 'react';
import type { FoodEvent } from '../../types';
import { EventListItem } from './EventListItem';

interface EventListProps {
  events: FoodEvent[];
  onEventClick: (event: FoodEvent) => void;
}

export const EventList: React.FC<EventListProps> = ({ events, onEventClick }) => {
  return (
    <div className="flex-grow overflow-y-auto p-4 md:p-6 bg-surface">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {events.map(event => (
            <EventListItem key={event.id} event={event} onEventClick={onEventClick} />
          ))}
        </div>
      </div>
    </div>
  );
};
