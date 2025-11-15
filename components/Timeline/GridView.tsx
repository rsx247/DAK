import React from 'react';
import type { VenueEventGrouping, FoodEvent, TimeViewMode } from '../../types';
import { VenueCard } from '../Venues/VenueCard';

interface GridViewProps {
  venueGroupings: VenueEventGrouping;
  currentTime: Date;
  onEventClick: (event: FoodEvent) => void;
  timeView: TimeViewMode;
}

export const GridView: React.FC<GridViewProps> = ({ venueGroupings, currentTime, onEventClick, timeView }) => {
  const { venues, eventsByVenue } = venueGroupings;

  return (
    <div className="flex-grow overflow-y-auto bg-surface">
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {venues.map(venue => {
            const events = (eventsByVenue.get(venue.id) || []).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
            if (events.length === 0) return null;

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
                isCollapsed={false}
                zoomLevel={1}
                timeView={timeView}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
