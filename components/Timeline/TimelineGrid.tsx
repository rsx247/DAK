import React, { useRef, useEffect, useState } from 'react';
import type { FoodEvent, VenueWithDistance } from '../../types';
import { EventBlock } from '../Events/EventBlock';
import { CurrentTimeLine } from './CurrentTimeLine';
import { VenueCard } from '../Venues/VenueCard';

interface TimelineGridProps {
  venues: VenueWithDistance[];
  eventsByVenue: Map<string, FoodEvent[]>;
  currentTime: Date;
  onEventClick: (event: FoodEvent) => void;
}

const SLOT_WIDTH_PX = 80; // Width of a 1-hour slot
const TOTAL_HOURS = 24;
const TIMELINE_WIDTH = SLOT_WIDTH_PX * TOTAL_HOURS;
const VENUE_COL_WIDTH_EXPANDED_MOBILE = 160; // w-40
const VENUE_COL_WIDTH_EXPANDED_DESKTOP = 256; // w-64
const VENUE_COL_WIDTH_COLLAPSED = 80; // w-20

export const TimelineGrid: React.FC<TimelineGridProps> = ({ venues, eventsByVenue, currentTime, onEventClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentVenueColWidth = isCollapsed 
    ? VENUE_COL_WIDTH_COLLAPSED 
    : window.innerWidth >= 768 ? VENUE_COL_WIDTH_EXPANDED_DESKTOP : VENUE_COL_WIDTH_EXPANDED_MOBILE;

  // Center on current time on initial load
  useEffect(() => {
    if (scrollContainerRef.current) {
      const totalMinutes = new Date().getHours() * 60 + new Date().getMinutes();
      const scrollPosition = (totalMinutes / (TOTAL_HOURS * 60)) * TIMELINE_WIDTH;
      
      // Determine venue column width based on viewport and initial collapsed state
      const venueColWidth = VENUE_COL_WIDTH_EXPANDED_MOBILE; // Default to expanded mobile on first load
      const containerWidth = scrollContainerRef.current.offsetWidth - venueColWidth;

      // Center the current time in the visible timeline area
      const centeredScrollLeft = scrollPosition - (containerWidth / 2);
      
      scrollContainerRef.current.scrollLeft = Math.max(0, centeredScrollLeft);
    }
  }, []); // Run only once on mount to set the initial view
  
  const handleScroll = () => {
    // Only auto-collapse on mobile screens
    if (window.innerWidth < 768) {
      if (scrollContainerRef.current) {
        // If user scrolls horizontally and the panel is not collapsed, collapse it.
        if (scrollContainerRef.current.scrollLeft > 10 && !isCollapsed) {
          setIsCollapsed(true);
        }
      }
    }
  };

  const handleVenueColumnClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

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

  const CollapseToggle = () => (
    <button 
        onClick={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }}
        className="p-1 rounded-full hover:bg-border-color text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        aria-label={isCollapsed ? "Locaties uitvouwen" : "Locaties samenvouwen"}
    >
        {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        )}
    </button>
  );

  return (
    <div ref={scrollContainerRef} className="flex-grow overflow-auto" onScroll={handleScroll}>
      <div className="relative" style={{ width: `${currentVenueColWidth + TIMELINE_WIDTH}px` }}>

        {/* Sticky Header Row */}
        <div className="flex sticky top-0 bg-surface z-30 h-14">
            <div 
                onClick={handleVenueColumnClick}
                className={`flex-shrink-0 px-2 md:px-4 border-r border-b border-border-color flex items-center justify-between sticky left-0 bg-surface z-40 transition-all duration-300 ease-in-out ${isCollapsed ? 'cursor-pointer' : ''}`}
                style={{ width: `${currentVenueColWidth}px`}}
            >
                <div className="flex-grow overflow-hidden">
                    <h2 className={`text-sm font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap transition-all duration-300 ease-in-out ${isCollapsed ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'}`}>
                      LOCATIES ({venues.length})
                    </h2>
                </div>
                <CollapseToggle />
            </div>
            <div className="flex items-center border-b border-border-color relative z-30 bg-surface">
                {renderTimeHeaders()}
            </div>
        </div>
        
        {/* Main Content Grid Wrapper to solve z-index issue */}
        <div className="relative z-0">
            <div className="flex">
              {/* Sticky Venues List */}
              <div 
                onClick={handleVenueColumnClick}
                className={`flex-shrink-0 border-r border-border-color sticky left-0 bg-white z-10 transition-all duration-300 ease-in-out ${isCollapsed ? 'cursor-pointer' : ''}`}
                style={{ width: `${currentVenueColWidth}px`}}
              >
                <div className="divide-y divide-border-color">
                    {venues.map(venue => (
                        <div key={venue.id} className="h-24 p-2 flex items-center justify-center">
                            <VenueCard venue={venue} isCollapsed={isCollapsed} />
                        </div>
                    ))}
                </div>
              </div>
              
              {/* Events Timeline */}
              <div className="relative flex-grow" style={{ width: `${TIMELINE_WIDTH}px` }}>
                  <CurrentTimeLine currentTime={currentTime} minutesToPosition={minutesToPosition} />
                  
                  {/* Grid lines */}
                  {Array.from({ length: TOTAL_HOURS }).map((_, hour) => (
                    <div key={`grid-${hour}`} className="absolute top-0 bottom-0 border-r border-dashed border-border-color" style={{ left: `${hour * SLOT_WIDTH_PX}px`, width: '1px' }}></div>
                  ))}
                  
                  {/* Event Rows */}
                  <div className="divide-y divide-border-color relative">
                      {venues.map((venue) => (
                        <div key={venue.id} className="h-24 relative">
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
                                stickyLeft={currentVenueColWidth}
                              />
                            );
                          })}
                        </div>
                      ))}
                  </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};