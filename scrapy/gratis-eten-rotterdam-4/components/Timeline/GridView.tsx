import React from 'react';
import type { FoodEvent, VenueWithDistance } from '../../types';
import { VenueCard } from '../Venues/VenueCard';

interface GridViewProps {
  venues: VenueWithDistance[];
  eventsByVenue: Map<string, FoodEvent[]>;
  currentTime: Date;
  onEventClick: (event: FoodEvent) => void;
}

export const GridView: React.FC<GridViewProps> = ({ venues, eventsByVenue, currentTime, onEventClick }) => {
  return (
    <div className="flex-grow overflow-y-auto bg-surface">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {venues.map(venue => {
          const events = (eventsByVenue.get(venue.id) || []).sort((a,b) => a.startTime.getTime() - b.startTime.getTime());
          const isActive = events.some(e => 
            e.startTime.getTime() <= currentTime.getTime() && 
            e.endTime.getTime() > currentTime.getTime()
          );
          return (
            <VenueCard
              key={venue.id}
              venue={venue}
              events={events}
              onEventClick={onEventClick}
              isActive={isActive}
              displayMode="grid"
              currentTime={currentTime}
              // These props are for timeline view, providing defaults
              isCollapsed={false}
              zoomLevel={1}
            />
          );
        })}
      </div>
    </div>
  );
};