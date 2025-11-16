import React from 'react';
import type { DailyEventGrouping, FoodEvent, TimeViewMode } from '../../types';
import { VenueCard } from '../Venues/VenueCard';

interface ChronologicalGridViewProps {
  dailyGroupings: DailyEventGrouping[];
  currentTime: Date;
  onEventClick: (event: FoodEvent) => void;
  timeView: TimeViewMode;
}

export const ChronologicalGridView: React.FC<ChronologicalGridViewProps> = ({ dailyGroupings, currentTime, onEventClick, timeView }) => {
  
  const formatDateHeader = (date: Date): string => {
    return date.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\.$/, '');
  };
  
  return (
    <div className="flex-grow overflow-y-auto bg-surface">
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {dailyGroupings.map(({ date, venues, eventsByVenue }) => (
            <React.Fragment key={date.toISOString()}>
              {dailyGroupings.length > 1 && (
                <div className="md:col-span-2 lg:col-span-3 xl:col-span-4 sticky top-0 bg-surface z-10 py-2">
                  <div className="border-b border-border-color">
                    <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider pb-1">
                      {formatDateHeader(date)}
                    </h2>
                  </div>
                </div>
              )}
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
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
