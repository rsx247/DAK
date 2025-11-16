import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import type { FoodEvent, VenueWithDistance } from '../../types';
import { EventBlock } from '../Events/EventBlock';
import { CurrentTimeLine } from './CurrentTimeLine';
import { VenueCard } from '../Venues/VenueCard';
import { getCurrentVenueColumnWidth, zoomConfigs } from '../../config/layout';
import { TimelineHeader } from './TimelineHeader';

interface TimelineGridProps {
  venues: VenueWithDistance[];
  eventsByVenue: Map<string, FoodEvent[]>;
  currentTime: Date;
  onEventClick: (event: FoodEvent) => void;
  venueCount: number;
}

const TOTAL_HOURS = 24;

export const TimelineGrid: React.FC<TimelineGridProps> = ({ venues, eventsByVenue, currentTime, onEventClick, venueCount }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level is 1

  // Refs for FLIP animation
  const venueCardRefs = useRef(new Map<string, HTMLDivElement>());
  const venueRowRefs = useRef(new Map<string, HTMLDivElement>());
  const prevPositions = useRef(new Map<string, DOMRect>());
  const isInitialMount = useRef(true);


  const currentZoomConfig = zoomConfigs[zoomLevel];
  const SLOT_WIDTH_PX = currentZoomConfig.slotWidth;
  const ROW_HEIGHT_PX = currentZoomConfig.rowHeight;
  const TIMELINE_WIDTH = SLOT_WIDTH_PX * TOTAL_HOURS;
  const currentVenueColWidth = getCurrentVenueColumnWidth(isCollapsed, zoomLevel);

  // Center on current time on initial load or when view changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const totalMinutes = new Date().getHours() * 60 + new Date().getMinutes();
      const scrollPosition = (totalMinutes / (TOTAL_HOURS * 60)) * TIMELINE_WIDTH;
      
      const containerWidth = scrollContainerRef.current.offsetWidth - currentVenueColWidth;

      // Center the current time in the visible timeline area
      const centeredScrollLeft = scrollPosition - (containerWidth / 2);
      
      scrollContainerRef.current.scrollLeft = Math.max(0, centeredScrollLeft);
    }
  }, [zoomLevel, currentVenueColWidth, TIMELINE_WIDTH]); // Re-center when zoom or width changes
  
  // FLIP Animation logic for sorting venues
  useLayoutEffect(() => {
    const newPositions = new Map<string, DOMRect>();
    const elementsToAnimate = new Map<string, { card?: HTMLDivElement; row?: HTMLDivElement }>();
    
    // LAST: Get new positions and elements
    venues.forEach(v => {
        const row = venueRowRefs.current.get(v.id);
        if (row) {
            newPositions.set(v.id, row.getBoundingClientRect());
            elementsToAnimate.set(v.id, {
                card: venueCardRefs.current.get(v.id),
                row: row
            });
        }
    });

    // Skip animation on first render, just capture initial positions
    if (isInitialMount.current) {
        isInitialMount.current = false;
        prevPositions.current = newPositions;
        return;
    }

    // INVERT: Apply transform based on position delta
    elementsToAnimate.forEach(({ card, row }, id) => {
        const prevRect = prevPositions.current.get(id);
        const newRect = newPositions.get(id);
        if (prevRect && newRect) {
            const deltaY = prevRect.top - newRect.top;
            if (Math.abs(deltaY) > 1) { // Only animate if there is a significant move
                [card, row].forEach(el => {
                    if (el) {
                        el.style.transform = `translateY(${deltaY}px)`;
                        el.style.transition = 'transform 0s';
                    }
                });
            }
        }
    });

    // PLAY: In the next frame, remove the transform to trigger the animation
    requestAnimationFrame(() => {
        elementsToAnimate.forEach(({ card, row }) => {
            [card, row].forEach(el => {
                if (el && el.style.transform) {
                    el.style.transform = '';
                    // The "jumpy smooth landing motion" without overshooting
                    el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    
                    // Cleanup transition style after animation to prevent conflicts
                    const handleTransitionEnd = () => {
                        if (el) el.style.transition = '';
                    };
                    el.addEventListener('transitionend', handleTransitionEnd, { once: true });
                }
            });
        });
    });
    
    // Update previous positions for the next render
    prevPositions.current = newPositions;
  }, [venues]); // Rerun when venues array changes its order or content

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
  
  const minutesToPosition = (minutes: number) => (minutes / (TOTAL_HOURS * 60)) * TIMELINE_WIDTH;
  
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 1, zoomConfigs.length - 1));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 1, 0));

  const ZoomControls = () => (
    <div className="fixed bottom-6 right-6 z-30 flex flex-col items-center space-y-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-border-color">
      <button onClick={handleZoomIn} disabled={zoomLevel === zoomConfigs.length - 1} className="p-2 rounded-full text-text-secondary enabled:hover:bg-surface disabled:opacity-50 transition-colors" aria-label="Inzoomen">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
      </button>
      <span className="text-xs font-mono text-text-secondary w-6 text-center" aria-live="polite" aria-atomic="true">{`x${zoomLevel+1}`}</span>
      <button onClick={handleZoomOut} disabled={zoomLevel === 0} className="p-2 rounded-full text-text-secondary enabled:hover:bg-surface disabled:opacity-50 transition-colors" aria-label="Uitzoomen">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
      </button>
    </div>
  );

  return (
    <div ref={scrollContainerRef} className="flex-grow overflow-auto relative">
      <ZoomControls />
      <div className="relative" style={{ width: `${currentVenueColWidth + TIMELINE_WIDTH}px` }}>
        
        <TimelineHeader
          venueColumnWidth={currentVenueColWidth}
          slotWidth={SLOT_WIDTH_PX}
          totalHours={TOTAL_HOURS}
          venueCount={venueCount}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
        
        {/* Main Content Grid Wrapper */}
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
                        <div 
                            key={venue.id} 
                            ref={el => el ? venueCardRefs.current.set(venue.id, el) : venueCardRefs.current.delete(venue.id)}
                            className="flex items-center justify-center transition-all duration-300 ease-in-out" 
                            style={{height: `${ROW_HEIGHT_PX}px`}}
                        >
                            <VenueCard venue={venue} isCollapsed={isCollapsed} zoomLevel={zoomLevel} />
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
                        <div 
                            key={venue.id}
                            ref={el => el ? venueRowRefs.current.set(venue.id, el) : venueRowRefs.current.delete(venue.id)}
                            className="relative" 
                            style={{height: `${ROW_HEIGHT_PX}px`}}
                        >
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
                                zoomLevel={zoomLevel}
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