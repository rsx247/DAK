
import React, { useRef, useEffect } from 'react';
import type { FoodEvent, VenueWithDistance } from '../../types';
import { EventBlock } from '../Events/EventBlock';
import { CurrentTimeLine } from './CurrentTimeLine';

interface TimelineGridProps {
  venues: VenueWithDistance[];
  eventsByVenue: Map<string, FoodEvent[]>;
  currentTime: Date;
  onEventClick: (event: FoodEvent) => void;
}

const SLOT_WIDTH_PX = 80; // Width of a 1-hour slot
const TOTAL_HOURS = 24;
const TIMELINE_WIDTH = SLOT_WIDTH_PX * TOTAL_HOURS;

export const TimelineGrid: React.FC<TimelineGridProps> = ({ venues, eventsByVenue, currentTime, onEventClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const currentHour = currentTime.getHours();
      // Scroll to a position slightly before the current time for better context
      const scrollPosition = (currentHour - 1) * SLOT_WIDTH_PX;
      scrollContainerRef.current.scrollLeft = Math.max(0, scrollPosition);
    }
  }, [currentTime]);

  const renderTimeHeaders = () => {
    return Array.from({ length: TOTAL_HOURS }).map((_, hour) => (
      <div
        key={hour}
        className="text-sm text-text-secondary text-center border-r border-border-color flex-shrink-0"
        style={{ width: `${SLOT_WIDTH_PX}px` }}
      >
        {`${hour.toString().padStart(2, '0')}:00`}
      </div>
    ));
  };
  
  const minutesToPosition = (minutes: number) => (minutes / (TOTAL_HOURS * 60)) * TIMELINE_WIDTH;

  return (
    <div ref={scrollContainerRef} className="flex-grow overflow-x-auto overflow-y-hidden">
      <div style={{ minWidth: `${TIMELINE_WIDTH}px` }} className="relative h-full flex flex-col">
        {/* Header Row */}
        <div className="flex sticky top-0 bg-surface z-10 border-b border-border-color">
          <div className="w-64 flex-shrink-0 p-4 border-r border-border-color hidden md:block"></div>
          {renderTimeHeaders()}
        </div>

        {/* Timeline Content */}
        <div className="flex-grow relative">
            <CurrentTimeLine currentTime={currentTime} minutesToPosition={minutesToPosition} />
            
            {/* Grid lines */}
            {Array.from({ length: TOTAL_HOURS }).map((_, hour) => (
              <div key={`grid-${hour}`} className="absolute top-0 bottom-0 border-r border-dashed border-border-color" style={{ left: `${hour * SLOT_WIDTH_PX}px`, width: '1px' }}></div>
            ))}
            
            {/* Venue Rows */}
            <div className="divide-y divide-border-color">
                {venues.map((venue) => (
                  <div key={venue.id} className="h-24 relative flex items-center">
                    {/* Placeholder for venue card space */}
                    <div className="w-64 flex-shrink-0 hidden md:block"></div> 
                    {(eventsByVenue.get(venue.id) || []).map((event) => {
                      const startMinutes = event.startTime.getHours() * 60 + event.startTime.getMinutes();
                      const endMinutes = event.endTime.getHours() * 60 + event.endTime.getMinutes();
                      const durationMinutes = Math.max(30, endMinutes - startMinutes);
                      
                      const left = minutesToPosition(startMinutes);
                      const width = minutesToPosition(durationMinutes);
                      
                      return (
                        <EventBlock
                          key={event.id}
                          event={event}
                          onClick={onEventClick}
                          style={{ left: `${left}px`, width: `${width}px` }}
                        />
                      );
                    })}
                  </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
