import React from 'react';
import type { DailyEventGrouping, FoodEvent } from '../../types';
import { EventListItem } from './EventListItem';

interface EventListProps {
  dailyGroupings: DailyEventGrouping[];
  onEventClick: (event: FoodEvent) => void;
  currentTime: Date;
}

export const EventList: React.FC<EventListProps> = ({ dailyGroupings, onEventClick, currentTime }) => {
  
  const formatDateHeader = (date: Date): string => {
    return date.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/\.$/, '');
  };

  return (
    <div className="flex-grow overflow-y-auto bg-surface">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="space-y-6 py-4 md:py-6">
          {dailyGroupings.map(({ date, venues, eventsByVenue }) => {
            const allEventsForDay = venues.flatMap(v => eventsByVenue.get(v.id) || []);
            if (allEventsForDay.length === 0) return null;
            
            const eventsSorted = allEventsForDay.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

            return (
              <div key={date.toISOString()}>
                <div className="sticky top-0 bg-surface z-10 py-2">
                  <div className="border-b border-border-color">
                    <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider pb-1">
                      {formatDateHeader(date)}
                    </h2>
                  </div>
                </div>
                <div className="space-y-4 pt-4">
                  {eventsSorted.map(event => (
                    <EventListItem key={event.id} event={event} onEventClick={onEventClick} currentTime={currentTime} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};